import type { GameState } from "../../../shared/types/game-state";
import { upgradesCatalog } from "../../data/upgrades";

export function collectModifiers(state: GameState, key: string): number {
  let total = 0;

  // 1. Upgrades modifiers
  for (const upgradeId of state.economy.upgrades) {
    const upgrade = upgradesCatalog[upgradeId];
    if (upgrade?.modifiers[key] !== undefined) {
      total += upgrade.modifiers[key]!;
    }
  }

  // 2. JD specialization bonuses
  if (key === "customerThroughput" && state.jd.assignedRole === "cashier") {
    total += 0.15; // 15% speed bonus when JD is cashier
  }
  if (key === "detectionBonus" && state.jd.assignedRole === "camera-awareness") {
    total += 25; // +25 detection when JD monitors camera
  }
  if (key === "prepSpeed" && state.jd.assignedRole === "service-runner") {
    total += 0.15;
  }

  return total;
}
