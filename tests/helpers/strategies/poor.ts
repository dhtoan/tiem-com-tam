import type { GameState } from '../../../src/shared/types/game-state';
import type { EventDefinition, EventChoice } from '../../../src/shared/types/events';

export const poorStrategy = {
  name: 'poor',
  pickChoice(event: EventDefinition, _state: GameState): EventChoice {
    // Pick cheapest or most reluctant choice (last option)
    return event.choices[event.choices.length - 1] ?? event.choices[0]!;
  },
  serveDay(_state: GameState, day: number, difficulty: string) {
    const diffMod = difficulty === 'easy' ? 1.1 : difficulty === 'hard' ? 0.8 : 1.0;
    // Lower accuracy, burnt chops, few customers
    const baseSales = 400_000 + (day * 8_000);
    const sales = Math.round(baseSales * 0.7 * diffMod);
    const expenses = 250_000 + (day * 4_000);
    return {
      sales,
      expenses,
      platesServed: 12 + Math.floor(day * 0.5),
      trustDelta: -1,
    };
  },
  decideDebtPayment(state: GameState): number {
    // Reluctant to pay debt, only pays minimal if cash allows
    if (state.debt.remainingDebt > 0 && state.economy.shopCash > 500_000) {
      return 200_000;
    }
    return 0;
  },
};
