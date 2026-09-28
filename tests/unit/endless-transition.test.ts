import { describe, it, expect } from "vitest";
import { transitionToEndless } from "../../src/client/game/modes/EndlessMode";
import { getDirectorDebugSnapshot } from "../../src/client/director/DirectorInspector";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { EndingId } from "../../src/shared/types/endings";

describe("Day 31 Endless Transition and Director Inspector", () => {
  it("transitions to Day 31 Endless mode setting isEndless flag and endlessDay", () => {
    let state = createInitialState("normal", "endless-test");
    state.campaign.day = 30;

    state = transitionToEndless(state, "perfect");

    expect(state.campaign.day).toBe(31);
    expect(state.campaign.isEndless).toBe(true);
    expect(state.campaign.endlessDay).toBe(1);
  });

  it("applies specific modifier flags for each of the six endings on Day 31", () => {
    const endings: EndingId[] = [
      "perfect",
      "family",
      "jd",
      "neighborhood",
      "husband-finance",
      "comeback",
    ];

    endings.forEach((ending) => {
      let state = createInitialState("normal", `endless-${ending}`);
      state.campaign.day = 30;

      state = transitionToEndless(state, ending);

      expect(state.campaign.flags[`endless_modifier_${ending}`]).toBe(true);

      if (ending === "family") {
        expect(state.family.husbandHelpsInStall).toBe(true);
      }
      if (ending === "perfect") {
        expect(state.reputation.rating).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  it("provides a director debug snapshot without crashing or corrupting state", () => {
    const state = createInitialState("normal", "snapshot-test");
    state.campaign.day = 15;
    state.director.dailyEventsTriggered = ["event-1"];

    const snapshot = getDirectorDebugSnapshot(state);

    expect(snapshot.currentDay).toBe(15);
    expect(snapshot.dailyEventsTriggered).toContain("event-1");
    expect(typeof snapshot.stressScore).toBe("number");
    expect(typeof snapshot.resolvedEndingCandidate).toBe("string");
  });
});
