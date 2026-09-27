export function adjustFamilyTrust(value: number, delta: number): number {
  return Math.max(0, Math.min(100, Math.round(value + delta)));
}

export function adjustHusbandConfidence(value: number, delta: number): number {
  return Math.max(0, Math.min(100, Math.round(value + delta)));
}
