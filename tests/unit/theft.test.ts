import { describe, it, expect } from "vitest";
import type { DetectionContext, TheftIncident } from "../../src/shared/types/incidents";
import {
  advanceTheftIncident,
  calculateDetectionChance,
  createTheftIncident,
  resolveTheftIncident,
} from "../../src/client/systems/security/theft";

describe("Theft Incident State Machine and Detection", () => {
  const baseIncident: TheftIncident = createTheftIncident({
    id: "thief-001",
    thiefId: "opportunist",
    targetType: "cash",
    targetAmount: 150_000,
  });

  const lowSecContext: DetectionContext = {
    jdAssignedRole: "shop-helper",
    guardDetection: 0,
    cameraLevel: 0,
    hasLighting: false,
    neighborhoodTrust: 20,
    seed: "theft-seed-1",
  };

  const highSecContext: DetectionContext = {
    jdAssignedRole: "camera-awareness",
    guardDetection: 90,
    cameraLevel: 2,
    hasLighting: true,
    neighborhoodTrust: 80,
    seed: "theft-seed-1",
  };

  it("calculates higher detection chance with JD awareness, guard, camera, lighting, and trust", () => {
    const lowChance = calculateDetectionChance(lowSecContext, "attempt");
    const highChance = calculateDetectionChance(highSecContext, "attempt");

    expect(highChance).toBeGreaterThan(lowChance);
    // Never eliminates all risk or reaches 100%
    expect(highChance).toBeLessThanOrEqual(0.95);
    expect(lowChance).toBeGreaterThanOrEqual(0.05);
  });

  it("does not steal money instantly at appear stage", () => {
    expect(baseIncident.stage).toBe("appear");
    expect(baseIncident.stolenAmount).toBe(0);

    const afterOneSec = advanceTheftIncident(baseIncident, lowSecContext, 1000);
    expect(afterOneSec.stage).toBe("appear");
    expect(afterOneSec.stolenAmount).toBe(0);
  });

  it("progresses sequentially through appear -> observe -> target -> attempt -> escape", () => {
    let incident = { ...baseIncident };

    // Advance through appear stage duration (3000ms)
    incident = advanceTheftIncident(incident, lowSecContext, 3000);
    expect(incident.stage).toBe("observe");
    expect(incident.stolenAmount).toBe(0);

    // Advance through observe stage duration (3000ms)
    incident = advanceTheftIncident(incident, lowSecContext, 3000);
    expect(incident.stage).toBe("target");
    expect(incident.stolenAmount).toBe(0);

    // Advance through target stage duration (3000ms)
    incident = advanceTheftIncident(incident, lowSecContext, 3000);
    expect(incident.stage).toBe("attempt");
    expect(incident.stolenAmount).toBe(0);

    // Advance through attempt stage duration (3000ms)
    incident = advanceTheftIncident(incident, lowSecContext, 3000);
    expect(incident.stage).toBe("escape");
    // Escaped without detection -> loot is taken
    expect(incident.stolenAmount).toBe(150_000);
    expect(incident.outcome).toBe("escaped_with_loot");
  });

  it("stops theft immediately when resolved by intervention", () => {
    let incident = advanceTheftIncident(baseIncident, lowSecContext, 4000);
    expect(incident.stage).toBe("observe");

    incident = resolveTheftIncident(incident, "foiled_by_guard");
    expect(incident.stage).toBe("resolved");
    expect(incident.isDetected).toBe(true);
    expect(incident.stolenAmount).toBe(0);
    expect(incident.outcome).toBe("foiled_by_guard");

    // Further ticks do not modify resolved incident
    const afterTicks = advanceTheftIncident(incident, lowSecContext, 10000);
    expect(afterTicks.stage).toBe("resolved");
    expect(afterTicks.stolenAmount).toBe(0);
  });

  it("evaluates detection deterministically based on seed", () => {
    const incA = advanceTheftIncident(baseIncident, highSecContext, 3500);
    const incB = advanceTheftIncident(baseIncident, highSecContext, 3500);

    expect(incA.isDetected).toBe(incB.isDetected);
  });
});
