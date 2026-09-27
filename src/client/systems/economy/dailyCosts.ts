export interface DailyCostInput {
  day: number;
  guardWage?: number;
  extraUpkeep?: number;
}

export function calculateDailyOperatingCost(input: DailyCostInput): number {
  // Base utility costs: electricity, water, charcoal, ice, napkins
  const baseCost = 120_000 + (input.day * 1_500);
  const guard = input.guardWage ?? 0;
  const extra = input.extraUpkeep ?? 0;

  return Math.round(baseCost + guard + extra);
}
