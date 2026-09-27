import type { GameState } from "../../../shared/types/game-state";
import type { IncidentAction, IncidentEvent } from "../../../shared/types/incidents";

export function getIncidentActions(
  event: IncidentEvent,
  state: GameState
): IncidentAction[] {
  return event.availableActions.filter((action) => {
    // JD Safety Invariant: Never allow physical fight or violent confrontation
    if (action.isDanger) {
      return false;
    }

    // Guard capability check
    if (action.requiresGuard && !state.security.activeGuardId) {
      return false;
    }

    // Camera capability check
    if (
      action.requiresCameraLevel !== undefined &&
      state.security.cameraLevel < action.requiresCameraLevel
    ) {
      return false;
    }

    // JD Role capability check
    if (action.requiredRole && state.jd.assignedRole !== action.requiredRole) {
      return false;
    }

    // Upgrade capability check
    if (
      action.requiredUpgrade &&
      !state.economy.upgrades.includes(action.requiredUpgrade)
    ) {
      return false;
    }

    return true;
  });
}
