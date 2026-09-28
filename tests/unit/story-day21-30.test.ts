import { describe, it, expect } from "vitest";
import { STORY_EVENTS_DAY_21_30 } from "../../src/client/data/story/day21-30";
import { DIALOGUE_DAY_21_30 } from "../../src/client/data/dialogue/day21-30";
import { applyConsequences } from "../../src/client/director/ConsequenceEngine";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Campaign Days 21 to 30 Story Events & Finale", () => {
  it("contains all 10 required story events for Days 21 through 30", () => {
    expect(STORY_EVENTS_DAY_21_30.length).toBe(10);

    const expectedIds = [
      "story-day-21-viral-surge",
      "story-day-22-jd-specialization",
      "story-day-23-security-climax",
      "story-day-24-catering-opportunity",
      "story-day-25-husband-helps",
      "story-day-26-late-market-shock",
      "story-day-27-final-books-check",
      "story-day-28-neighborhood-climax",
      "story-day-29-final-strategy",
      "story-day-30-finale",
    ];

    expectedIds.forEach((id) => {
      const found = STORY_EVENTS_DAY_21_30.find((e) => e.id === id);
      expect(found).toBeDefined();
      expect(found?.choices.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Day 22 promotes JD specialization with massive XP and role mastery", () => {
    const day22 = STORY_EVENTS_DAY_21_30.find((e) => e.id === "story-day-22-jd-specialization");
    expect(day22).toBeDefined();

    const specChoice = day22?.choices.find((c) => c.id === "day22-specialize-jd");
    expect(specChoice).toBeDefined();

    let state = createInitialState("normal", "day22-test");
    state.jd.xp = 180;
    state = applyConsequences(state, specChoice!.consequences);

    expect(state.jd.xp).toBeGreaterThanOrEqual(250);
    expect(state.jd.level).toBe(3);
    expect(state.campaign.flags["story_day22_jd_mastered"]).toBe(true);
  });

  it("Day 24 offers high-volume catering order with substantial revenue", () => {
    const day24 = STORY_EVENTS_DAY_21_30.find((e) => e.id === "story-day-24-catering-opportunity");
    expect(day24).toBeDefined();

    const acceptCatering = day24?.choices.find((c) => c.id === "day24-accept-catering");
    expect(acceptCatering).toBeDefined();

    let state = createInitialState("normal", "day24-test");
    state.economy.shopCash = 100_000;
    state = applyConsequences(state, acceptCatering!.consequences);

    expect(state.economy.shopCash).toBeGreaterThan(100_000);
    expect(state.campaign.flags["story_day24_catering_completed"]).toBe(true);
  });

  it("Day 25 enables husband to step into stall and help Joy directly", () => {
    const day25 = STORY_EVENTS_DAY_21_30.find((e) => e.id === "story-day-25-husband-helps");
    expect(day25).toBeDefined();

    const acceptHelp = day25?.choices.find((c) => c.id === "day25-accept-help");
    expect(acceptHelp).toBeDefined();

    let state = createInitialState("normal", "day25-test");
    expect(state.family.husbandHelpsInStall).toBe(false);

    state = applyConsequences(state, acceptHelp!.consequences);
    expect(state.family.husbandHelpsInStall).toBe(true);
    expect(state.family.familyTrust).toBeGreaterThan(60);
  });

  it("Day 28 community climax cements Neighborhood Trust", () => {
    const day28 = STORY_EVENTS_DAY_21_30.find((e) => e.id === "story-day-28-neighborhood-climax");
    expect(day28).toBeDefined();

    const rallyCommunity = day28?.choices.find((c) => c.id === "day28-rally-community");
    expect(rallyCommunity).toBeDefined();

    let state = createInitialState("normal", "day28-test");
    state.neighborhood.neighborhoodTrust = 75;

    state = applyConsequences(state, rallyCommunity!.consequences);
    expect(state.neighborhood.neighborhoodTrust).toBeGreaterThanOrEqual(90);
  });

  it("Day 30 finale triggers debt completion and ending flags", () => {
    const day30 = STORY_EVENTS_DAY_21_30.find((e) => e.id === "story-day-30-finale");
    expect(day30).toBeDefined();

    const settleFinal = day30?.choices.find((c) => c.id === "day30-settle-final");
    expect(settleFinal).toBeDefined();

    let state = createInitialState("normal", "day30-test");
    state.economy.shopCash = 3_000_000;
    state.debt.remainingDebt = 2_500_000;

    state = applyConsequences(state, settleFinal!.consequences);
    expect(state.campaign.flags["story_day30_resolved"]).toBe(true);
  });

  it("dialogue lookup dictionary contains mapped strings for Days 21-30", () => {
    expect(DIALOGUE_DAY_21_30["story.day21.viral.intro"]).toBeDefined();
    expect(DIALOGUE_DAY_21_30["story.day30.finale.intro"]).toBeDefined();
  });
});
