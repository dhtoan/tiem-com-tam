import type { BooksState } from "../../../shared/types/game-state";
import type { BookDiscrepancy } from "./discrepancies";
import { calculateBookAccuracy } from "./discrepancies";
import { BOOK_INSPECTOR } from "../../data/bookEvents";

export interface InspectionInput {
  books: BooksState;
  discrepancies: BookDiscrepancy[];
  hasReceiptSearchHelp?: boolean;
  searchTimeSec?: number;
  inspectorName?: string;
}

export interface InspectionResult {
  passed: boolean;
  accuracyScore: number;
  fineOrFee: number;
  reputationImpact: number;
  trustImpact: number;
  resolvedDiscrepancies: string[];
  feedback: string;
}

export function resolveBookInspection(input: InspectionInput): InspectionResult {
  const resolvedIds: string[] = [];

  // Check if JD or staff helped find receipts with sufficient time
  const canReconcile =
    input.hasReceiptSearchHelp && (input.searchTimeSec ?? 0) >= 10;

  if (canReconcile) {
    for (const d of input.discrepancies) {
      resolvedIds.push(d.id);
    }
  }

  const remainingDiscrepancies = input.discrepancies.filter(
    (d) => !resolvedIds.includes(d.id) && !d.resolved
  );

  const accuracy = calculateBookAccuracy(input.books, remainingDiscrepancies);
  const inspector = input.inspectorName ?? BOOK_INSPECTOR.name;

  if (accuracy >= 80 && remainingDiscrepancies.length === 0) {
    return {
      passed: true,
      accuracyScore: accuracy,
      fineOrFee: 0,
      reputationImpact: 0.2,
      trustImpact: 5,
      resolvedDiscrepancies: resolvedIds,
      feedback: `${inspector} khen ngợi: "Sổ sách thu chi rất minh bạch, lưu trữ hóa đơn đầy đủ. Tiệm cơm làm ăn rất uy tín!"`,
    };
  }

  // Failed inspection due to discrepancies or inaccurate books
  const fine = Math.min(
    200_000,
    Math.max(50_000, remainingDiscrepancies.length * 50_000 + (100 - accuracy) * 1000)
  );

  return {
    passed: false,
    accuracyScore: accuracy,
    fineOrFee: fine,
    reputationImpact: -0.2,
    trustImpact: -5,
    resolvedDiscrepancies: resolvedIds,
    feedback: `${inspector} lập biên bản nhắc nhở: "Tiệm còn thiếu hóa đơn đầu vào và số liệu chênh lệch. Cần hoàn tất hạch toán và nộp phí hành chính theo quy định."`,
  };
}
