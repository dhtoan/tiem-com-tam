import { describe, it, expect } from "vitest";
import {
  campaignDays,
  getCampaignDay,
} from "../../src/client/data/campaignDays";
import { getStoryEventForDay } from "../../src/client/campaign/campaignEngine";

describe("30-Day Campaign Schedule and Day Definitions", () => {
  it("defines exactly Days 1 to 30 without gaps or duplicates", () => {
    const days = Object.keys(campaignDays)
      .map(Number)
      .sort((a, b) => a - b);

    expect(days.length).toBe(30);
    expect(days[0]).toBe(1);
    expect(days[29]).toBe(30);

    for (let d = 1; d <= 30; d++) {
      const def = getCampaignDay(d);
      expect(def).toBeDefined();
      expect(def.day).toBe(d);
      expect(def.requiredStoryEventId).toBeDefined();
      expect(typeof def.requiredStoryEventId).toBe("string");
      expect(def.requiredStoryEventId.length).toBeGreaterThan(0);
    }
  });

  it("ensures all required story event IDs are unique across the campaign", () => {
    const seenEventIds = new Set<string>();

    for (let d = 1; d <= 30; d++) {
      const def = getCampaignDay(d);
      expect(seenEventIds.has(def.requiredStoryEventId)).toBe(false);
      seenEventIds.add(def.requiredStoryEventId);
    }

    expect(seenEventIds.size).toBe(30);
  });

  it("assigns milestones to Days 10, 20, and 30", () => {
    const day10 = getCampaignDay(10);
    expect(day10.requiredStoryEventId).toMatch(/milestone-1|day-10/i);

    const day20 = getCampaignDay(20);
    expect(day20.requiredStoryEventId).toMatch(/milestone-2|day-20/i);

    const day30 = getCampaignDay(30);
    expect(day30.requiredStoryEventId).toMatch(/finale|day-30/i);
    // Day 30 queue size is ~1.5x normal
    expect(day30.initialQueueSize).toBeGreaterThanOrEqual(12);
  });

  it("resolves story event ID via campaignEngine", () => {
    expect(getStoryEventForDay(1)).toBe(getCampaignDay(1).requiredStoryEventId);
    expect(getStoryEventForDay(30)).toBe(getCampaignDay(30).requiredStoryEventId);
  });
});
