import { describe, it, expect } from "vitest";
import {
  createBookDiscrepancy,
  calculateBookAccuracy,
} from "../../src/client/systems/books/discrepancies";
import { resolveBookInspection } from "../../src/client/systems/books/inspection";
import type { BooksState } from "../../src/shared/types/game-state";
import type { BookDiscrepancy } from "../../src/client/systems/books/discrepancies";

describe("Bookkeeping Discrepancies and Inspection Resolution", () => {
  const cleanBooks: BooksState = {
    bookAccuracy: 100,
    unrecordedTransactions: 0,
    actualBalance: 500_000,
    recordedBalance: 500_000,
    inspectionsPassed: 0,
  };

  it("creates a discrepancy for JD mis-entry and preserves actual vs recorded amounts", () => {
    const disc = createBookDiscrepancy("tx-101", 35_000, 50_000, "jd_typo");

    expect(disc.txId).toBe("tx-101");
    expect(disc.recordedAmount).toBe(35_000);
    expect(disc.actualAmount).toBe(50_000);
    expect(disc.diff).toBe(-15_000); // 35k - 50k
    expect(disc.resolved).toBe(false);
  });

  it("calculates accuracy correctly with clean books vs unrecorded items", () => {
    expect(calculateBookAccuracy(cleanBooks)).toBe(100);

    const messyBooks: BooksState = {
      bookAccuracy: 80,
      unrecordedTransactions: 4,
      actualBalance: 600_000,
      recordedBalance: 520_000,
      inspectionsPassed: 0,
    };
    const accuracy = calculateBookAccuracy(messyBooks);
    expect(accuracy).toBeLessThan(100);
    expect(accuracy).toBeGreaterThanOrEqual(0);
  });

  it("passes inspection with flying colors when books are clean", () => {
    const result = resolveBookInspection({
      books: cleanBooks,
      discrepancies: [],
    });

    expect(result.passed).toBe(true);
    expect(result.fineOrFee).toBe(0);
    expect(result.trustImpact).toBeGreaterThan(0);
    expect(result.feedback).toMatch(/minh bạch|khen ngợi/i);
  });

  it("reconciles discrepancies when receipt-search help or time is provided", () => {
    const disc1 = createBookDiscrepancy("tx-1", 40_000, 60_000, "lost_receipt");
    const disc2 = createBookDiscrepancy("tx-2", 20_000, 30_000, "jd_typo");

    const booksWithIssues: BooksState = {
      bookAccuracy: 70,
      unrecordedTransactions: 2,
      actualBalance: 400_000,
      recordedBalance: 330_000,
      inspectionsPassed: 0,
    };

    // With receipt-search help (e.g. JD helps find the physical paper receipts)
    const resultWithHelp = resolveBookInspection({
      books: booksWithIssues,
      discrepancies: [disc1, disc2],
      hasReceiptSearchHelp: true,
      searchTimeSec: 15,
    });

    expect(resultWithHelp.resolvedDiscrepancies.length).toBeGreaterThan(0);
    expect(resultWithHelp.passed).toBe(true);
    expect(resultWithHelp.fineOrFee).toBe(0);
  });

  it("fails inspection and applies gameified administrative fee when discrepancies remain unresolved", () => {
    const disc1 = createBookDiscrepancy("tx-1", 10_000, 100_000, "unrecorded_cash");
    const disc2 = createBookDiscrepancy("tx-2", 0, 50_000, "lost_receipt");

    const messyBooks: BooksState = {
      bookAccuracy: 50,
      unrecordedTransactions: 5,
      actualBalance: 500_000,
      recordedBalance: 350_000,
      inspectionsPassed: 0,
    };

    const failResult = resolveBookInspection({
      books: messyBooks,
      discrepancies: [disc1, disc2],
      hasReceiptSearchHelp: false,
      searchTimeSec: 0,
    });

    expect(failResult.passed).toBe(false);
    expect(failResult.fineOrFee).toBeGreaterThan(0);
    expect(failResult.trustImpact).toBeLessThan(0);
    expect(failResult.resolvedDiscrepancies.length).toBe(0);
  });
});
