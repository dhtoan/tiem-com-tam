import type { EconomyState, BooksState } from "../../../shared/types/game-state";
import type { Transaction } from "../../../shared/types/economy";
import { recordInLedger, processedTransactionIds } from "../books/ledger";

export function applyTransaction(
  economy: EconomyState,
  books: BooksState,
  tx: Transaction
): { economy: EconomyState; books: BooksState } {
  // Idempotency check: if already processed, return unchanged
  if (processedTransactionIds.has(tx.id)) {
    return { economy, books };
  }
  processedTransactionIds.add(tx.id);

  let shopCash = economy.shopCash + tx.actualAmount;
  let debtReserve = economy.debtReserve;
  let totalRevenue = economy.totalRevenue;
  let totalExpenses = economy.totalExpenses;

  if (tx.kind === "debt-reserve-transfer") {
    // Transfer from shop cash to debt reserve
    const transferAmount = Math.abs(tx.actualAmount);
    shopCash = economy.shopCash - transferAmount;
    debtReserve = economy.debtReserve + transferAmount;
  } else if (tx.kind === "debt-reserve-withdrawal") {
    // Withdraw from debt reserve to shop cash
    const withdrawAmount = Math.min(debtReserve, Math.abs(tx.actualAmount));
    debtReserve = economy.debtReserve - withdrawAmount;
    shopCash = economy.shopCash + withdrawAmount;
  } else if (tx.actualAmount > 0) {
    totalRevenue += tx.actualAmount;
  } else if (tx.actualAmount < 0) {
    totalExpenses += Math.abs(tx.actualAmount);
  }

  const nextEconomy: EconomyState = {
    ...economy,
    shopCash: Math.round(shopCash),
    debtReserve: Math.round(debtReserve),
    totalRevenue: Math.round(totalRevenue),
    totalExpenses: Math.round(totalExpenses),
  };

  const nextBooks = recordInLedger(books, tx);

  return { economy: nextEconomy, books: nextBooks };
}
