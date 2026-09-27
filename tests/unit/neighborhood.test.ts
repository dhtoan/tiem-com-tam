import { describe, it, expect } from "vitest";
import {
  adjustNeighborhoodTrust,
  getNeighborhoodBenefits,
  createIncidentFollowUp,
} from "../../src/client/systems/neighborhood/neighborhood";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { NeighborhoodState } from "../../src/shared/types/game-state";
import type { ResolvedIncident } from "../../src/shared/types/incidents";

describe("Neighborhood Trust and Community-Helper Follow-up", () => {
  it("clamps trust between 0 and 100", () => {
    expect(adjustNeighborhoodTrust(50, 30)).toBe(80);
    expect(adjustNeighborhoodTrust(90, 25)).toBe(100);
    expect(adjustNeighborhoodTrust(10, -30)).toBe(0);
  });

  it("unlocks early warning and community assistance benefits at high trust", () => {
    const lowTrustState: NeighborhoodState = {
      neighborhoodTrust: 30,
      communityLevel: 1,
      policeVisits: 0,
      localReputation: 3.0,
    };
    const lowBenefits = getNeighborhoodBenefits(lowTrustState);
    expect(lowBenefits.earlyWarningUnlocked).toBe(false);
    expect(lowBenefits.communityAssistanceUnlocked).toBe(false);

    const highTrustState: NeighborhoodState = {
      neighborhoodTrust: 80,
      communityLevel: 3,
      policeVisits: 1,
      localReputation: 4.5,
    };
    const highBenefits = getNeighborhoodBenefits(highTrustState);
    expect(highBenefits.earlyWarningUnlocked).toBe(true);
    expect(highBenefits.communityAssistanceUnlocked).toBe(true);
    expect(highBenefits.repeatTrafficBonus).toBeGreaterThan(0.1);
  });

  it("does not give total risk immunity even at max trust (100)", () => {
    const maxTrustState: NeighborhoodState = {
      neighborhoodTrust: 100,
      communityLevel: 5,
      policeVisits: 2,
      localReputation: 5.0,
    };
    const benefits = getNeighborhoodBenefits(maxTrustState);
    // Benefits are capped and reasonable; no zero-risk flag exists
    expect(benefits.repeatTrafficBonus).toBeLessThanOrEqual(0.25);
  });

  it("creates recovery follow-up event when theft occurs with camera evidence", () => {
    const state = createInitialState("normal", "seed-follow-up");
    state.campaign.day = 4;
    state.security.cameraLevel = 1;

    const theftIncident: ResolvedIncident = {
      id: "theft-001",
      type: "theft",
      resolvedAt: Date.now(),
      success: false,
      cashLoss: 120_000,
      evidenceCaptured: true,
      notes: "Thief was recorded by camera before running away",
    };

    const followUp = createIncidentFollowUp(theftIncident, state);
    expect(followUp).not.toBeNull();
    expect(followUp?.targetDay).toBe(5);
    expect(followUp?.hasEvidence).toBe(true);
    expect(followUp?.cashRewardOrRecovery).toBe(120_000);
    expect(followUp?.trustDelta).toBeGreaterThan(0);
  });

  it("creates community solidarity follow-up without evidence if trust is high", () => {
    const state = createInitialState("normal", "seed-solidarity");
    state.campaign.day = 7;
    state.neighborhood.neighborhoodTrust = 75;

    const theftIncident: ResolvedIncident = {
      id: "theft-002",
      type: "theft",
      resolvedAt: Date.now(),
      success: false,
      cashLoss: 80_000,
      evidenceCaptured: false,
      notes: "Thief snatched cash without camera footage",
    };

    const followUp = createIncidentFollowUp(theftIncident, state);
    expect(followUp).not.toBeNull();
    expect(followUp?.hasEvidence).toBe(false);
    expect(followUp?.cashRewardOrRecovery).toBe(0); // Cannot recover without evidence
    expect(followUp?.trustDelta).toBeGreaterThanOrEqual(1); // Neighbors still rally to comfort
  });
});
