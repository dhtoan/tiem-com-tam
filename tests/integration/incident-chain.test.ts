import { describe, it, expect } from "vitest";
import { createInitialState } from "../../src/client/state/createInitialState";
import { hireGuardForShift } from "../../src/client/systems/security/guards";
import {
  createTheftIncident,
  advanceTheftIncident,
  resolveTheftIncident,
} from "../../src/client/systems/security/theft";
import { getIncidentActions } from "../../src/client/systems/incidents/incidentCapabilities";
import {
  adjustNeighborhoodTrust,
  createIncidentFollowUp,
} from "../../src/client/systems/neighborhood/neighborhood";
import type {
  DetectionContext,
  IncidentAction,
  IncidentEvent,
  ResolvedIncident,
} from "../../src/shared/types/incidents";

describe("Linked Incident Chain Integration", () => {
  it("executes complete successful security resolution chain", () => {
    // 1. Initial State
    let state = createInitialState("normal", "seed-chain-success");
    state.campaign.day = 5;
    state.economy.shopCash = 600_000;
    state.security.cameraLevel = 1;
    state.jd.assignedRole = "camera-awareness";
    state.neighborhood.neighborhoodTrust = 60;

    // 2. Hire guard
    state = hireGuardForShift(state, "chu-tam", "morning");
    expect(state.economy.shopCash).toBe(440_000);
    expect(state.security.activeGuardId).toBe("chu-tam");

    // 3. Thief appears
    const incident = createTheftIncident({
      id: "theft-chain-01",
      thiefId: "pickpocket-01",
      targetType: "cash",
      targetAmount: 180_000,
      stageDurationMs: 2000,
    });
    expect(incident.stage).toBe("appear");
    expect(incident.stolenAmount).toBe(0);

    // 4. Detection Context
    const detectContext: DetectionContext = {
      jdAssignedRole: state.jd.assignedRole,
      guardDetection: 60,
      cameraLevel: state.security.cameraLevel,
      hasLighting: state.security.hasLighting,
      neighborhoodTrust: state.neighborhood.neighborhoodTrust,
      seed: "incident-chain-seed",
    };

    // 5. Advance incident -> detected during approach (observe/target/attempt)
    let detectedIncident = { ...incident };
    while (!detectedIncident.isDetected && detectedIncident.stage !== "escape") {
      detectedIncident = advanceTheftIncident(detectedIncident, detectContext, 1000);
    }
    expect(detectedIncident.isDetected).toBe(true);
    expect(detectedIncident.stage).not.toBe("escape");

    // 6. Capabilities check for actions
    const event: IncidentEvent = {
      id: "event-chain-01",
      type: "theft",
      title: "Đối tượng tiếp cận quầy thu ngân",
      description: "JD và camera phát hiện người lạ đang thò tay vào hộp tiền!",
      urgency: "high",
      availableActions: [
        {
          id: "guard-action",
          label: "Bảo vệ Chú Tám can thiệp",
          description: "Chú Tám nhanh chóng chặn đường và yêu cầu dừng lại.",
          requiresGuard: true,
        },
        {
          id: "check-cam",
          label: "Trích xuất camera",
          description: "Lưu lại bằng chứng hình ảnh.",
          requiresCameraLevel: 1,
        },
        {
          id: "jd-fight",
          label: "JD xông vào ẩu đả",
          description: "Hành động nguy hiểm bị cấm!",
          isDanger: true,
        },
      ],
    };

    const actions = getIncidentActions(event, state);
    expect(actions.some((a) => a.id === "guard-action")).toBe(true);
    expect(actions.some((a) => a.id === "check-cam")).toBe(true);
    expect(actions.some((a) => a.isDanger === true)).toBe(false);

    // 7. Resolve incident via guard intervention
    const resolvedIncident = resolveTheftIncident(
      detectedIncident,
      "foiled_by_guard"
    );
    expect(resolvedIncident.stage).toBe("resolved");
    expect(resolvedIncident.stolenAmount).toBe(0);

    // 8. Record resolved incident log
    const logItem: ResolvedIncident = {
      id: resolvedIncident.id,
      type: "theft",
      resolvedAt: Date.now(),
      success: true,
      cashLoss: 0,
      evidenceCaptured: true,
      notes: "Chú Tám can thiệp kịp thời, camera ghi hình rõ nét.",
    };

    // 9. Neighborhood Trust rises
    state.neighborhood.neighborhoodTrust = adjustNeighborhoodTrust(
      state.neighborhood.neighborhoodTrust,
      5
    );
    expect(state.neighborhood.neighborhoodTrust).toBe(65);

    // 10. Generate follow-up
    const followUp = createIncidentFollowUp(logItem, state);
    expect(followUp).not.toBeNull();
    expect(followUp?.hasEvidence).toBe(true);
    expect(followUp?.trustDelta).toBeGreaterThan(0);
  });

  it("handles alternate no-security path with graceful fail-forward loss", () => {
    // 1. Initial State with zero security
    let state = createInitialState("normal", "seed-chain-fail");
    state.campaign.day = 2;
    state.economy.shopCash = 150_000;
    state.security.cameraLevel = 0;
    state.security.activeGuardId = undefined;
    state.jd.assignedRole = "shop-helper";
    state.neighborhood.neighborhoodTrust = 30;

    // 2. Thief targets cash box
    let incident = createTheftIncident({
      id: "theft-fail-02",
      thiefId: "opportunist-02",
      targetType: "cash",
      targetAmount: 80_000,
      stageDurationMs: 1000,
    });

    const noSecContext: DetectionContext = {
      jdAssignedRole: "shop-helper",
      guardDetection: 0,
      cameraLevel: 0,
      hasLighting: false,
      neighborhoodTrust: 30,
      seed: "fail-seed",
    };

    // 3. Advance through entire progression to escape
    incident = advanceTheftIncident(incident, noSecContext, 1000); // appear -> observe
    incident = advanceTheftIncident(incident, noSecContext, 1000); // observe -> target
    incident = advanceTheftIncident(incident, noSecContext, 1000); // target -> attempt
    incident = advanceTheftIncident(incident, noSecContext, 1000); // attempt -> escape

    expect(incident.stage).toBe("escape");
    expect(incident.stolenAmount).toBe(80_000);
    expect(incident.outcome).toBe("escaped_with_loot");

    // 4. Fail-forward economy update
    state = {
      ...state,
      economy: {
        ...state.economy,
        shopCash: Math.max(0, state.economy.shopCash - incident.stolenAmount),
      },
      security: {
        ...state.security,
        theftCount: state.security.theftCount + 1,
        incidentHistory: [...state.security.incidentHistory, incident.id],
      },
      neighborhood: {
        ...state.neighborhood,
        neighborhoodTrust: adjustNeighborhoodTrust(
          state.neighborhood.neighborhoodTrust,
          -5
        ),
      },
    };

    // State remains fully valid
    expect(state.economy.shopCash).toBe(70_000);
    expect(state.security.theftCount).toBe(1);
    expect(state.neighborhood.neighborhoodTrust).toBe(25);

    // Follow-up without evidence
    const failLog: ResolvedIncident = {
      id: incident.id,
      type: "theft",
      resolvedAt: Date.now(),
      success: false,
      cashLoss: incident.stolenAmount,
      evidenceCaptured: false,
      notes: "Kẻ gian trốn thoát không để lại dấu vết.",
    };

    const followUp = createIncidentFollowUp(failLog, state);
    // Trust is 25 (< 50) and no camera evidence -> no immediate follow up
    expect(followUp).toBeNull();
  });
});
