import { describe, it, expect } from "vitest";
import {
  assignJD,
  awardJDXp,
  applyJDWork,
  restJD,
} from "../../src/client/systems/jd/jd";
import type { JDState } from "../../src/shared/types/game-state";

describe("JD Progression and Daily Assignment", () => {
  const initialJD: JDState = {
    level: 1,
    xp: 0,
    stamina: 100,
    mood: 100,
    trustWithJoy: 80,
    assignedRole: "shop-helper",
    specializationProgress: {
      "shop-helper": 0,
      "service-runner": 0,
      cashier: 0,
      "camera-awareness": 0,
      "family-support": 0,
    },
  };

  it("assigns JD only to safe authorized roles", () => {
    const assigned = assignJD(initialJD, "cashier");
    expect(assigned.assignedRole).toBe("cashier");
  });

  it("awards XP, advances specialization, and levels up at threshold", () => {
    let jd = awardJDXp(initialJD, "cashier", 60);
    expect(jd.xp).toBe(60);
    expect(jd.specializationProgress.cashier).toBe(60);
    expect(jd.level).toBe(1);

    // Level up at 100 XP
    jd = awardJDXp(jd, "cashier", 50);
    expect(jd.level).toBe(2);
    expect(jd.xp).toBe(110);
    expect(jd.specializationProgress.cashier).toBe(110);
  });

  it("applies work fatigue clamping stamina between 0 and 100", () => {
    let jd = applyJDWork(initialJD, 40);
    expect(jd.stamina).toBe(60);

    // Overwork drains stamina to zero floor, never negative
    jd = applyJDWork(jd, 80);
    expect(jd.stamina).toBe(0);
    expect(jd.mood).toBeLessThan(100);
  });

  it("rests JD to fully restore stamina and improve mood", () => {
    let jd = applyJDWork(initialJD, 90);
    expect(jd.stamina).toBe(10);

    jd = restJD(jd);
    expect(jd.stamina).toBe(100);
    expect(jd.mood).toBe(100);
  });
});
