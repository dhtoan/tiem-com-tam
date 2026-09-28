import { describe, it, expect } from "vitest";
import { createInitialState } from "../../src/client/state/createInitialState";
import { calculateStress } from "../../src/client/director/StressBudget";
import { createDailyEventBudget } from "../../src/client/director/EventBudget";
import { selectEvent } from "../../src/client/director/EventSelector";
import { evaluateCondition } from "../../src/client/director/conditions";
import { resolveEnding } from "../../src/client/director/EndingResolver";
import { getCampaignDay } from "../../src/client/data/campaignDays";
import { STORY_EVENTS_DAY_01_10 } from "../../src/client/data/story/day01-10";
import { STORY_EVENTS_DAY_11_20 } from "../../src/client/data/story/day11-20";
import { STORY_EVENTS_DAY_21_30 } from "../../src/client/data/story/day21-30";
import { createSeededRandom } from "../../src/shared/random/seededRandom";
import type { EventDefinition, StateCondition } from "../../src/shared/types/events";
import type { JDRole } from "../../src/shared/types/game-state";

const ALL_EVENTS: EventDefinition[] = [
  ...STORY_EVENTS_DAY_01_10,
  ...STORY_EVENTS_DAY_11_20,
  ...STORY_EVENTS_DAY_21_30,
];

