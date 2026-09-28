import type { GameState } from "../../src/shared/types/game-state";
import type { EndingId } from "../../src/shared/types/endings";
import { getCampaignDay } from "../../src/client/data/campaignDays";
import { STORY_EVENTS_DAY_01_10 } from "../../src/client/data/story/day01-10";
import { STORY_EVENTS_DAY_11_20 } from "../../src/client/data/story/day11-20";
import { STORY_EVENTS_DAY_21_30 } from "../../src/client/data/story/day21-30";
import { applyConsequences } from "../../src/client/director/ConsequenceEngine";
import { resolveEnding } from "../../src/client/director/EndingResolver";
import { createDailyEventBudget } from "../../src/client/director/EventBudget";
import { selectEvent } from "../../src/client/director/EventSelector";
import type { EventDefinition } from "../../src/shared/types/events";

const ALL_STORY_EVENTS = [
  ...STORY_EVENTS_DAY_01_10,
  ...STORY_EVENTS_DAY_11_20,
  ...STORY_EVENTS_DAY_21_30,
];

export interface CampaignSimulationResult {
  finalState: GameState;
  ending: EndingId;
  totalRevenue: number;
  totalExpenses: number;
  daysCompleted: number;
}

export function simulateFullCampaign(
  initialState: GameState,
  strategy: "poor" | "average" | "good" | "optimized" = "good"
): CampaignSimulationResult {
  let state = { ...initialState };

  for (let day = 1; day <= 30; day++) {
    state.campaign.day = day;

    // 1. Resolve required story event
    const dayDef = getCampaignDay(day);
    const storyEvent = ALL_STORY_EVENTS.find(
      (e) => e.id === dayDef.requiredStoryEventId
    );

    if (storyEvent && storyEvent.choices.length > 0) {
      // Pick choice based on strategy
      const choiceIndex =
        strategy === "poor"
          ? storyEvent.choices.length - 1
          : 0;
      const choice = storyEvent.choices[choiceIndex] ?? storyEvent.choices[0]!;
      state = applyConsequences(state, choice.consequences);
    }

    // 2. Select dynamic event
    const budget = createDailyEventBudget(day, state.campaign.difficulty);
    const dynamicCandidate = selectEvent({
      state,
      candidateEvents: ALL_STORY_EVENTS.filter((e) => e.category !== "story"),
      budget,
      seed: `${state.meta.runSeed}::day-${day}`,
    });

    if (dynamicCandidate && dynamicCandidate.choices.length > 0) {
      const choice = dynamicCandidate.choices[0]!;
      state = applyConsequences(state, choice.consequences);
      budget.consume(dynamicCandidate.urgency);
    }

    // 3. Simulate day sales & operating costs
    let dailyNetSales = 150_000;
    switch (strategy) {
      case "poor":
        dailyNetSales = 80_000;
        break;
      case "average":
        dailyNetSales = 140_000;
        break;
      case "good":
        dailyNetSales = 220_000;
        break;
      case "optimized":
        dailyNetSales = 350_000;
        break;
    }

    state.economy.shopCash += dailyNetSales;
    state.economy.totalRevenue += dailyNetSales;
    state.campaign.completedDays.push(day);

  }

  const ending = resolveEnding(state);

  return {
    finalState: state,
    ending,
    totalRevenue: state.economy.totalRevenue,
    totalExpenses: state.economy.totalExpenses,
    daysCompleted: 30,
  };
}
