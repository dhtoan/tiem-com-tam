import { describe, it, expect } from "vitest";
import { STORY_EVENTS_DAY_11_20 } from "../../src/client/data/story/day11-20";
import { DIALOGUE_DAY_11_20 } from "../../src/client/data/dialogue/day11-20";
import { applyConsequences } from "../../src/client/director/ConsequenceEngine";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Campaign Days 11 to 20 Story Events & Major Decisions", () => {
  it("contains all 10 required story events for Days 11 through 20", () => {
    expect(STORY_EVENTS_DAY_11_20.length).toBe(10);

    const expectedIds = [
      "story-day-11-neighborhood-visit",
      "story-day-12-missing-item",
      "story-day-13-guard-vs-camera",
      "story-day-14-jd-exhaustion",
      "story-day-15-midpoint-review",
      "story-day-16-competitor-discount",
      "story-day-17-operational-challenge",
      "story-day-18-book-inspection",
      "story-day-19-husband-finance-debate",
      "story-day-20-milestone-2",
    ];

    expectedIds.forEach((id) => {
      const found = STORY_EVENTS_DAY_11_20.find((e) => e.id === id);
      expect(found).toBeDefined();
      expect(found?.choices.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Day 12 handles missing item investigation with community/camera clues", () => {
    const day12 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-12-missing-item");
    expect(day12).toBeDefined();

    const investigate = day12?.choices.find((c) => c.id === "day12-investigate");
    const compensate = day12?.choices.find((c) => c.id === "day12-support-customer");
    expect(investigate).toBeDefined();
    expect(compensate).toBeDefined();
  });

  it("Day 13 offers guard hiring vs security camera choice", () => {
    const day13 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-13-guard-vs-camera");
    expect(day13).toBeDefined();

    const hireGuard = day13?.choices.find((c) => c.id === "day13-choose-guard");
    const installCamera = day13?.choices.find((c) => c.id === "day13-choose-camera");

    expect(hireGuard).toBeDefined();
    expect(installCamera).toBeDefined();
  });

  it("Day 14 allows resting JD to restore stamina and mood", () => {
    const day14 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-14-jd-exhaustion");
    expect(day14).toBeDefined();

    const restChoice = day14?.choices.find((c) => c.id === "day14-rest-jd");
    expect(restChoice).toBeDefined();

    let state = createInitialState("normal", "day14-test");
    state.jd.stamina = 15;
    state.jd.mood = 30;

    state = applyConsequences(state, restChoice!.consequences);
    expect(state.jd.stamina).toBeGreaterThan(60);
    expect(state.jd.mood).toBeGreaterThan(50);
  });

  it("Day 16 competitor response offers quality vs price matching strategy", () => {
    const day16 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-16-competitor-discount");
    expect(day16).toBeDefined();

    const qualityChoice = day16?.choices.find((c) => c.id === "day16-focus-quality");
    const discountChoice = day16?.choices.find((c) => c.id === "day16-match-discount");

    expect(qualityChoice).toBeDefined();
    expect(discountChoice).toBeDefined();
  });

  it("Day 18 book inspection validates bookkeeping readiness", () => {
    const day18 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-18-book-inspection");
    expect(day18).toBeDefined();

    const presentBooks = day18?.choices.find((c) => c.id === "day18-present-books");
    expect(presentBooks).toBeDefined();
  });

  it("Day 19 finance choice balances reserve vs equipment", () => {
    const day19 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-19-husband-finance-debate");
    expect(day19).toBeDefined();

    const saveReserve = day19?.choices.find((c) => c.id === "day19-keep-reserves");
    const investEquip = day19?.choices.find((c) => c.id === "day19-invest-equipment");

    expect(saveReserve).toBeDefined();
    expect(investEquip).toBeDefined();
  });

  it("Day 20 settles 30% debt milestone with fail-forward mechanics", () => {
    const day20 = STORY_EVENTS_DAY_11_20.find((e) => e.id === "story-day-20-milestone-2");
    expect(day20).toBeDefined();

    const payFull = day20?.choices.find((c) => c.id === "day20-pay-full");
    const partial = day20?.choices.find((c) => c.id === "day20-pay-partial");

    expect(payFull).toBeDefined();
    expect(partial).toBeDefined();

    let state = createInitialState("normal", "day20-test");
    state.economy.shopCash = 500_000;

    state = applyConsequences(state, partial!.consequences);
    expect(state.debt.missedInstallments).toBeGreaterThan(0);
  });

  it("dialogue lookup dictionary contains mapped strings for Days 11-20", () => {
    expect(DIALOGUE_DAY_11_20["story.day11.visit.intro"]).toBeDefined();
    expect(DIALOGUE_DAY_11_20["story.day20.milestone.intro"]).toBeDefined();
  });
});
