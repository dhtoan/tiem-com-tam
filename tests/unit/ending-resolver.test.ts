import { describe, it, expect } from "vitest";
import { resolveEnding } from "../../src/client/director/EndingResolver";
import { ENDING_DEFINITIONS } from "../../src/client/data/endings";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { GameState } from "../../src/shared/types/game-state";

describe("Six-Ending Deterministic Campaign Resolver", () => {
  it("defines all six ending metadata entries", () => {
    const keys = Object.keys(ENDING_DEFINITIONS);
    expect(keys).toContain("perfect");
    expect(keys).toContain("family");
    expect(keys).toContain("jd");
    expect(keys).toContain("neighborhood");
    expect(keys).toContain("husband-finance");
    expect(keys).toContain("comeback");
  });

  it("resolves to Perfect ending when all high-standard conditions are met", () => {
    const state = createInitialState("normal", "seed-perfect");
    state.debt.remainingDebt = 0;
    state.reputation.rating = 4.8;
    state.neighborhood.neighborhoodTrust = 85;
    state.books.bookAccuracy = 95;
    state.family.familyTrust = 80;
    state.family.husbandConfidence = 80;
    state.jd.trustWithJoy = 85;
    state.security.securityScore = 80;

    expect(resolveEnding(state)).toBe("perfect");
  });

  it("resolves to Family ending when family is exceptional even if shop metrics are modest", () => {
    const state = createInitialState("normal", "seed-family");
    state.debt.remainingDebt = 0;
    state.reputation.rating = 4.0; // modest, below perfect 4.5
    state.neighborhood.neighborhoodTrust = 60; // below perfect 75
    state.family.familyTrust = 90;
    state.family.husbandConfidence = 90;
    state.family.husbandHelpsInStall = true;
    state.jd.trustWithJoy = 80;

    expect(resolveEnding(state)).toBe("family");
  });

  it("resolves to JD ending when JD specialization and bond are supreme", () => {
    const state = createInitialState("normal", "seed-jd");
    state.debt.remainingDebt = 0;
    state.reputation.rating = 4.0;
    state.neighborhood.neighborhoodTrust = 65;
    state.family.familyTrust = 70; // below family 85
    state.jd.level = 3;
    state.jd.trustWithJoy = 92;
    state.jd.stamina = 80;
    state.jd.mood = 85;
    state.campaign.flags["story_day22_jd_mastered"] = true;

    expect(resolveEnding(state)).toBe("jd");
  });

  it("resolves to Neighborhood ending when community trust is outstanding with slight debt remaining", () => {
    const state = createInitialState("normal", "seed-neighborhood");
    state.debt.originalDebt = 5_000_000;
    state.debt.remainingDebt = 200_000; // 4% remaining (<10%)
    state.neighborhood.neighborhoodTrust = 92;
    state.reputation.rating = 4.7;

    expect(resolveEnding(state)).toBe("neighborhood");
  });

  it("resolves to Husband-Finance ending when viable but debt remains incomplete", () => {
    const state = createInitialState("normal", "seed-husband-finance");
    state.debt.remainingDebt = 1_500_000;
    state.economy.shopCash = 400_000;
    state.reputation.rating = 3.8;
    state.neighborhood.neighborhoodTrust = 50;

    expect(resolveEnding(state)).toBe("husband-finance");
  });

  it("resolves to Comeback ending when metrics are distressed", () => {
    const state = createInitialState("normal", "seed-comeback");
    state.debt.remainingDebt = 3_500_000;
    state.economy.shopCash = 20_000;
    state.reputation.rating = 2.1;
    state.debt.missedInstallments = 2;

    expect(resolveEnding(state)).toBe("comeback");
  });

  it("prioritizes Perfect over Family when both conditions overlap", () => {
    const state = createInitialState("normal", "seed-overlap");
    // Satisfies perfect
    state.debt.remainingDebt = 0;
    state.reputation.rating = 4.8;
    state.neighborhood.neighborhoodTrust = 85;
    state.books.bookAccuracy = 95;
    state.jd.trustWithJoy = 90;
    state.security.securityScore = 80;

    // Also satisfies family
    state.family.familyTrust = 95;
    state.family.husbandConfidence = 95;
    state.family.husbandHelpsInStall = true;

    // Strict priority: perfect beats family
    expect(resolveEnding(state)).toBe("perfect");
  });

  it("loads and accurately resolves all six JSON fixture files", async () => {
    const fixtureNames = [
      "perfect",
      "family",
      "jd",
      "neighborhood",
      "husband-finance",
      "comeback",
    ];

    for (const name of fixtureNames) {
      const fixtureData = await import(`../fixtures/endings/${name}.json`);
      const state = createInitialState("normal", `fixture-${name}`);
      // Merge fixture data onto base state
      const mergedState: GameState = {
        ...state,
        ...fixtureData.default,
        debt: { ...state.debt, ...fixtureData.default.debt },
        economy: { ...state.economy, ...fixtureData.default.economy },
        reputation: { ...state.reputation, ...fixtureData.default.reputation },
        neighborhood: { ...state.neighborhood, ...fixtureData.default.neighborhood },
        books: { ...state.books, ...fixtureData.default.books },
        family: { ...state.family, ...fixtureData.default.family },
        jd: { ...state.jd, ...fixtureData.default.jd },
        campaign: {
          ...state.campaign,
          flags: {
            ...state.campaign.flags,
            ...(fixtureData.default.campaign?.flags ?? {}),
          },
        },
      };

      const result = resolveEnding(mergedState);
      expect(result).toBe(name);
    }
  });
});
