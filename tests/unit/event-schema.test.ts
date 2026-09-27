import { describe, it, expect } from "vitest";
import { evaluateCondition } from "../../src/client/director/conditions";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { StateCondition } from "../../src/shared/types/events";

describe("Event Condition Evaluation & Schema", () => {
  it("evaluates metric comparisons correctly", () => {
    const state = createInitialState("normal", "cond-seed");
    state.economy.shopCash = 250_000;
    state.neighborhood.neighborhoodTrust = 65;

    const cashGt: StateCondition = {
      type: "metric",
      path: "economy.shopCash",
      operator: "gt",
      value: 200_000,
    };
    expect(evaluateCondition(cashGt, state)).toBe(true);

    const cashLte: StateCondition = {
      type: "metric",
      path: "economy.shopCash",
      operator: "lte",
      value: 100_000,
    };
    expect(evaluateCondition(cashLte, state)).toBe(false);

    const trustGte: StateCondition = {
      type: "metric",
      path: "neighborhood.neighborhoodTrust",
      operator: "gte",
      value: 65,
    };
    expect(evaluateCondition(trustGte, state)).toBe(true);
  });

  it("evaluates flag conditions correctly", () => {
    const state = createInitialState("normal", "cond-seed");
    state.campaign.flags["met_bac_ba"] = true;
    state.campaign.flags["stolen_times"] = 2;

    const flagTrue: StateCondition = {
      type: "flag",
      key: "met_bac_ba",
      operator: "eq",
      value: true,
    };
    expect(evaluateCondition(flagTrue, state)).toBe(true);

    const flagNeq: StateCondition = {
      type: "flag",
      key: "met_bac_ba",
      operator: "neq",
      value: false,
    };
    expect(evaluateCondition(flagNeq, state)).toBe(true);

    const flagNumeric: StateCondition = {
      type: "flag",
      key: "stolen_times",
      operator: "gt",
      value: 1,
    };
    expect(evaluateCondition(flagNumeric, state)).toBe(true);

    const flagMissing: StateCondition = {
      type: "flag",
      key: "unknown_flag",
      operator: "eq",
      value: true,
    };
    expect(evaluateCondition(flagMissing, state)).toBe(false);
  });

  it("evaluates capability checks (guard, camera, JD role)", () => {
    const state = createInitialState("normal", "cond-seed");
    state.security.activeGuardId = "anh-hung";
    state.security.cameraLevel = 2;
    state.jd.assignedRole = "camera-awareness";

    const hasGuard: StateCondition = {
      type: "capability",
      capability: "hasActiveGuard",
    };
    expect(evaluateCondition(hasGuard, state)).toBe(true);

    const hasCamera2: StateCondition = {
      type: "capability",
      capability: "cameraLevelGte",
      value: 2,
    };
    expect(evaluateCondition(hasCamera2, state)).toBe(true);

    const hasCamera3: StateCondition = {
      type: "capability",
      capability: "cameraLevelGte",
      value: 3,
    };
    expect(evaluateCondition(hasCamera3, state)).toBe(false);

    const jdRoleCheck: StateCondition = {
      type: "capability",
      capability: "jdRoleEq",
      value: "camera-awareness",
    };
    expect(evaluateCondition(jdRoleCheck, state)).toBe(true);
  });

  it("evaluates day range and day phase conditions", () => {
    const state = createInitialState("normal", "cond-seed");
    state.campaign.day = 12;
    state.campaign.phase = "service";

    const dayRange: StateCondition = {
      type: "dayRange",
      minDay: 10,
      maxDay: 20,
    };
    expect(evaluateCondition(dayRange, state)).toBe(true);

    const dayRangeOut: StateCondition = {
      type: "dayRange",
      minDay: 1,
      maxDay: 10,
    };
    expect(evaluateCondition(dayRangeOut, state)).toBe(false);

    const phaseCheck: StateCondition = {
      type: "phase",
      phase: "service",
    };
    expect(evaluateCondition(phaseCheck, state)).toBe(true);

    const wrongPhase: StateCondition = {
      type: "phase",
      phase: "morning",
    };
    expect(evaluateCondition(wrongPhase, state)).toBe(false);
  });

  it("evaluates logical AND, OR, and NOT compound conditions", () => {
    const state = createInitialState("normal", "cond-seed");
    state.campaign.day = 5;
    state.economy.shopCash = 100_000;

    const compoundAnd: StateCondition = {
      type: "and",
      conditions: [
        { type: "dayRange", minDay: 1, maxDay: 10 },
        { type: "metric", path: "economy.shopCash", operator: "gte", value: 50_000 },
      ],
    };
    expect(evaluateCondition(compoundAnd, state)).toBe(true);

    const compoundOr: StateCondition = {
      type: "or",
      conditions: [
        { type: "dayRange", minDay: 20, maxDay: 30 },
        { type: "metric", path: "economy.shopCash", operator: "gt", value: 50_000 },
      ],
    };
    expect(evaluateCondition(compoundOr, state)).toBe(true);

    const compoundNot: StateCondition = {
      type: "not",
      conditions: [
        { type: "dayRange", minDay: 20, maxDay: 30 },
      ],
    };
    expect(evaluateCondition(compoundNot, state)).toBe(true);
  });
});
