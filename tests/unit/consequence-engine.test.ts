import { describe, it, expect } from "vitest";
import { applyConsequences } from "../../src/client/director/ConsequenceEngine";
import { scheduleFollowUp, getDueFollowUps } from "../../src/client/director/followUps";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { Consequence } from "../../src/shared/types/events";

describe("ConsequenceEngine and Delayed Follow-ups", () => {
  it("applies cash, stock, trust, and reputation consequences", () => {
    let state = createInitialState("normal", "consequence-test");
    state.economy.shopCash = 100_000;
    state.inventory.items["rice"] = 10;
    state.neighborhood.neighborhoodTrust = 50;
    state.reputation.rating = 4.0;

    const consequences: Consequence[] = [
      { type: "cash", amount: 50_000 },
      { type: "stock", ingredientId: "rice", quantity: 5 },
      { type: "trust", delta: 10 },
      { type: "reputation", delta: 0.3 },
    ];

    state = applyConsequences(state, consequences);

    expect(state.economy.shopCash).toBe(150_000);
    expect(state.inventory.items["rice"]).toBe(15);
    expect(state.neighborhood.neighborhoodTrust).toBe(60);
    expect(state.reputation.rating).toBeCloseTo(4.3, 1);
  });

  it("applies family trust, husband confidence, and JD metrics with XP progression", () => {
    let state = createInitialState("normal", "consequence-test-family");
    state.family.familyTrust = 50;
    state.family.husbandConfidence = 50;
    state.jd.stamina = 50;
    state.jd.mood = 50;
    state.jd.xp = 80;
    state.jd.assignedRole = "cashier";

    const consequences: Consequence[] = [
      { type: "familyTrust", delta: 15 },
      { type: "husbandConfidence", delta: -10 },
      { type: "jdStamina", delta: 20 },
      { type: "jdMood", delta: 10 },
      { type: "jdXp", delta: 30 }, // 80 + 30 = 110 -> level 2
    ];

    state = applyConsequences(state, consequences);

    expect(state.family.familyTrust).toBe(65);
    expect(state.family.husbandConfidence).toBe(40);
    expect(state.debt.husbandConfidence).toBe(40);
    expect(state.jd.stamina).toBe(70);
    expect(state.jd.mood).toBe(60);
    expect(state.jd.xp).toBe(110);
    expect(state.jd.level).toBe(2);
  });

  it("sets campaign flags and unlocks upgrades", () => {
    let state = createInitialState("normal", "consequence-flags");

    const consequences: Consequence[] = [
      { type: "flag", key: "story_day4_loan_choice", value: "bank" },
      { type: "unlockUpgrade", upgradeId: "pos_system" },
    ];

    state = applyConsequences(state, consequences);

    expect(state.campaign.flags["story_day4_loan_choice"]).toBe("bank");
    expect(state.economy.upgrades).toContain("pos_system");
  });

  it("schedules delayed follow-up and retrieves due follow-ups accurately", () => {
    let state = createInitialState("normal", "consequence-followups");
    state.campaign.day = 5;

    state = scheduleFollowUp(state, {
      id: "fu-01",
      targetDay: 7,
      eventId: "day07-supplier-feedback",
    });

    expect(state.director.scheduledFollowUps.length).toBe(1);

    // On day 5, not due
    expect(getDueFollowUps(state, 5)).toEqual([]);

    // On day 7, due
    const due = getDueFollowUps(state, 7);
    expect(due).toEqual(["day07-supplier-feedback"]);
  });
});
