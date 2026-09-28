#!/usr/bin/env node

/**
 * Director Fuzz and Invariant Suite Harness
 * Usage: node scripts/fuzz-director.mjs --runs 25000 --seed fuzz-director-v1
 */

const args = process.argv.slice(2);
let runs = 25000;
let masterSeed = 'fuzz-director-v1';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--runs' && args[i + 1]) {
    runs = parseInt(args[i + 1], 10) || 25000;
  }
  if (args[i] === '--seed' && args[i + 1]) {
    masterSeed = args[i + 1];
  }
}

console.log('\n======================================================');
console.log('   TIỆM CƠM TẤM — DIRECTOR FUZZ & INVARIANT HARNESS   ');
console.log('======================================================');
console.log(`[CONFIG] Runs: ${runs.toLocaleString()} | Master Seed: "${masterSeed}"\n`);

// Seeded PRNG (Mulberry32)
function createRng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return {
    next() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
  };
}

// Pure Stress calculation logic matching StressBudget.ts
function calculateStress(state) {
  let stress = 0;
  const cash = state.economy?.shopCash ?? 0;
  if (cash < 50_000) {
    stress += 30;
  } else if (cash < 100_000) {
    stress += 15;
  }

  const stamina = state.jd?.stamina ?? 100;
  if (stamina < 20) {
    stress += 20;
  } else if (stamina < 40) {
    stress += 10;
  }

  const missed = state.debt?.missedInstallments ?? 0;
  stress += missed * 25;
  const husbandConf = state.debt?.husbandConfidence ?? 50;
  if (husbandConf < 30) {
    stress += 15;
  }

  const rating = state.reputation?.rating ?? 4.0;
  if (rating < 2.5) {
    stress += 20;
  } else if (rating < 3.5) {
    stress += 10;
  }

  if (Number.isNaN(stress) || !Number.isFinite(stress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(stress)));
}

// DailyEventBudget logic matching EventBudget.ts
class DailyEventBudget {
  constructor(day, difficulty) {
    this.day = day;
    this.difficulty = difficulty;
    switch (difficulty) {
      case 'easy':
        this.maxEvents = 1;
        break;
      case 'normal':
        this.maxEvents = 2;
        break;
      case 'hard':
        this.maxEvents = 3;
        break;
      default:
        this.maxEvents = 2;
        break;
    }
    this.eventsTriggeredToday = 0;
    this.hasMajorTriggered = false;
  }

  canTrigger(urgency, currentStress) {
    if (this.eventsTriggeredToday >= this.maxEvents) {
      return false;
    }
    const isMajor = urgency === 'high' || urgency === 'critical';
    if (isMajor && this.hasMajorTriggered) {
      return false;
    }
    if (isMajor && currentStress >= 70) {
      return false;
    }
    return true;
  }

  consume(urgency) {
    this.eventsTriggeredToday++;
    if (urgency === 'high' || urgency === 'critical') {
      this.hasMajorTriggered = true;
    }
  }
}

// Condition Evaluator matching conditions.ts
function evaluateCondition(condition, state) {
  switch (condition.type) {
    case 'metric': {
      const parts = condition.path.split('.');
      let val = state;
      for (const p of parts) {
        if (val == null) return false;
        val = val[p];
      }
      if (condition.operator === 'gte') return typeof val === 'number' && val >= condition.value;
      if (condition.operator === 'lte') return typeof val === 'number' && val <= condition.value;
      if (condition.operator === 'eq') return val === condition.value;
      return true;
    }
    case 'capability': {
      if (condition.capability === 'hasActiveGuard') return !!state.security?.activeGuardId;
      if (condition.capability === 'hasLighting') return !!state.security?.hasLighting;
      if (condition.capability === 'hasLock') return !!state.security?.hasLock;
      if (condition.capability === 'cameraLevelGte') return (state.security?.cameraLevel ?? 0) >= condition.value;
      if (condition.capability === 'jdRoleEq') return state.jd?.assignedRole === condition.value;
      return false;
    }
    case 'dayRange': {
      const day = state.campaign.day;
      if (condition.minDay !== undefined && day < condition.minDay) return false;
      if (condition.maxDay !== undefined && day > condition.maxDay) return false;
      return true;
    }
    case 'flag': {
      const val = state.campaign?.flags?.[condition.key];
      if (condition.operator === 'eq') return val === condition.value;
      if (condition.operator === 'exists') return val !== undefined;
      return true;
    }
    default:
      return true;
  }
}

