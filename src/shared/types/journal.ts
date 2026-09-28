export interface JournalEntry {
  id: string;
  day: number;
  title: string;
  description: string;
  category: "milestone" | "family" | "security" | "community" | "jd" | "books";
  isMontageCandidate?: boolean;
  timestamp: number;
}

export interface DecisionRecord {
  eventId: string;
  day: number;
  choiceId: string;
  choiceLabel: string;
  timestamp: number;
}
