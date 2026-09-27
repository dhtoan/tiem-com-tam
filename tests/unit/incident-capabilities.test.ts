import { describe, it, expect } from "vitest";
import { getIncidentActions } from "../../src/client/systems/incidents/incidentCapabilities";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { IncidentEvent, IncidentAction } from "../../src/shared/types/incidents";

describe("Incident Capability Resolver and Safe JD Actions", () => {
  const sampleActions: IncidentAction[] = [
    {
      id: "shout-warning",
      label: "Hô hoán cảnh báo",
      description: "Lên tiếng nhắc nhở để đối tượng biết quán đang chú ý.",
    },
    {
      id: "check-camera",
      label: "Kiểm tra góc quay camera",
      description: "Xem lại màn hình camera giám sát.",
      requiresCameraLevel: 1,
    },
    {
      id: "guard-intercept",
      label: "Yêu cầu bảo vệ can thiệp",
      description: "Bảo vệ tiến lại gần kiểm tra và ngăn chặn kịp thời.",
      requiresGuard: true,
    },
    {
      id: "jd-spot-thief",
      label: "Nhờ JD để mắt theo dõi",
      description: "JD quan sát từ xa và ghi nhận cử chỉ nghi vấn.",
      requiredRole: "camera-awareness",
    },
    {
      id: "jd-chase-fight",
      label: "Bảo JD lao ra tóm đối tượng",
      description: "Hành động nguy hiểm đối đầu trực tiếp!",
      isDanger: true,
    },
  ];

  const sampleEvent: IncidentEvent = {
    id: "inc-001",
    type: "theft",
    title: "Phát hiện đối tượng khả nghi",
    description: "Một người lén lút tiếp cận quầy để tiền.",
    urgency: "high",
    availableActions: sampleActions,
  };

  it("hides camera actions when camera level is 0, shows when upgraded", () => {
    const state = createInitialState("normal", "seed-cap-1");
    state.security.cameraLevel = 0;

    const actionsWithoutCam = getIncidentActions(sampleEvent, state);
    expect(actionsWithoutCam.some((a) => a.id === "check-camera")).toBe(false);

    state.security.cameraLevel = 1;
    const actionsWithCam = getIncidentActions(sampleEvent, state);
    expect(actionsWithCam.some((a) => a.id === "check-camera")).toBe(true);
  });

  it("hides guard action without active guard, shows when guard hired", () => {
    const state = createInitialState("normal", "seed-cap-2");
    state.security.activeGuardId = undefined;

    const actionsNoGuard = getIncidentActions(sampleEvent, state);
    expect(actionsNoGuard.some((a) => a.id === "guard-intercept")).toBe(false);

    state.security.activeGuardId = "anh-hung";
    const actionsWithGuard = getIncidentActions(sampleEvent, state);
    expect(actionsWithGuard.some((a) => a.id === "guard-intercept")).toBe(true);
  });

  it("shows JD camera-awareness action only when JD is assigned to camera-awareness", () => {
    const state = createInitialState("normal", "seed-cap-3");
    state.jd.assignedRole = "shop-helper";

    const actionsHelper = getIncidentActions(sampleEvent, state);
    expect(actionsHelper.some((a) => a.id === "jd-spot-thief")).toBe(false);

    state.jd.assignedRole = "camera-awareness";
    const actionsCameraRole = getIncidentActions(sampleEvent, state);
    expect(actionsCameraRole.some((a) => a.id === "jd-spot-thief")).toBe(true);
  });

  it("never allows dangerous confrontation actions for JD", () => {
    const state = createInitialState("normal", "seed-cap-4");
    state.jd.assignedRole = "camera-awareness";
    state.security.cameraLevel = 3;
    state.security.activeGuardId = "co-lan";

    const available = getIncidentActions(sampleEvent, state);
    expect(available.some((a) => a.isDanger === true)).toBe(false);
    expect(available.some((a) => a.id === "jd-chase-fight")).toBe(false);
  });
});
