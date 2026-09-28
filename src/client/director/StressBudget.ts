import type { GameState } from "../../shared/types/game-state";

export function calculateStress(state: GameState): number {
  let stress = 0;

  // Cash stress
  const cash = state.economy?.shopCash ?? 0;
  if (cash < 50_000) {
    stress += 30;
  } else if (cash < 100_000) {
    stress += 15;
  }

  // JD Stamina stress
  const stamina = state.jd?.stamina ?? 100;
  if (stamina < 20) {
    stress += 20;
  } else if (stamina < 40) {
    stress += 10;
  }

  // Debt & Husband pressure
  const missed = state.debt?.missedInstallments ?? 0;
  stress += missed * 25;
  const husbandConf = state.debt?.husbandConfidence ?? 50;
  if (husbandConf < 30) {
    stress += 15;
  }

  // Reputation pressure
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
