import type { Difficulty } from "../../shared/types/core";

export const marketDifficultyVolatility: Record<Difficulty, number> = {
  easy: 0.65,
  normal: 1.0,
  hard: 1.35,
};

export const MARKET_PRICE_BOUNDS = {
  minRatio: 0.75,
  maxRatio: 1.45,
};
