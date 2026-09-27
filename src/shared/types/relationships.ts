export interface CustomerLoyaltyEntry {
  visits: number;
  totalSpent: number;
  satisfactionScore: number; // 0-100
  favoriteDish?: string;
  isRegular: boolean;
}

export type LoyaltyState = Record<string, CustomerLoyaltyEntry>;

export interface ServeOutcome {
  accepted: boolean;
  abandoned?: boolean;
  dishPrice: number;
  tip: number;
  recipeId: string;
}
