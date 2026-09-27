import type { BooksState } from "../../../shared/types/game-state";

export interface BookDiscrepancy {
  id: string;
  txId: string;
  recordedAmount: number;
  actualAmount: number;
  diff: number; // recordedAmount - actualAmount
  reason: "jd_typo" | "unrecorded_cash" | "lost_receipt" | "rounding_error";
  resolved: boolean;
  discoveredAt: number;
}

export function createBookDiscrepancy(
  txId: string,
  recordedAmount: number,
  actualAmount: number = 0,
  reason: BookDiscrepancy["reason"] = "jd_typo"
): BookDiscrepancy {
  return {
    id: `disc-${txId}`,
    txId,
    recordedAmount,
    actualAmount,
    diff: recordedAmount - actualAmount,
    reason,
    resolved: false,
    discoveredAt: Date.now(),
  };
}

export function calculateBookAccuracy(
  books: BooksState,
  discrepancies: BookDiscrepancy[] = []
): number {
  let score = 100;

  // Deduct for unrecorded transactions
  score -= books.unrecordedTransactions * 5;

  // Deduct for balance mismatch
  if (books.actualBalance > 0) {
    const diff = Math.abs(books.actualBalance - books.recordedBalance);
    const errorPct = (diff / books.actualBalance) * 100;
    score -= Math.min(30, Math.round(errorPct * 0.5));
  }

  // Deduct for unresolved discrepancies
  const unresolved = discrepancies.filter((d) => !d.resolved);
  score -= unresolved.length * 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}
