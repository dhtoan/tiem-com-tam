import { describe, it, expect } from "vitest";
import { simulateFullCampaign } from "../helpers/campaignBot";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("30-Day Campaign Fast-Forward Integration", () => {
  it("traverses all 30 days and always reaches a valid ending across various playstyles", () => {
    const strategies = ["poor", "average", "good", "optimized"] as const;

    for (const strategy of strategies) {
      const initial = createInitialState("normal", `fast-forward-${strategy}`);
      const result = simulateFullCampaign(initial, strategy);

      expect(result.daysCompleted).toBe(30);
      expect(result.finalState.campaign.day).toBe(30);
      expect([
        "perfect",
        "family",
        "jd",
        "neighborhood",
        "husband-finance",
        "comeback",
      ]).toContain(result.ending);
    }
  });

  it("yields high-tier ending for optimized strategy and fail-forward ending for poor strategy", () => {
    const optimizedInitial = createInitialState("normal", "seed-opt");
    optimizedInitial.reputation.rating = 4.8;
    optimizedInitial.neighborhood.neighborhoodTrust = 85;
    optimizedInitial.books.bookAccuracy = 95;

    const optResult = simulateFullCampaign(optimizedInitial, "optimized");
    expect(["perfect", "family", "jd", "neighborhood"]).toContain(optResult.ending);

    const poorInitial = createInitialState("normal", "seed-poor");
    poorInitial.reputation.rating = 2.0;
    poorInitial.neighborhood.neighborhoodTrust = 25;

    const poorResult = simulateFullCampaign(poorInitial, "poor");
    expect(["husband-finance", "comeback"]).toContain(poorResult.ending);
  });
});
