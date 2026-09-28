import type { GameState } from '../../../src/shared/types/game-state';
import type { EventDefinition, EventChoice } from '../../../src/shared/types/events';

export const averageStrategy = {
  name: 'average',
  pickChoice(event: EventDefinition, _state: GameState): EventChoice {
    // Pick first or middle reasonable option
    return event.choices[0]!;
  },
  serveDay(_state: GameState, day: number, difficulty: string) {
    const diffMod = difficulty === 'easy' ? 1.15 : difficulty === 'hard' ? 0.85 : 1.0;
    const baseSales = 700_000 + (day * 15_000);
    const sales = Math.round(baseSales * 0.85 * diffMod);
    const expenses = 300_000 + (day * 6_000);
    return {
      sales,
      expenses,
      platesServed: 22 + Math.floor(day * 0.8),
      trustDelta: 0,
    };
  },
  decideDebtPayment(state: GameState): number {
    // Pays regular installments
    if (state.debt.remainingDebt > 0 && state.economy.shopCash > 600_000) {
      return Math.min(state.debt.remainingDebt, 500_000);
    }
    return 0;
  },
};