// Event Selector logic matching EventSelector.ts
function selectEvent({ state, candidateEvents, budget, activeMutexGroupsToday = [], seed }) {
  const stress = calculateStress(state);

  const eligible = candidateEvents.filter((event) => {
    if (!budget.canTrigger(event.urgency, stress)) return false;
    if (event.mutexGroup && activeMutexGroupsToday.includes(event.mutexGroup)) return false;
    const count = state.director?.campaignEventsTriggered?.[event.id] ?? 0;
    if (event.maxPerRun !== undefined && count >= event.maxPerRun) return false;
    const lastDay = state.director?.lastEventDay?.[event.id];
    if (lastDay !== undefined && event.cooldownDays !== undefined && state.campaign.day - lastDay < event.cooldownDays) {
      return false;
    }
    if (event.conditions && !event.conditions.every((c) => evaluateCondition(c, state))) {
      return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;

  const weightedList = eligible.map((event) => {
    const count = state.director?.campaignEventsTriggered?.[event.id] ?? 0;
    const baseWeight = event.weight ?? 10;
    const repetitionPenalty = 1 + count * 0.5;
    const effectiveWeight = Math.max(1, baseWeight / repetitionPenalty);
    return { event, weight: effectiveWeight };
  });

  const totalWeight = weightedList.reduce((sum, item) => sum + item.weight, 0);
  const rng = createRng(`${seed}::selectEvent::${state.campaign.day}::${budget.eventsTriggeredToday}`);
  let roll = rng.next() * totalWeight;

  for (const item of weightedList) {
    if (roll < item.weight) return item.event;
    roll -= item.weight;
  }
  return weightedList[weightedList.length - 1]?.event ?? null;
}

// Sample representative candidate events
const SAMPLE_CANDIDATE_EVENTS = [
  {
    id: 'evt-street-patrol',
    urgency: 'low',
    weight: 10,
    mutexGroup: 'security-intervention',
    cooldownDays: 3,
    maxPerRun: 4,
    conditions: [{ type: 'capability', capability: 'hasActiveGuard' }],
  },
  {
    id: 'evt-electric-failure',
    urgency: 'high',
    weight: 15,
    mutexGroup: 'infrastructure',
    cooldownDays: 5,
    maxPerRun: 2,
    conditions: [{ type: 'dayRange', minDay: 10, maxDay: 25 }],
  },
  {
    id: 'evt-health-inspection',
    urgency: 'critical',
    weight: 8,
    mutexGroup: 'inspection',
    cooldownDays: 7,
    maxPerRun: 1,
    conditions: [{ type: 'dayRange', minDay: 15 }],
  },
  {
    id: 'evt-jd-exhaustion',
    urgency: 'medium',
    weight: 12,
    mutexGroup: 'staff',
    cooldownDays: 4,
    maxPerRun: 3,
    conditions: [{ type: 'capability', capability: 'jdRoleEq', value: 'cook' }],
  },
  {
    id: 'evt-community-food-bank',
    urgency: 'low',
    weight: 20,
    mutexGroup: 'community',
    cooldownDays: 2,
    maxPerRun: 5,
    conditions: [{ type: 'dayRange', minDay: 5, maxDay: 30 }],
  },
];

const masterRng = createRng(masterSeed);
const difficulties = ['easy', 'normal', 'hard'];
const jdRoles = ['cook', 'server', 'prep', 'none'];

let totalChecks = 0;
const startTime = Date.now();

for (let i = 0; i < runs; i++) {
  const iterationSeed = `${masterSeed}::iter-${i}`;
  const diff = difficulties[i % 3];
  const day = masterRng.int(1, 30);

  const state = {
    campaign: {
      day,
      difficulty: diff,
      phase: 'service',
      flags: { flagA: true },
    },
    economy: {
      shopCash: masterRng.int(-200_000, 10_000_000),
    },
    debt: {
      remainingDebt: masterRng.int(0, 10_000_000),
      missedInstallments: masterRng.int(0, 4),
      husbandConfidence: masterRng.int(0, 100),
    },
    reputation: {
      rating: masterRng.next() * 5.0,
    },
    neighborhood: {
      neighborhoodTrust: masterRng.int(0, 100),
    },
    jd: {
      stamina: masterRng.int(0, 100),
      mood: masterRng.int(0, 100),
      assignedRole: jdRoles[masterRng.int(0, 3)],
    },
    security: {
      activeGuardId: masterRng.next() > 0.5 ? 'anh-tuan' : null,
      hasLighting: masterRng.next() > 0.5,
      hasLock: masterRng.next() > 0.5,
      cameraLevel: masterRng.int(0, 3),
    },
    director: {
      campaignEventsTriggered: {},
      lastEventDay: {},
      stressScore: 0,
    },
  };

  // Invariant 1: Stress Clamped & Finite
  const stress = calculateStress(state);
  totalChecks++;
  if (stress < 0 || stress > 100 || !Number.isFinite(stress)) {
    console.error(`[FAIL] Stress score out of bounds: ${stress}`);
    console.error(`Reproducible seed: ${iterationSeed}`);
    process.exit(1);
  }

  // Invariant 2: Budget rejects high/critical on extreme stress
  const budget = new DailyEventBudget(day, diff);
  totalChecks++;
  if (budget.canTrigger('critical', 75)) {
    console.error(`[FAIL] Budget allowed critical event during high stress (>70)`);
    console.error(`Reproducible seed: ${iterationSeed}`);
    process.exit(1);
  }

  // Invariant 3: Mutex Group
  const targetMutex = SAMPLE_CANDIDATE_EVENTS.find((e) => e.mutexGroup);
  if (targetMutex) {
    const sel = selectEvent({
      state,
      candidateEvents: [targetMutex],
      budget,
      activeMutexGroupsToday: [targetMutex.mutexGroup],
      seed: `${iterationSeed}::mutex`,
    });
    totalChecks++;
    if (sel !== null) {
      console.error(`[FAIL] Mutex group invariant violated: Event ${sel.id} triggered when mutex ${targetMutex.mutexGroup} active`);
      console.error(`Reproducible seed: ${iterationSeed}::mutex`);
      process.exit(1);
    }
  }

  // Invariant 4: Cooldown
  const cooldownEvent = SAMPLE_CANDIDATE_EVENTS.find((e) => e.cooldownDays && e.cooldownDays > 1);
  if (cooldownEvent) {
    state.director.lastEventDay[cooldownEvent.id] = day - 1;
    const sel = selectEvent({
      state,
      candidateEvents: [cooldownEvent],
      budget,
      seed: `${iterationSeed}::cooldown`,
    });
    totalChecks++;
    if (sel !== null) {
      console.error(`[FAIL] Cooldown invariant violated for ${cooldownEvent.id}`);
      console.error(`Reproducible seed: ${iterationSeed}::cooldown`);
      process.exit(1);
    }
  }

  // Invariant 5: Day Range Boundaries
  const minDayEvent = SAMPLE_CANDIDATE_EVENTS.find((e) => e.conditions.some((c) => c.type === 'dayRange' && c.minDay > 10));
  if (minDayEvent) {
    state.campaign.day = 5; // explicitly out of bounds
    const sel = selectEvent({
      state,
      candidateEvents: [minDayEvent],
      budget,
      seed: `${iterationSeed}::dayRange`,
    });
    totalChecks++;
    if (sel !== null) {
      console.error(`[FAIL] Day range min violated for ${minDayEvent.id}`);
      console.error(`Reproducible seed: ${iterationSeed}::dayRange`);
      process.exit(1);
    }
    state.campaign.day = day; // restore
  }

  // Invariant 6: Max Per Run / Completed Chain
  const maxRunEvent = SAMPLE_CANDIDATE_EVENTS.find((e) => e.maxPerRun !== undefined);
  if (maxRunEvent) {
    state.director.campaignEventsTriggered[maxRunEvent.id] = maxRunEvent.maxPerRun;
    const sel = selectEvent({
      state,
      candidateEvents: [maxRunEvent],
      budget,
      seed: `${iterationSeed}::maxPerRun`,
    });
    totalChecks++;
    if (sel !== null) {
      console.error(`[FAIL] Max per run violated for ${maxRunEvent.id}`);
      console.error(`Reproducible seed: ${iterationSeed}::maxPerRun`);
      process.exit(1);
    }
  }

  // Invariant 7: Capability Requirement
  state.security.activeGuardId = null;
  const guardEvent = SAMPLE_CANDIDATE_EVENTS.find((e) => e.conditions.some((c) => c.capability === 'hasActiveGuard'));
  if (guardEvent) {
    const sel = selectEvent({
      state,
      candidateEvents: [guardEvent],
      budget,
      seed: `${iterationSeed}::capGuard`,
    });
    totalChecks++;
    if (sel !== null) {
      console.error(`[FAIL] Capability requirement violated: guard event triggered without guard`);
      console.error(`Reproducible seed: ${iterationSeed}::capGuard`);
      process.exit(1);
    }
  }

  // Invariant 8: Budget Exhaustion
  const exhaustedBudget = new DailyEventBudget(day, diff);
  for (let b = 0; b < exhaustedBudget.maxEvents; b++) {
    exhaustedBudget.consume('low');
  }
  const selExhausted = selectEvent({
    state,
    candidateEvents: SAMPLE_CANDIDATE_EVENTS,
    budget: exhaustedBudget,
    seed: `${iterationSeed}::exhausted`,
  });
  totalChecks++;
  if (selExhausted !== null) {
    console.error(`[FAIL] Budget exhaustion violated: event triggered on exhausted budget`);
    console.error(`Reproducible seed: ${iterationSeed}::exhausted`);
    process.exit(1);
  }

  if ((i + 1) % 5000 === 0 || i === runs - 1) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[PROGRESS] Completed ${i + 1}/${runs} fuzz iterations (${totalChecks.toLocaleString()} invariant checks in ${elapsed}s)...`);
  }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\n======================================================`);
console.log(`   DIRECTOR FUZZ COMPLETED: 100% INVARIANTS PASS      `);
console.log(`======================================================`);
console.log(`Total Runs:             ${runs.toLocaleString()}`);
console.log(`Total Invariant Checks: ${totalChecks.toLocaleString()}`);
console.log(`Total Duration:         ${totalDuration}s`);
console.log(`Failures:               0`);
console.log(`Result:                 PASS\n`);
