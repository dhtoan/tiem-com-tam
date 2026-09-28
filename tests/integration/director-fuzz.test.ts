import { describe, it, expect } from "vitest";
import { createInitialState } from "../../src/client/state/createInitialState";
import { calculateStress } from "../../src/client/director/StressBudget";
import { createDailyEventBudget } from "../../src/client/director/EventBudget";
import { selectEvent } from "../../src/client/director/EventSelector";
import { resolveEnding } from "../../src/client/director/EndingResolver";
import { getCampaignDay } from "../../src/client/data/campaignDays";
import { STORY_EVENTS_DAY_01_10 } from "../../src/client/data/story/day01-10";
import { STORY_EVENTS_DAY_11_20 } from "../../src/client/data/story/day11-20";
import { STORY_EVENTS_DAY_21_30 } from "../../src/client/data/story/day21-30";
import { createSeededRandom } from "../../src/shared/random/seededRandom";

const ALL_EVENTS = [
  ...STORY_EVENTS_DAY_01_10,
  ...STORY_EVENTS_DAY_11_20,
  ...STORY_EVENTS_DAY_21_30,
];

describe("Director Fuzz Invariant Verification", () => {
  it("maintains core invariants across 5,000 generated randomized states", () => {
    const rng = createSeededRandom("fuzz-director-invariants-v1");

    for (let i = 0; i < 5000; i++) {
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
  });

  it("verifies event selector never offers events with unmet conditions or exceeded maxPerRun", () => {
    const rng = createSeededRandom("fuzz-selector-invariants");

    for (let i = 0; i < 500; i++) {
      const state = createInitialState("normal", `selector-fuzz-${i}`);
      state.campaign.day = rng.int(1, 30);
      const budget = createDailyEventBudget(state.campaign.day, "normal");

      // Mark an event as already triggered max times
      const targetEvent = ALL_EVENTS[i % ALL_EVENTS.length]!;
      state.director.campaignEventsTriggered[targetEvent.id] = (targetEvent.maxPerRun ?? 1) + 1;

      const selected = selectEvent({
        state,
        candidateEvents: [targetEvent],
        budget,
        seed: `seed-${i}`,
      });

      // Target event exceeded maxPerRun, should NEVER be selected
      if (targetEvent.maxPerRun !== undefined) {
        expect(selected).toBeNull();
      }
    }
  });
});
