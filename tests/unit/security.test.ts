import { describe, it, expect } from "vitest";
import {
  calculateSecurityScore,
  getSecurityCapabilities,
} from "../../src/client/systems/security/security";
import type { SecurityState } from "../../src/shared/types/game-state";

describe("Security Score and Equipment Capabilities", () => {
  const baseState: SecurityState = {
    securityScore: 20,
    cameraLevel: 0,
    hasLock: false,
    hasLighting: false,
    activeGuardId: undefined,
    theftCount: 0,
    incidentHistory: [],
  };

  it("calculates base score without upgrades as 20", () => {
    expect(calculateSecurityScore(baseState)).toBe(20);
    const caps = getSecurityCapabilities(baseState);
    expect(caps.hasLock).toBe(false);
    expect(caps.hasLighting).toBe(false);
    expect(caps.cameraLevel).toBe(0);
    expect(caps.hasActiveGuard).toBe(false);
  });

  it("increases security score with lock, lighting, camera levels, and guard", () => {
    const withLock: SecurityState = { ...baseState, hasLock: true };
    expect(calculateSecurityScore(withLock)).toBe(35);

    const withLight: SecurityState = { ...withLock, hasLighting: true };
    expect(calculateSecurityScore(withLight)).toBe(55);

    const withCamera: SecurityState = { ...withLight, cameraLevel: 2 };
    expect(calculateSecurityScore(withCamera)).toBe(95);

    const fullSecurity: SecurityState = {
      ...withCamera,
      activeGuardId: "chu-tam",
    };
    // 20 + 15 + 20 + 40 + 25 = 120 -> clamped to 100
    expect(calculateSecurityScore(fullSecurity)).toBe(100);

    const caps = getSecurityCapabilities(fullSecurity);
    expect(caps.hasLock).toBe(true);
    expect(caps.hasLighting).toBe(true);
    expect(caps.cameraLevel).toBe(2);
    expect(caps.hasActiveGuard).toBe(true);
  });
});
