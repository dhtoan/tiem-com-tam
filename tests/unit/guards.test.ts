import { describe, it, expect } from "vitest";
import {
  getGuardById,
} from "../../src/client/data/guards";
import {
  hireGuardForShift,
  resolveGuardAttendance,
} from "../../src/client/systems/security/guards";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Guard Roster, Hiring and Shift Behavior", () => {
  it("defines stable roster with 160K, 280K, and 380K costs", () => {
    const chuTam = getGuardById("chu-tam");
    const anhHung = getGuardById("anh-hung");
    const coLan = getGuardById("co-lan");

    expect(chuTam).toBeDefined();
    expect(chuTam?.shiftCost).toBe(160_000);
    expect(chuTam?.comfortModifier).toBeGreaterThanOrEqual(0); // friendly, doesn't scare customers

    expect(anhHung).toBeDefined();
    expect(anhHung?.shiftCost).toBe(280_000);
    expect(anhHung?.intimidation).toBeGreaterThan(70);
    expect(anhHung?.comfortModifier).toBeLessThan(0); // intimidation trades comfort

    expect(coLan).toBeDefined();
    expect(coLan?.shiftCost).toBe(380_000);
    expect(coLan?.reliability).toBeGreaterThanOrEqual(95);
    expect(coLan?.detection).toBeGreaterThanOrEqual(90);
  });

  it("successfully hires a guard when funds are sufficient", () => {
    const initialState = createInitialState("normal", "test-guards");
    initialState.economy.shopCash = 500_000;

    const nextState = hireGuardForShift(initialState, "chu-tam", "morning");

    expect(nextState.economy.shopCash).toBe(500_000 - 160_000);
    expect(nextState.security.activeGuardId).toBe("chu-tam");
    expect(nextState.economy.totalExpenses).toBe(160_000);
  });

  it("throws error and rejects hiring when cash is insufficient", () => {
    const initialState = createInitialState("normal", "test-guards-broke");
    initialState.economy.shopCash = 50_000;

    expect(() => {
      hireGuardForShift(initialState, "anh-hung", "lunch");
    }).toThrow(/insufficient/i);

    expect(initialState.security.activeGuardId).toBeUndefined();
  });

  it("resolves guard attendance and quirks deterministically with seed", () => {
    const attendance1 = resolveGuardAttendance({
      guardId: "chu-tam",
      day: 5,
      shift: "morning",
      seed: 42,
    });

    const attendance2 = resolveGuardAttendance({
      guardId: "chu-tam",
      day: 5,
      shift: "morning",
      seed: 42,
    });

    expect(attendance1).toEqual(attendance2);
    expect(attendance1.attended).toBe(true);
    expect(attendance1.effectiveDetection).toBeGreaterThan(0);
  });

  it("reflects intimidation comfort trade-off in attendance result", () => {
    const chuTamResult = resolveGuardAttendance({
      guardId: "chu-tam",
      day: 1,
      shift: "evening",
      seed: 12345,
    });
    const anhHungResult = resolveGuardAttendance({
      guardId: "anh-hung",
      day: 1,
      shift: "evening",
      seed: 12345,
    });

    // Anh Hùng has negative comfort modifier due to high intimidation
    expect(anhHungResult.comfortModifier).toBeLessThan(0);
    // Chú Tám has non-negative comfort modifier
    expect(chuTamResult.comfortModifier).toBeGreaterThanOrEqual(0);
  });
});
