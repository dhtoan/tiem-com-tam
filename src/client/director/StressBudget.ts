import type { GameState } from "../../shared/types/game-state";

export function calculateStress(state: GameState): number {
  let stress = 0;

  // Cash stress
  if (state.economy.shopCash < 50_000) {
    stress += 30;
  } else if (state.economy.shopCash < 100_000) {
    stress += 15;
  }

  // JD Stamina stress
  if (state.jd.stamina < 20) {
    stress += 20;
  } else if (state.jd.stamina < 40) {
    stress += 10;
  }

  // Debt & Husband pressure
  stress += state.debt.missedInstallments * 25;
  if (state.debt.husbandConfidence < 30) {
    stress += 15;
  }

  // Reputation pressure
  if (state.reputation.rating < 2.5) {
    stress += 20;
  } else if (state.reputation.rating < 3.5) {
    stress += 10;
  }

  return Math.max(0, Math.min(100, Math.round(stress)));
}
