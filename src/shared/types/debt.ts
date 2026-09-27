export interface DebtSettlementResult {
  day: 10 | 20 | 30;
  targetAmount: number;
  paidAmount: number;
  shortfall: number;
  isFullyPaid: boolean;
  husbandConfidenceChange: number;
  feedback: string;
}
