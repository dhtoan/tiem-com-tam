import type { Difficulty } from "../../../shared/types/core";
import type { GameState } from "../../../shared/types/game-state";
import type { DebtSettlementResult } from "../../../shared/types/debt";
import { debtScheduleByDifficulty } from "../../data/difficultyBalance";

export function getDebtMilestone(difficulty: Difficulty, day: 10 | 20 | 30): number {
  return debtScheduleByDifficulty[difficulty].milestones[day];
}

export function transferToDebtReserve(state: GameState, amount: number): GameState {
  if (amount <= 0 || amount > state.economy.shopCash) {
    return state;
  }

  return {
    ...state,
    economy: {
      ...state.economy,
      shopCash: state.economy.shopCash - amount,
      debtReserve: state.economy.debtReserve + amount,
    },
  };
}

export function withdrawDebtReserve(state: GameState, amount: number): GameState {
  if (amount <= 0 || state.economy.debtReserve <= 0) {
    return state;
  }

  const actualAmount = Math.min(state.economy.debtReserve, amount);

  return {
    ...state,
    economy: {
      ...state.economy,
      debtReserve: state.economy.debtReserve - actualAmount,
      shopCash: state.economy.shopCash + actualAmount,
    },
  };
}

export function settleDebtMilestone(
  state: GameState,
  day: 10 | 20 | 30
): { state: GameState; result: DebtSettlementResult } {
  const targetAmount = getDebtMilestone(state.campaign.difficulty, day);
  const availableReserve = state.economy.debtReserve;

  const paidAmount = Math.min(availableReserve, targetAmount);
  const shortfall = Math.max(0, targetAmount - paidAmount);
  const isFullyPaid = shortfall === 0;

  const remainingReserve = availableReserve - paidAmount;
  const remainingDebt = Math.max(0, state.debt.remainingDebt - paidAmount);

  const confidenceDelta = isFullyPaid ? +15 : -20;
  const nextHusbandConfidence = Math.max(
    0,
    Math.min(100, state.debt.husbandConfidence + confidenceDelta)
  );

  const missedInstallments = isFullyPaid
    ? state.debt.missedInstallments
    : state.debt.missedInstallments + 1;

  const updatedMilestones = state.debt.milestones.map((m) => {
    if (m.day === day) {
      return {
        ...m,
        paidAmount,
        isPaid: isFullyPaid,
      };
    }
    return m;
  });

  const feedback = isFullyPaid
    ? `Thanh toán thành công mốc nợ Ngày ${day}: ${paidAmount.toLocaleString("vi-VN")}đ! Chồng rất phấn khởi và tin tưởng.`
    : `Thiếu ${shortfall.toLocaleString("vi-VN")}đ cho mốc nợ Ngày ${day}. Chồng lo lắng và yêu cầu quán siết chặt chi tiêu hơn!`;

  const nextState: GameState = {
    ...state,
    economy: {
      ...state.economy,
      debtReserve: remainingReserve,
    },
    debt: {
      ...state.debt,
      remainingDebt,
      milestones: updatedMilestones,
      husbandConfidence: nextHusbandConfidence,
      missedInstallments,
    },
    family: {
      ...state.family,
      husbandConfidence: nextHusbandConfidence,
    },
  };

  const result: DebtSettlementResult = {
    day,
    targetAmount,
    paidAmount,
    shortfall,
    isFullyPaid,
    husbandConfidenceChange: confidenceDelta,
    feedback,
  };

  return { state: nextState, result };
}
