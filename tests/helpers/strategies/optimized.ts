import type { GameState } from '../../../src/shared/types/game-state';
import type { EventDefinition, EventChoice } from '../../../src/shared/types/events';

export const optimizedStrategy = {
  name: 'optimized',
  pickChoice(event: EventDefinition, _state: GameState): EventChoice {
    // Pick highest value / highest trust option
    return event.choices[0]!;
  },
  serveDay(_state: GameState, day: number, difficulty: string) {
    const diffMod = difficulty === 'easy' ? 1.25 : difficulty === 'hard' ? 0.95 : 1.0;
    const baseSales = 1_500_000 + (day * 40_000);
    const sales = Math.round(baseSales * 1.0 * diffMod);
    const expenses = 500_000 + (day * 12_000);
    return {
      sales,
      expenses,
      platesServed: 50 + Math.floor(day * 1.8),
      trustDelta: 2,
      reputationDelta: 0.04,
      neighborhoodDelta: 2,
      jdTrustDelta: 2,
      husbandConfidenceDelta: 2,
    };
  },
  decideDebtPayment(state: GameState): number {
    // Aggressively pays down all debt whenever possible
    if (state.debt.remainingDebt > 0 && state.economy.shopCash > 500_000) {
      return Math.min(state.debt.remainingDebt, state.economy.shopCash - 200_000);
    }
    return 0;
  },
};
