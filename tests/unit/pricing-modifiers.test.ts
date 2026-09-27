import { describe, it, expect } from "vitest";
import { quoteDishPrice, calculateTip } from "../../src/client/systems/economy/pricing";
import { calculateDailyOperatingCost } from "../../src/client/systems/economy/dailyCosts";
import { collectModifiers } from "../../src/client/systems/progression/modifiers";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Pricing, Tips, Operating Costs and Upgrades Modifiers", () => {
  it("quotes dish prices with percentage adjustments rounded to 1,000d", () => {
    // Base com-suon is 35,000đ
    expect(quoteDishPrice("com-suon", 0)).toBe(35_000);
    // +10% = 38,500 -> rounded to 39,000đ
    expect(quoteDishPrice("com-suon", 0.1)).toBe(39_000);
    // -10% = 31,500 -> rounded to 32,000đ
    expect(quoteDishPrice("com-suon", -0.1)).toBe(32_000);
  });

  it("calculates tips adjusted by difficulty and cook quality", () => {
    // Quality < 85 -> 0 tip
    expect(
      calculateTip({ dishPrice: 35_000, cookQuality: 80, difficulty: "normal" })
    ).toBe(0);

    // Perfect quality >= 95 on Easy (115% tip rate)
    const easyTip = calculateTip({
      dishPrice: 40_000,
      cookQuality: 98,
      difficulty: "easy",
    });
    // Perfect quality on Hard (95% tip rate)
    const hardTip = calculateTip({
      dishPrice: 40_000,
      cookQuality: 98,
      difficulty: "hard",
    });

    expect(easyTip).toBeGreaterThan(hardTip);
  });

  it("calculates daily operating cost in expected range", () => {
    const costDay1 = calculateDailyOperatingCost({ day: 1 });
    expect(costDay1).toBeGreaterThanOrEqual(120_000);

    const costWithGuard = calculateDailyOperatingCost({ day: 5, guardWage: 160_000 });
    expect(costWithGuard).toBeGreaterThanOrEqual(280_000);
  });

  it("collects modifiers correctly from installed upgrades", () => {
    const state = createInitialState("normal", "mod-test");
    state.economy.upgrades = ["grill-lv2", "safe-lock"];

    const grillCap = collectModifiers(state, "grillCapacity");
    expect(grillCap).toBe(2);

    const secScore = collectModifiers(state, "securityScore");
    expect(secScore).toBe(15);
  });
});
