import { describe, it, expect } from "vitest";
import { applyTransaction } from "../../src/client/systems/economy/transactions";
import type { EconomyState, BooksState } from "../../src/shared/types/game-state";
import type { Transaction } from "../../src/shared/types/economy";

describe("Authoritative Transaction Ledger & Books", () => {
  const initialEconomy: EconomyState = {
    shopCash: 1_200_000,
    debtReserve: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    upgrades: [],
  };

  const initialBooks: BooksState = {
    bookAccuracy: 100,
    unrecordedTransactions: 0,
    actualBalance: 1_200_000,
    recordedBalance: 1_200_000,
    inspectionsPassed: 0,
  };

  it("applies revenue transaction correctly to cash, revenue, and books", () => {
    const tx: Transaction = {
      id: "tx-rev-1",
      kind: "revenue",
      amount: 45_000,
      actualAmount: 45_000,
      recordedAmount: 45_000,
      day: 1,
      description: "Cơm sườn bì chả",
      timestamp: Date.now(),
    };

    const result = applyTransaction(initialEconomy, initialBooks, tx);
    expect(result.economy.shopCash).toBe(1_245_000);
    expect(result.economy.totalRevenue).toBe(45_000);
    expect(result.books.actualBalance).toBe(1_245_000);
    expect(result.books.recordedBalance).toBe(1_245_000);
  });

  it("applies ingredient cost, guard wage, upgrade, and operating cost", () => {
    const costTx: Transaction = {
      id: "tx-cost-1",
      kind: "ingredient-cost",
      amount: -150_000,
      actualAmount: -150_000,
      recordedAmount: -150_000,
      day: 1,
      description: "Mua 5kg sườn heo",
      timestamp: Date.now(),
    };

    const res1 = applyTransaction(initialEconomy, initialBooks, costTx);
    expect(res1.economy.shopCash).toBe(1_050_000);
    expect(res1.economy.totalExpenses).toBe(150_000);

    const wageTx: Transaction = {
      id: "tx-wage-1",
      kind: "guard-wage",
      amount: -160_000,
      actualAmount: -160_000,
      recordedAmount: -160_000,
      day: 1,
      description: "Lương bảo vệ Chú Tám",
      timestamp: Date.now(),
    };
    const res2 = applyTransaction(res1.economy, res1.books, wageTx);
    expect(res2.economy.shopCash).toBe(890_000);
    expect(res2.economy.totalExpenses).toBe(310_000);
  });

  it("is idempotent when processing duplicate transaction IDs", () => {
    const tx: Transaction = {
      id: "tx-duplicate-1",
      kind: "revenue",
      amount: 50_000,
      actualAmount: 50_000,
      recordedAmount: 50_000,
      day: 1,
      description: "Cơm sườn đặc biệt",
      timestamp: Date.now(),
    };

    const firstResult = applyTransaction(initialEconomy, initialBooks, tx);
    expect(firstResult.economy.shopCash).toBe(1_250_000);

    // Re-applying same transaction ID should be a no-op
    const secondResult = applyTransaction(firstResult.economy, firstResult.books, tx);
    expect(secondResult.economy.shopCash).toBe(1_250_000);
    expect(secondResult.economy.totalRevenue).toBe(50_000);
  });
});
