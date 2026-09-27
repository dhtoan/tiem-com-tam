import type { Difficulty } from "../../../shared/types/core";
import { day1Recipes } from "../../data/day1Recipes";

export function quoteDishPrice(recipeId: string, adjustmentRatio: number = 0): number {
  const recipe = day1Recipes[recipeId];
  if (!recipe) return 35_000;

  // Clamp adjustment between -15% and +15%
  const clampedAdjustment = Math.max(-0.15, Math.min(0.15, adjustmentRatio));
  const rawPrice = recipe.basePrice * (1 + clampedAdjustment);
  // Round to nearest 1,000 dong
  return Math.round(rawPrice / 1000) * 1000;
}

export interface TipInput {
  dishPrice: number;
  cookQuality: number;
  difficulty: Difficulty;
  customerTipMultiplier?: number;
}

const difficultyTipMultiplier: Record<Difficulty, number> = {
  easy: 1.15,
  normal: 1.0,
  hard: 0.95,
};

export function calculateTip(input: TipInput): number {
  if (input.cookQuality < 85) {
    return 0;
  }

  let baseTipRate = 0.08;
  if (input.cookQuality >= 95) {
    baseTipRate = 0.15;
  } else if (input.cookQuality >= 90) {
    baseTipRate = 0.1;
  }

  const diffMultiplier = difficultyTipMultiplier[input.difficulty];
  const custMultiplier = input.customerTipMultiplier ?? 1.0;

  const rawTip = input.dishPrice * baseTipRate * diffMultiplier * custMultiplier;
  return Math.round(rawTip / 500) * 500;
}
