import type { DayPhase } from "../../shared/types/core";

export interface CampaignDayDefinition {
  day: number;
  title: string;
  storyTitle: string;
  requiredStoryEventId: string;
  initialQueueSize: number;
  phases: DayPhase[];
}

export const campaignDays: Record<number, CampaignDayDefinition> = {
  1: {
    day: 1,
    title: "Khai Trương Quán Cơm Tấm",
    storyTitle: "Kèo 30 Ngày",
    requiredStoryEventId: "story-day-01-bet",
    initialQueueSize: 5,
    phases: [
      "morning",
      "market",
      "prep",
      "story",
      "opening",
      "service",
      "closing",
      "books",
      "family",
      "summary",
    ],
  },
};

export function getCampaignDay(day: number): CampaignDayDefinition {
  return (
    campaignDays[day] ?? {
      day,
      title: `Ngày ${day}`,
      storyTitle: `Diễn biến ngày ${day}`,
      requiredStoryEventId: `story-day-${day.toString().padStart(2, "0")}`,
      initialQueueSize: 5 + Math.floor(day / 3),
      phases: [
        "morning",
        "market",
        "prep",
        "story",
        "opening",
        "service",
        "closing",
        "books",
        "family",
        "summary",
      ],
    }
  );
}
