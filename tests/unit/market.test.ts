import { describe, it, expect } from "vitest";
import { generateMarket, quoteSupplier } from "../../src/client/systems/market/market";

describe("Deterministic Market & Suppliers", () => {
  it("generates deterministic market prices for identical seed and day", () => {
    const marketA = generateMarket({
      day: 3,
      difficulty: "normal",
      runSeed: "market-test-seed",
    });

    const marketB = generateMarket({
      day: 3,
      difficulty: "normal",
      runSeed: "market-test-seed",
    });

    expect(marketA.items["suon-heo"]?.currentPrice).toBe(
      marketB.items["suon-heo"]?.currentPrice
    );
    expect(marketA.items["com-tam"]?.currentPrice).toBe(
      marketB.items["com-tam"]?.currentPrice
    );
  });

  it("respects market price bounds between minRatio and maxRatio", () => {
    for (let day = 1; day <= 10; day++) {
      const market = generateMarket({
        day,
        difficulty: "hard", // higher volatility
        runSeed: `bound-check-day-${day}`,
      });

      for (const item of Object.values(market.items)) {
        expect(item.currentPrice).toBeGreaterThanOrEqual(item.basePrice * 0.7);
        expect(item.currentPrice).toBeLessThanOrEqual(item.basePrice * 1.5);
      }
    }
  });

  it("quotes suppliers accurately according to their archetype multipliers", () => {
    const market = generateMarket({
      day: 1,
      difficulty: "normal",
      runSeed: "quote-test",
    });

    const wholesaleQuote = quoteSupplier(market, "wholesale-chobenthanh", "suon-heo");
    const regularQuote = quoteSupplier(market, "regular-kimhang", "suon-heo");
    const premiumQuote = quoteSupplier(market, "premium-organic", "suon-heo");

    expect(wholesaleQuote.unitPrice).toBeLessThan(regularQuote.unitPrice);
    expect(premiumQuote.unitPrice).toBeGreaterThan(regularQuote.unitPrice);
    expect(premiumQuote.qualityRating).toBeGreaterThan(wholesaleQuote.qualityRating);
  });
});
