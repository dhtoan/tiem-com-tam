import type { GameState } from "../../shared/types/game-state";
import { resolveEnding } from "./EndingResolver";

export interface DirectorDebugSnapshot {
  currentDay: number;
  phase: string;
  stressScore: number;
  dailyEventsTriggered: string[];
  campaignEventsTriggered: Record<string, number>;
  activeFollowUpsCount: number;
  resolvedEndingCandidate: string;
  isEndless: boolean;
}

export function getDirectorDebugSnapshot(
  state: GameState
): DirectorDebugSnapshot {
  return {
    currentDay: state.campaign.day,
    phase: state.campaign.phase,
    stressScore: state.director.stressScore,
    dailyEventsTriggered: state.director.dailyEventsTriggered,
    campaignEventsTriggered: state.director.campaignEventsTriggered,
    activeFollowUpsCount: state.director.scheduledFollowUps.length,
    resolvedEndingCandidate: resolveEnding(state),
    isEndless: state.campaign.isEndless,
  };
}
