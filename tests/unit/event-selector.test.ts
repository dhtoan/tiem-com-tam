import { describe, it, expect } from "vitest";
import { calculateStress } from "../../src/client/director/StressBudget";
import { DailyEventBudget, createDailyEventBudget } from "../../src/client/director/EventBudget";
import { selectEvent } from "../../src/client/director/EventSelector";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { EventDefinition } from "../../src/shared/types/events";

describe("Living Stall Director Event Selection, Stress and Budgets", () => {
  const sampleEvents: EventDefinition[] = [
    {
      id: "minor-rain",
      category: "dynamic",
      title: "Cơn mưa rào bất chợt",
      description: "Trời đổ mưa làm khách ghé trú đông hơn.",
      urgency: "low",
      timeBehavior: "realtime",
      weight: 10,
      choices: [{ id: "c1", label: "OK", consequences: [] }],
    },
    {
      id: "major-inspection",
      category: "incident",
      title: "Đoàn kiểm tra đột xuất",
      description: "Cán bộ quản lý thị trường ghé kiểm tra.",
      urgency: "high",
      timeBehavior: "slow",
      weight: 10,
      choices: [{ id: "c1", label: "OK", consequences: [] }],
      mutexGroup: "official-visit",
    },
    {
      id: "major-health-officer",
      category: "incident",
      title: "Kiểm tra an toàn thực phẩm",
      description: "Kiểm tra vệ sinh an toàn.",
      urgency: "high",
      timeBehavior: "slow",
      weight: 10,
      choices: [{ id: "c1", label: "OK", consequences: [] }],
      mutexGroup: "official-visit",
    },
    {
      id: "rare-vip",
      category: "dynamic",
      title: "Khách sành ăn ghé thăm",
      description: "Một food blogger nổi tiếng ghé tiệm.",
      urgency: "medium",
      timeBehavior: "realtime",
      weight: 20,
      maxPerRun: 1,
      cooldownDays: 5,
      choices: [{ id: "c1", label: "OK", consequences: [] }],
    },
  ];

  it("calculates player stress accurately based on cash, debt, JD stamina, and reputation", () => {
    const calmState = createInitialState("normal", "calm");
    calmState.economy.shopCash = 500_000;
    calmState.jd.stamina = 90;
    calmState.debt.missedInstallments = 0;
    calmState.reputation.rating = 4.5;
    expect(calculateStress(calmState)).toBeLessThan(30);

    const stressedState = createInitialState("normal", "stressed");
    stressedState.economy.shopCash = 30_000; // low cash: +30
    stressedState.jd.stamina = 10; // low stamina: +20
    stressedState.debt.missedInstallments = 1; // missed installment: +25
    stressedState.reputation.rating = 2.0; // low rating: +20
    expect(calculateStress(stressedState)).toBeGreaterThanOrEqual(70);
  });

  it("suppresses major events during high player stress", () => {
    const stressedState = createInitialState("normal", "stress-test");
    stressedState.economy.shopCash = 20_000;
    stressedState.debt.missedInstallments = 2;
    stressedState.jd.stamina = 5;

    const budget = createDailyEventBudget(3, "normal");
    const selected = selectEvent({
      state: stressedState,
      candidateEvents: [sampleEvents[1]!], // high urgency event
      budget,
      seed: "stress-run",
    });

    // High urgency suppressed when stress >= 70
    expect(selected).toBeNull();
  });

  it("exhausts daily budget after max events triggered", () => {
    const state = createInitialState("normal", "budget-test");
    state.economy.shopCash = 300_000;
    const budget = new DailyEventBudget(1, "normal");
    budget.maxEvents = 1;

    const first = selectEvent({
      state,
      candidateEvents: sampleEvents,
      budget,
      seed: "budget-run",
    });
    expect(first).not.toBeNull();
    budget.consume(first!.urgency);

    const second = selectEvent({
      state,
      candidateEvents: sampleEvents,
      budget,
      seed: "budget-run",
    });
    expect(second).toBeNull();
  });

  it("enforces cooldown and max-per-run limits", () => {
    const state = createInitialState("normal", "limit-test");
    state.campaign.day = 6;
    state.economy.shopCash = 300_000;

    // vip has maxPerRun = 1
    state.director.campaignEventsTriggered["rare-vip"] = 1;

    const budget = createDailyEventBudget(6, "normal");
    const selected = selectEvent({
      state,
      candidateEvents: [sampleEvents[3]!], // rare-vip
      budget,
      seed: "max-per-run-test",
    });
    expect(selected).toBeNull();

    // Reset trigger count, but set cooldown (occurred on day 4, cooldown 5 days -> available only day >= 9)
    state.director.campaignEventsTriggered["rare-vip"] = 0;
    state.director.lastEventDay["rare-vip"] = 4;
    const selectedCooldown = selectEvent({
      state,
      candidateEvents: [sampleEvents[3]!],
      budget,
      seed: "cooldown-test",
    });
    expect(selectedCooldown).toBeNull();
  });

  it("respects mutex groups preventing stacking similar major events", () => {
    const state = createInitialState("normal", "mutex-test");
    state.economy.shopCash = 300_000;
    const budget = createDailyEventBudget(5, "hard");

    const selected = selectEvent({
      state,
      candidateEvents: [sampleEvents[1]!, sampleEvents[2]!],
      budget,
      activeMutexGroupsToday: ["official-visit"],
      seed: "mutex-seed",
    });

    expect(selected).toBeNull();
  });

  it("produces deterministic selection given the same seed and state", () => {
    const state = createInitialState("normal", "seed-det");
    state.economy.shopCash = 300_000;

    const budgetA = createDailyEventBudget(2, "normal");
    const budgetB = createDailyEventBudget(2, "normal");

    const selA = selectEvent({
      state,
      candidateEvents: sampleEvents,
      budget: budgetA,
      seed: "deterministic-check",
    });

    const selB = selectEvent({
      state,
      candidateEvents: sampleEvents,
      budget: budgetB,
      seed: "deterministic-check",
    });

    expect(selA?.id).toBe(selB?.id);
  });
});
