import { describe, it, expect } from "vitest";
import { STORY_EVENTS_DAY_01_10 } from "../../src/client/data/story/day01-10";
import { DIALOGUE_DAY_01_10 } from "../../src/client/data/dialogue/day01-10";
import { applyConsequences } from "../../src/client/director/ConsequenceEngine";
import { createInitialState } from "../../src/client/state/createInitialState";

describe("Campaign Days 1 to 10 Story Events & Major Decisions", () => {
  it("contains all 10 required story events for Days 1 through 10", () => {
    expect(STORY_EVENTS_DAY_01_10.length).toBe(10);

    const expectedIds = [
      "story-day-01-bet",
      "story-day-02-jd-first-day",
      "story-day-03-first-regular",
      "story-day-04-pork-price-rise",
      "story-day-05-husband-profit-check",
      "story-day-06-suspicious-person",
      "story-day-07-weekend-rush",
      "story-day-08-jd-role-assignment",
      "story-day-09-market-warning",
      "story-day-10-milestone-1",
    ];

    expectedIds.forEach((id) => {
      const found = STORY_EVENTS_DAY_01_10.find((e) => e.id === id);
      expect(found).toBeDefined();
      expect(found?.choices.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Day 4 pork price rise offers distinct strategic choices", () => {
    const day4 = STORY_EVENTS_DAY_01_10.find((e) => e.id === "story-day-04-pork-price-rise");
    expect(day4).toBeDefined();
    // At least 2 strategic options (e.g. absorb price increase vs increase dish price)
    expect(day4?.choices.length).toBeGreaterThanOrEqual(2);

    const absorbChoice = day4?.choices.find((c) => c.id === "day4-absorb-cost");
    const increaseChoice = day4?.choices.find((c) => c.id === "day4-raise-price");
    expect(absorbChoice).toBeDefined();
    expect(increaseChoice).toBeDefined();
  });

  it("Day 6 suspicious person event includes safe JD options without violence", () => {
    const day6 = STORY_EVENTS_DAY_01_10.find((e) => e.id === "story-day-06-suspicious-person");
    expect(day6).toBeDefined();

    // Verify all choices adhere to JD safety (no violence/fighting)
    day6?.choices.forEach((choice) => {
      expect(choice.label).not.toMatch(/ẩu đả|đánh|lao vào/i);
    });
  });

  it("Day 9 provides stockpile vs cash reservation trade-off before Day 10 milestone", () => {
    const day9 = STORY_EVENTS_DAY_01_10.find((e) => e.id === "story-day-09-market-warning");
    expect(day9).toBeDefined();

    const stockpile = day9?.choices.find((c) => c.id === "day9-stockpile");
    const reserveCash = day9?.choices.find((c) => c.id === "day9-reserve-cash");

    expect(stockpile).toBeDefined();
    expect(reserveCash).toBeDefined();
  });

  it("Day 10 executes 20% debt milestone settlement with fail-forward mechanics", () => {
    const day10 = STORY_EVENTS_DAY_01_10.find((e) => e.id === "story-day-10-milestone-1");
    expect(day10).toBeDefined();

    const payFull = day10?.choices.find((c) => c.id === "day10-pay-full");
    const askExtension = day10?.choices.find((c) => c.id === "day10-ask-extension");

    expect(payFull).toBeDefined();
    expect(askExtension).toBeDefined();

    // Test fail-forward when asking for extension: doesn't crash or game-over
    let state = createInitialState("normal", "day10-test");
    state.economy.shopCash = 20_000;

    state = applyConsequences(state, askExtension!.consequences);
    expect(state.debt.missedInstallments).toBeGreaterThan(0);
    expect(state.debt.husbandConfidence).toBeLessThan(50);
  });

  it("dialogue lookup dictionary contains mapped strings", () => {
    expect(DIALOGUE_DAY_01_10["story.day01.bet.intro"]).toBeDefined();
    expect(DIALOGUE_DAY_01_10["story.day10.milestone.title"]).toBeDefined();
  });
});
