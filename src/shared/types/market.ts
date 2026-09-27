import type { Difficulty } from "./core";

export interface MarketItemQuote {
  ingredientId: string;
  basePrice: number;
  currentPrice: number;
  trend: "up" | "down" | "stable";
  priceRatio: number; // e.g. 1.05 = +5%
}

export interface MarketSnapshot {
  day: number;
  difficulty: Difficulty;
  items: Record<string, MarketItemQuote>;
  dailyBriefSummary: string;
}

export interface SupplierDefinition {
  id: string;
  name: string;
  archetype: "wholesale" | "regular" | "premium";
  costMultiplier: number;
  qualityBonus: number;
  description: string;
}

export interface SupplierQuote {
  supplierId: string;
  ingredientId: string;
  unitPrice: number;
  qualityRating: number;
}
