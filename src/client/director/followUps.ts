import type { GameState } from "../../shared/types/game-state";

export interface ScheduledFollowUp {
  id: string;
  targetDay: number;
  eventId: string;
}

export function scheduleFollowUp(
  state: GameState,
  followUp: { id?: string; targetDay: number; eventId: string }
): GameState {
  const item: ScheduledFollowUp = {
    id: followUp.id ?? `followup-${Date.now()}-${followUp.eventId}`,
    targetDay: followUp.targetDay,
    eventId: followUp.eventId,
  };

  return {
    ...state,
    director: {
      ...state.director,
      scheduledFollowUps: [...state.director.scheduledFollowUps, item],
    },
  };
}

export function getDueFollowUps(state: GameState, currentDay: number): string[] {
  return state.director.scheduledFollowUps
    .filter((fu) => fu.targetDay <= currentDay)
    .map((fu) => fu.eventId);
}

export function removeFollowUp(state: GameState, eventId: string): GameState {
  return {
    ...state,
    director: {
      ...state.director,
      scheduledFollowUps: state.director.scheduledFollowUps.filter(
        (fu) => fu.eventId !== eventId
      ),
    },
  };
}
