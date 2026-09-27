export function adjustReputation(value: number, delta: number): number {
  const next = value + delta;
  // Clamped between 1.0 and 5.0, rounded to 1 decimal place
  return Math.max(1.0, Math.min(5.0, Math.round(next * 10) / 10));
}