describe("Director Fuzz Invariant Verification", () => {
  it("maintains core invariants across 3,000 generated randomized states", () => {
    const rng = createSeededRandom("fuzz-director-invariants-v1");

    for (let i = 0; i < 3000; i++) {
      const state = createInitialState("normal", `fuzz-run-${i}`);
      const randomDay = rng.int(1, 30);
      state.campaign.day = randomDay;

      // Randomize state metrics
      state.economy.shopCash = rng.int(-100_000, 5_000_000);
      state.debt.remainingDebt = rng.int(0, 5_000_000);
      state.debt.missedInstallments = rng.int(0, 3);
      state.reputation.rating = rng.next() * 5.0;
      state.neighborhood.neighborhoodTrust = rng.int(0, 100);
      state.jd.stamina = rng.int(0, 100);
      state.jd.mood = rng.int(0, 100);
      state.jd.level = rng.int(1, 3);
      state.family.familyTrust = rng.int(0, 100);
      state.family.husbandConfidence = rng.int(0, 100);

      // Invariant 1: Stress score is always clamped [0, 100]
      const stress = calculateStress(state);
      expect(stress).toBeGreaterThanOrEqual(0);
      expect(stress).toBeLessThanOrEqual(100);

      // Invariant 2: Daily event budget never allows dual major events
      const budget = createDailyEventBudget(randomDay, "normal");
      budget.consume("critical"); // first major event
      expect(budget.canTrigger("high", stress)).toBe(false);
      expect(budget.canTrigger("critical", stress)).toBe(false);

      // Invariant 3: Future-day story event never matches current day if day < target
      const dayDef = getCampaignDay(randomDay);
      for (let futureDay = randomDay + 1; futureDay <= 30; futureDay++) {
        const futureDef = getCampaignDay(futureDay);
        expect(dayDef.requiredStoryEventId).not.toBe(futureDef.requiredStoryEventId);
      }

      // Invariant 4: On day 30, resolveEnding ALWAYS returns a valid EndingId
      if (randomDay === 30) {
        const ending = resolveEnding(state);
        expect([
          "perfect",
          "family",
          "jd",
          "neighborhood",
          "husband-finance",
          "comeback",
        ]).toContain(ending);
      }
    }
  }, 30000);

  it("verifies event selector invariants: mutex groups, cooldowns, capabilities, and day ranges", () => {
    const rng = createSeededRandom("fuzz-selector-invariants-deep");

    for (let i = 0; i < 2000; i++) {
      const state = createInitialState("normal", `deep-fuzz-${i}`);
      const day = rng.int(1, 30);
      state.campaign.day = day;

      // Randomize capabilities
      state.security.activeGuardId = rng.next() > 0.5 ? "anh-tuan" : undefined;
      state.security.hasLighting = rng.next() > 0.5;
      state.security.hasLock = rng.next() > 0.5;
      state.security.cameraLevel = rng.int(0, 3);
      const jdRoles: JDRole[] = ["shop-helper", "service-runner", "cashier", "camera-awareness", "family-support"];
      state.jd.assignedRole = jdRoles[rng.int(0, jdRoles.length - 1)]!;
      state.jd.stamina = rng.int(0, 100);
      state.jd.mood = rng.int(0, 100);

      const budget = createDailyEventBudget(day, "normal");

      // 1. Mutex Groups Invariant
      const mutexEvent = ALL_EVENTS.find((e) => e.mutexGroup !== undefined);
      if (mutexEvent && mutexEvent.mutexGroup) {
        const selected = selectEvent({
          state,
          candidateEvents: [mutexEvent],
          budget,
          activeMutexGroupsToday: [mutexEvent.mutexGroup],
          seed: `mutex-test-${i}`,
        });
        expect(selected, `Event with active mutex group must not trigger (seed: mutex-test-${i})`).toBeNull();
      }

      // 2. Cooldown Invariant
      const cooldownEvent = ALL_EVENTS.find((e) => e.cooldownDays && e.cooldownDays > 1);
      if (cooldownEvent && cooldownEvent.cooldownDays) {
        state.director.lastEventDay[cooldownEvent.id] = day - 1; // Triggered yesterday, cooldown > 1
        const selected = selectEvent({
          state,
          candidateEvents: [cooldownEvent],
          budget,
          seed: `cooldown-test-${i}`,
        });
        expect(selected, `Event on cooldown must not trigger (seed: cooldown-test-${i})`).toBeNull();
      }

      // 3. Day Range Invariant
      const eventWithMinDay = ALL_EVENTS.find(
        (e) => e.conditions?.some((c: StateCondition) => c.type === "dayRange" && c.minDay !== undefined && c.minDay > 15)
      );
      if (eventWithMinDay) {
        state.campaign.day = 5; // Before minDay
        const selected = selectEvent({
          state,
          candidateEvents: [eventWithMinDay],
          budget,
          seed: `day-range-test-${i}`,
        });
        expect(selected, `Event with minDay > 15 must not trigger on Day 5 (seed: day-range-test-${i})`).toBeNull();
      }

      // 4. Max Per Run / Completed Chain Invariant
      const eventWithMaxPerRun = ALL_EVENTS.find((e) => e.maxPerRun !== undefined);
      if (eventWithMaxPerRun && eventWithMaxPerRun.maxPerRun !== undefined) {
        state.director.campaignEventsTriggered[eventWithMaxPerRun.id] = eventWithMaxPerRun.maxPerRun;
        const selected = selectEvent({
          state,
          candidateEvents: [eventWithMaxPerRun],
          budget,
          seed: `max-run-test-${i}`,
        });
        expect(selected, `Event exceeding maxPerRun must not trigger (seed: max-run-test-${i})`).toBeNull();
      }

      // 5. Budget Exhaustion Invariant
      const budgetExhausted = createDailyEventBudget(day, "normal");
      budgetExhausted.consume("low");
      budgetExhausted.consume("medium"); // normal difficulty maxEvents is 2
      const anyEvent = ALL_EVENTS[i % ALL_EVENTS.length]!;
      const selectedWhenFull = selectEvent({
        state,
        candidateEvents: [anyEvent],
        budget: budgetExhausted,
        seed: `budget-full-test-${i}`,
      });
      expect(selectedWhenFull, `No event must trigger when daily budget is exhausted (seed: budget-full-test-${i})`).toBeNull();

      // 6. Capability Invariant
      state.security.activeGuardId = undefined;
      const guardCondition = { type: "capability" as const, capability: "hasActiveGuard" as const };
      expect(evaluateCondition(guardCondition, state)).toBe(false);

      state.security.hasLock = false;
      const lockCondition = { type: "capability" as const, capability: "hasLock" as const };
      expect(evaluateCondition(lockCondition, state)).toBe(false);

      state.security.cameraLevel = 1;
      const cameraCondition = { type: "capability" as const, capability: "cameraLevelGte" as const, value: 2 };
      expect(evaluateCondition(cameraCondition, state)).toBe(false);
    }
  });

  it("verifies determinism: identical state and seed yield identical selections", () => {
    const stateA = createInitialState("normal", "seed-determinism-check");
    const stateB = createInitialState("normal", "seed-determinism-check");
    stateA.campaign.day = 12;
    stateB.campaign.day = 12;

    const budgetA = createDailyEventBudget(12, "normal");
    const budgetB = createDailyEventBudget(12, "normal");

    const selA = selectEvent({
      state: stateA,
      candidateEvents: ALL_EVENTS,
      budget: budgetA,
      seed: "deterministic-run",
    });

    const selB = selectEvent({
      state: stateB,
      candidateEvents: ALL_EVENTS,
      budget: budgetB,
      seed: "deterministic-run",
    });

    expect(selA?.id).toBe(selB?.id);
  });
});
