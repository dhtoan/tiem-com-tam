import type { GameState } from '../../../src/shared/types/game-state';
import type { EventDefinition, EventChoice } from '../../../src/shared/types/events';

export const goodStrategy = {
  name: 'good',
  pickChoice(event: EventDefinition, _state: GameState): EventChoice {
    // Pick cooperative community and family choice
    return event.choices[0]!;
  },
  serveDay(_state: GameState, day: number, difficulty: string) {
    const diffMod = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.9 : 1.0;
    const baseSales = 1_000_000 + (day * 25_000);
    const sales = Math.round(baseSales * 0.95 * diffMod);
    const expenses = 400_000 + (day * 8_000);
    return {
      sales,
      expenses,
      platesServed: 35 + Math.floor(day * 1.2),
      trustDelta: 1,
      reputationDelta: 0.02,
      neighborhoodDelta: 1,
      jdTrustDelta: 1,
      husbandConfidenceDelta: 1,
    };
  },
  decideDebtPayment(state: GameState): number {
    // Consistently clears debt installments
    if (state.debt.remainingDebt > 0 && state.economy.shopCash > 800_000) {
      return Math.min(state.debt.remainingDebt, 1_500_000);
    }
    return 0;
  },
};
