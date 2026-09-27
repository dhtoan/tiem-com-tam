export type TransactionKind =
  | "revenue"
  | "ingredient-cost"
  | "guard-wage"
  | "upgrade"
  | "operating-cost"
  | "debt-reserve-transfer"
  | "debt-reserve-withdrawal"
  | "debt-payment"
  | "penalty";

export interface Transaction {
  id: string;
  kind: TransactionKind;
  amount: number; // positive or negative integer dong
  actualAmount: number;
  recordedAmount: number;
  day: number;
  description: string;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}
