import type { SecurityState } from "../../../shared/types/game-state";
import type { SecurityCapabilities } from "../../../shared/types/security";

export function calculateSecurityScore(state: SecurityState): number {
  let score = 20; // base score

  if (state.hasLock) score += 15;
  if (state.hasLighting) score += 20;
  if (state.cameraLevel > 0) score += Math.min(60, state.cameraLevel * 20);
  if (state.activeGuardId) score += 25;

  return Math.max(0, Math.min(100, score));
}

export function getSecurityCapabilities(state: SecurityState): SecurityCapabilities {
  return {
    hasLock: state.hasLock,
    hasLighting: state.hasLighting,
    cameraLevel: state.cameraLevel,
    hasActiveGuard: !!state.activeGuardId,
  };
}
