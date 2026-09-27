import { describe, it, expect } from "vitest";
import {
  transferToDebtReserve,
  withdrawDebtReserve,
  getDebtMilestone,
  settleDebtMilestone,
} from "../../src/client/systems/debt/debt";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Debt Reserve & Milestone Settlement", () => {
  it("provides exact debt milestones for Easy, Normal, and Hard", () => {
    expect(getDebtMilestone("easy", 10)).toBe(3_000_000);
    expect(getDebtMilestone("easy", 20)).toBe(4_500_000);
    expect(getDebtMilestone("easy", 30)).toBe(7_500_000);

    expect(getDebtMilestone("normal", 10)).toBe(6_000_000);
    expect(getDebtMilestone("normal", 20)).toBe(9_000_000);
    expect(getDebtMilestone("normal", 30)).toBe(15_000_000);

    expect(getDebtMilestone("hard", 10)).toBe(10_000_000);
    expect(getDebtMilestone("hard", 20)).toBe(15_000_000);
    expect(getDebtMilestone("hard", 30)).toBe(25_000_000);
  });

  it("transfers cash to debt reserve safely without overdrawing", () => {
    let state = createInitialState("normal", "debt-test");
    state.economy.shopCash = 1_000_000;

    state = transferToDebtReserve(state, 400_000);
    expect(state.economy.shopCash).toBe(600_000);
    expect(state.economy.debtReserve).toBe(400_000);

    // Cannot transfer more than available shop cash
    state = transferToDebtReserve(state, 1_000_000);
    expect(state.economy.shopCash).toBe(600_000);
    expect(state.economy.debtReserve).toBe(400_000);
  });

  it("withdraws from debt reserve without allowing negative reserve", () => {
    let state = createInitialState("normal", "debt-test");
    state.economy.debtReserve = 500_000;
    state.economy.shopCash = 200_000;

    state = withdrawDebtReserve(state, 300_000);
    expect(state.economy.debtReserve).toBe(200_000);
    expect(state.economy.shopCash).toBe(500_000);

    // Attempting to withdraw more than available reserve only withdraws up to available
    state = withdrawDebtReserve(state, 500_000);
    expect(state.economy.debtReserve).toBe(0);
    expect(state.economy.shopCash).toBe(700_000);
  });

  it("settles Day 10 milestone in full when reserve is sufficient", () => {
    const state = createInitialState("normal", "debt-settle");
    state.economy.debtReserve = 6_500_000;

    const { state: nextState, result } = settleDebtMilestone(state, 10);
    expect(result.isFullyPaid).toBe(true);
    expect(result.paidAmount).toBe(6_000_000);
    expect(result.shortfall).toBe(0);
    expect(nextState.economy.debtReserve).toBe(500_000);
    expect(nextState.debt.remainingDebt).toBe(24_000_000);
    expect(nextState.debt.husbandConfidence).toBeGreaterThan(state.debt.husbandConfidence);
  });

  it("handles partial settlement fail-forward without crashing or Game Over", () => {
    const state = createInitialState("normal", "debt-shortfall");
    state.economy.debtReserve = 4_000_000; // 2M shortfall

    const { state: nextState, result } = settleDebtMilestone(state, 10);
    expect(result.isFullyPaid).toBe(false);
    expect(result.paidAmount).toBe(4_000_000);
    expect(result.shortfall).toBe(2_000_000);
    expect(nextState.debt.missedInstallments).toBe(1);
    expect(nextState.debt.husbandConfidence).toBeLessThan(state.debt.husbandConfidence);
    // Game is still playable, debt remaining reduced by paid amount
    expect(nextState.debt.remainingDebt).toBe(26_000_000);
  });
});
