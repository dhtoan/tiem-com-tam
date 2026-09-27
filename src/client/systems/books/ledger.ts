import type { BooksState } from "../../../shared/types/game-state";
import type { Transaction } from "../../../shared/types/economy";

export const processedTransactionIds = new Set<string>();

export function recordInLedger(
  books: BooksState,
  tx: Transaction
): BooksState {
  const actualBalance = books.actualBalance + tx.actualAmount;
  const recordedBalance = books.recordedBalance + tx.recordedAmount;

  const discrepancy = Math.abs(actualBalance - recordedBalance);
  let bookAccuracy = 100;
  if (actualBalance > 0 && discrepancy > 0) {
    const errorRatio = discrepancy / actualBalance;
    bookAccuracy = Math.max(0, Math.min(100, Math.round((1 - errorRatio) * 100)));
  }

  const unrecordedTransactions =
    tx.actualAmount !== tx.recordedAmount
      ? books.unrecordedTransactions + 1
      : books.unrecordedTransactions;

  return {
    ...books,
    actualBalance,
    recordedBalance,
    bookAccuracy,
    unrecordedTransactions,
  };
}
