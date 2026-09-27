import type { Difficulty } from "../../../shared/types/core";
import type { MarketSnapshot, MarketItemQuote, SupplierQuote } from "../../../shared/types/market";
import { createSeededRandom } from "../../../shared/random/seededRandom";
import { ingredientsCatalog } from "../../data/ingredients";
import { suppliersCatalog } from "../../data/suppliers";
import { marketDifficultyVolatility, MARKET_PRICE_BOUNDS } from "../../data/marketBalance";

export interface GenerateMarketInput {
  day: number;
  difficulty: Difficulty;
  runSeed: string;
  previous?: MarketSnapshot;
}

export function generateMarket(input: GenerateMarketInput): MarketSnapshot {
  const rng = createSeededRandom(input.runSeed).fork(`market-day-${input.day}`);
  const volatility = marketDifficultyVolatility[input.difficulty];

  const items: Record<string, MarketItemQuote> = {};

  for (const [id, def] of Object.entries(ingredientsCatalog)) {
    // Delta between -0.25 and +0.25 scaled by difficulty volatility
    const rawDelta = (rng.next() * 2 - 1) * 0.25 * volatility;
    const clampedRatio = Math.max(
      MARKET_PRICE_BOUNDS.minRatio,
      Math.min(MARKET_PRICE_BOUNDS.maxRatio, 1.0 + rawDelta)
    );

    const currentPrice = Math.round((def.basePrice * clampedRatio) / 100) * 100;
    const trend = rawDelta > 0.03 ? "up" : rawDelta < -0.03 ? "down" : "stable";

    items[id] = {
      ingredientId: id,
      basePrice: def.basePrice,
      currentPrice,
      trend,
      priceRatio: clampedRatio,
    };
  }

  const dailyBriefSummary = `Giá chợ ngày ${input.day} nhìn chung ổn định, một số mặt hàng thịt và rau củ có biến động nhẹ.`;

  return {
    day: input.day,
    difficulty: input.difficulty,
    items,
    dailyBriefSummary,
  };
}

export function quoteSupplier(
  snapshot: MarketSnapshot,
  supplierId: string,
  ingredientId: string
): SupplierQuote {
  const supplier = suppliersCatalog[supplierId] ?? suppliersCatalog["regular-kimhang"]!;
  const marketItem = snapshot.items[ingredientId];
  const basePrice = marketItem?.currentPrice ?? 15_000;

  const unitPrice = Math.round((basePrice * supplier.costMultiplier) / 100) * 100;
  const qualityRating = 80 + supplier.qualityBonus;

  return {
    supplierId: supplier.id,
    ingredientId,
    unitPrice,
    qualityRating,
  };
}
