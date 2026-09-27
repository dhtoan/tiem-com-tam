import { describe, it, expect } from "vitest";
import { validatePlate } from "../../src/client/game/systems/orders/plateValidator";
import type { OrderDefinition, PlateAssembly } from "../../src/shared/types/orders";

describe("Plate Assembly & Order Validation", () => {
  const comSuonOrder: OrderDefinition = {
    recipeId: "com-suon",
    name: "Cơm Sườn Nướng",
    basePrice: 35_000,
    requiredRice: true,
    requiredProteins: ["suon-heo"],
    requiredToppings: ["mo-hanh", "do-chua", "dua-leo"],
    requiredSides: ["nuoc-mam"],
  };

  it("scores 100% accuracy and accepts a perfectly assembled Cơm Sườn", () => {
    const perfectPlate: PlateAssembly = {
      rice: true,
      proteins: ["suon-heo"],
      proteinCookQualities: { "suon-heo": 100 },
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const score = validatePlate(comSuonOrder, perfectPlate);
    expect(score.accuracy).toBe(100);
    expect(score.cookQuality).toBe(100);
    expect(score.accepted).toBe(true);
  });

  it("penalizes and rejects if rice or required protein is missing", () => {
    const noRicePlate: PlateAssembly = {
      rice: false,
      proteins: ["suon-heo"],
      proteinCookQualities: { "suon-heo": 100 },
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const score = validatePlate(comSuonOrder, noRicePlate);
    expect(score.accuracy).toBeLessThan(70);
    expect(score.accepted).toBe(false);

    const noProteinPlate: PlateAssembly = {
      rice: true,
      proteins: [],
      proteinCookQualities: {},
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const score2 = validatePlate(comSuonOrder, noProteinPlate);
    expect(score2.accuracy).toBeLessThan(60);
    expect(score2.accepted).toBe(false);
  });

  it("rejects if protein is burnt (cookQuality is 0)", () => {
    const burntPlate: PlateAssembly = {
      rice: true,
      proteins: ["suon-heo"],
      proteinCookQualities: { "suon-heo": 0 },
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const score = validatePlate(comSuonOrder, burntPlate);
    expect(score.cookQuality).toBe(0);
    expect(score.accepted).toBe(false);
  });

  it("penalizes wrong protein", () => {
    const wrongProteinPlate: PlateAssembly = {
      rice: true,
      proteins: ["thit-heo"],
      proteinCookQualities: { "thit-heo": 100 },
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const score = validatePlate(comSuonOrder, wrongProteinPlate);
    expect(score.accuracy).toBeLessThan(60);
    expect(score.accepted).toBe(false);
  });

  it("penalizes extra unwanted components", () => {
    const extraPlate: PlateAssembly = {
      rice: true,
      proteins: ["suon-heo", "thit-heo"],
      proteinCookQualities: { "suon-heo": 100, "thit-heo": 100 },
      toppings: ["mo-hanh", "do-chua", "dua-leo", "cha-trung"],
      sides: ["nuoc-mam"],
    };

    const score = validatePlate(comSuonOrder, extraPlate);
    expect(score.accuracy).toBeLessThan(100);
  });
});
