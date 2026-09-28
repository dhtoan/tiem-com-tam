import type { Difficulty } from '../../../src/shared/types/core';
import type { GameState } from '../../../src/shared/types/game-state';
import type { EndingId } from '../../../src/shared/types/endings';
import { createInitialState } from '../../../src/client/state/createInitialState';
import { getCampaignDay } from '../../../src/client/data/campaignDays';
import { STORY_EVENTS_DAY_01_10 } from '../../../src/client/data/story/day01-10';
import { STORY_EVENTS_DAY_11_20 } from '../../../src/client/data/story/day11-20';
import { STORY_EVENTS_DAY_21_30 } from '../../../src/client/data/story/day21-30';
import { applyConsequences } from '../../../src/client/director/ConsequenceEngine';
import { resolveEnding } from '../../../src/client/director/EndingResolver';
import { createDailyEventBudget } from '../../../src/client/director/EventBudget';
import { selectEvent } from '../../../src/client/director/EventSelector';

import { poorStrategy } from './poor';
import { averageStrategy } from './average';
import { goodStrategy } from './good';
import { optimizedStrategy } from './optimized';

export type StrategyName = 'poor' | 'average' | 'good' | 'optimized';

const STRATEGIES = {
  poor: poorStrategy,
  average: averageStrategy,
  good: goodStrategy,
  optimized: optimizedStrategy,
};

const ALL_STORY_EVENTS = [
  ...STORY_EVENTS_DAY_01_10,
  ...STORY_EVENTS_DAY_11_20,
  ...STORY_EVENTS_DAY_21_30,
];

export interface SimulationOutput {
  daysCompleted: number;
  ending: EndingId;
  finalCash: number;
  finalDebt: number;
  totalDebtPaid: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  finalState: GameState;
}

export function runCampaignSimulation(
  difficulty: Difficulty,
  seed: string,
  strategyName: StrategyName
): SimulationOutput {
  const strategy = STRATEGIES[strategyName];
  const state: GameState = createInitialState(difficulty, seed);
  let totalDebtPaid = 0;

  for (let day = 1; day <= 30; day++) {
    state.campaign.day = day;

    // 1. Resolve required story event for day
    const dayDef = getCampaignDay(day);
    const storyEvent = ALL_STORY_EVENTS.find(
      (e) => e.id === dayDef.requiredStoryEventId
    );

    if (storyEvent && storyEvent.choices.length > 0) {
      let choice = strategy.pickChoice(storyEvent, state);
      if (storyEvent.id === 'story-day-30-finale') {
        if (state.debt.remainingDebt > state.economy.shopCash) {
          choice = storyEvent.choices[1] ?? storyEvent.choices[0]!;
        } else {
          state.economy.shopCash -= state.debt.remainingDebt;
          totalDebtPaid += state.debt.remainingDebt;
          state.debt.remainingDebt = 0;
          choice = storyEvent.choices[0]!;
        }
      }
      const resState = applyConsequences(state, choice.consequences);
      Object.assign(state, resState);
    }

    // 2. Select dynamic event
    const budget = createDailyEventBudget(day, difficulty);
    const dynamicCandidate = selectEvent({
      state,
      candidateEvents: ALL_STORY_EVENTS.filter((e) => e.category !== 'story'),
      budget,
      seed: `${seed}::day-${day}`,
    });

    if (dynamicCandidate && dynamicCandidate.choices.length > 0) {
      const choice = strategy.pickChoice(dynamicCandidate, state);
      const resState = applyConsequences(state, choice.consequences);
      Object.assign(state, resState);
      budget.consume(dynamicCandidate.urgency);
    }

    // 3. Service day execution
    const service = strategy.serveDay(state, day, difficulty);
    state.economy.shopCash += service.sales - service.expenses;
    state.economy.totalRevenue += service.sales;
    state.economy.totalExpenses += service.expenses;
    state.family.familyTrust = Math.max(0, Math.min(100, state.family.familyTrust + (service.trustDelta || 0)));
    const svc = service as {
      reputationDelta?: number;
      neighborhoodDelta?: number;
      jdTrustDelta?: number;
      husbandConfidenceDelta?: number;
    };
    if (svc.reputationDelta) {
      state.reputation.rating = Math.min(5.0, state.reputation.rating + svc.reputationDelta);
    }
    if (svc.neighborhoodDelta) {
      state.neighborhood.neighborhoodTrust = Math.min(100, state.neighborhood.neighborhoodTrust + svc.neighborhoodDelta);
    }
    if (svc.jdTrustDelta) {
      state.jd.trustWithJoy = Math.min(100, state.jd.trustWithJoy + svc.jdTrustDelta);
    }
    if (svc.husbandConfidenceDelta) {
      state.family.husbandConfidence = Math.min(100, state.family.husbandConfidence + svc.husbandConfidenceDelta);
    }

    // 4. Debt payment execution
    const payment = strategy.decideDebtPayment(state);
    if (payment > 0 && state.debt.remainingDebt > 0) {
      const actualPay = Math.min(payment, state.debt.remainingDebt, state.economy.shopCash);
      state.debt.remainingDebt -= actualPay;
      state.economy.shopCash -= actualPay;
      totalDebtPaid += actualPay;
    }

    state.campaign.completedDays.push(day);
  }

  const ending = resolveEnding(state);

  return {
    daysCompleted: 30,
    ending,
    finalCash: state.economy.shopCash,
    finalDebt: state.debt.remainingDebt,
    totalDebtPaid,
    totalRevenue: state.economy.totalRevenue,
    totalExpenses: state.economy.totalExpenses,
    netProfit: state.economy.totalRevenue - state.economy.totalExpenses,
    finalState: state,
  };
}

export { poorStrategy, averageStrategy, goodStrategy, optimizedStrategy };
