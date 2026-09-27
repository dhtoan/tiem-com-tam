import type { LoyaltyState, ServeOutcome, CustomerLoyaltyEntry } from "../../../shared/types/relationships";

export function recordCustomerOutcome(
  loyalty: LoyaltyState,
  customerKey: string,
  outcome: ServeOutcome
): LoyaltyState {
  const existing: CustomerLoyaltyEntry = loyalty[customerKey] ?? {
    visits: 0,
    totalSpent: 0,
    satisfactionScore: 70,
    isRegular: false,
  };

  const visits = existing.visits + 1;
  const spent = outcome.accepted ? outcome.dishPrice + outcome.tip : 0;
  const totalSpent = existing.totalSpent + spent;

  let satisfactionDelta = outcome.accepted ? (outcome.tip > 0 ? +10 : +5) : -15;
  if (outcome.abandoned) {
    satisfactionDelta = -25;
  }

  const satisfactionScore = Math.max(
    0,
    Math.min(100, existing.satisfactionScore + satisfactionDelta)
  );
  // Becomes a regular if visited at least 3 times with satisfaction >= 75
  const isRegular = visits >= 3 && satisfactionScore >= 75;

  return {
    ...loyalty,
    [customerKey]: {
      visits,
      totalSpent,
      satisfactionScore,
      favoriteDish: outcome.recipeId,
      isRegular,
    },
  };
}
