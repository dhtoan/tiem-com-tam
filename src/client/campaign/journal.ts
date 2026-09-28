import type { GameState } from "../../shared/types/game-state";
import type { DecisionRecord, JournalEntry } from "../../shared/types/journal";

export function recordJournalEntry(
  state: GameState,
  entry: JournalEntry
): GameState {
  const currentJournal = state.campaign.journal ?? [];

  // Deduplicate: prevent exact duplicate entries
  if (currentJournal.some((j) => j.id === entry.id)) {
    return state;
  }

  const updatedJournal = [...currentJournal, entry].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.timestamp - b.timestamp;
  });

  return {
    ...state,
    campaign: {
      ...state.campaign,
      journal: updatedJournal,
    },
  };
}

export function recordDecision(
  state: GameState,
  decision: DecisionRecord
): GameState {
  const currentDecisions = state.campaign.decisions ?? [];

  return {
    ...state,
    campaign: {
      ...state.campaign,
      decisions: [...currentDecisions, decision],
      flags: {
        ...state.campaign.flags,
        [`decision_${decision.eventId}`]: decision.choiceId,
      },
    },
  };
}

export function getEndingMontageEntries(state: GameState): JournalEntry[] {
  const journal = state.campaign.journal ?? [];
  return journal.filter((entry) => entry.isMontageCandidate);
}
