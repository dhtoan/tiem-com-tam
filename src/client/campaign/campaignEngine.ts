import { getCampaignDay } from "../data/campaignDays";
import type { CampaignDayDefinition } from "../data/campaignDays";

export function getStoryEventForDay(day: number): string {
  return getCampaignDay(day).requiredStoryEventId;
}

export function isMilestoneDay(day: number): boolean {
  return day === 10 || day === 20 || day === 30;
}

export function getDebtMilestoneRatio(day: number): number {
  switch (day) {
    case 10:
      return 0.20; // 20%
    case 20:
      return 0.30; // 30%
    case 30:
      return 0.50; // 50%
    default:
      return 0.0;
  }
}

export function getCampaignDayMetadata(day: number): CampaignDayDefinition {
  return getCampaignDay(day);
}
