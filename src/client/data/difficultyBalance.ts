import type { Difficulty } from "../../shared/types/core";

export interface DebtSchedule {
  startingDebt: number;
  workingCash: number;
  milestones: Record<10 | 20 | 30, number>;
}

export const debtScheduleByDifficulty: Record<Difficulty, DebtSchedule> = {
  easy: {
    startingDebt: 15_000_000,
    workingCash: 1_500_000,
    milestones: {
      10: 3_000_000,
      20: 4_500_000,
      30: 7_500_000,
    },
  },
  normal: {
    startingDebt: 30_000_000,
    workingCash: 1_200_000,
    milestones: {
      10: 6_000_000,
      20: 9_000_000,
      30: 15_000_000,
    },
  },
  hard: {
    startingDebt: 50_000_000,
    workingCash: 1_000_000,
    milestones: {
      10: 10_000_000,
      20: 15_000_000,
      30: 25_000_000,
    },
  },
};
