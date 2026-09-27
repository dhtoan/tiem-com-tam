import { describe, it, expect, beforeEach } from "vitest";
import { GameClock } from "../../src/client/game/time/GameClock";

describe("GameClock Time Scaling and Modes", () => {
  let clock: GameClock;

  beforeEach(() => {
    clock = new GameClock();
  });

  it("initializes with default scale 1.0 and mode standard", () => {
    expect(clock.getScale()).toBe(1.0);
    expect(clock.getScaledDelta(100)).toBe(100);
  });

  it("clamps scale between 0.0 and 10.0", () => {
    clock.setScale(-0.5);
    expect(clock.getScale()).toBe(0.0);

    clock.setScale(15.0);
    expect(clock.getScale()).toBe(10.0);

    clock.setScale(0.5);
    expect(clock.getScale()).toBe(0.5);
    expect(clock.getScaledDelta(200)).toBe(100);
  });

  it("maps slow-time modes accurately", () => {
    clock.setSlowMode("standard");
    expect(clock.getScale()).toBe(0.30);

    clock.setSlowMode("extra-slow");
    expect(clock.getScale()).toBe(0.15);

    clock.setSlowMode("auto-pause");
    expect(clock.getScale()).toBe(0.0);
    expect(clock.isPaused()).toBe(true);

    clock.setSlowMode("no-timed");
    expect(clock.getScale()).toBe(0.0);
    expect(clock.isPaused()).toBe(true);
  });

  it("pauses and resumes restoring previous scale", () => {
    clock.setScale(0.75);
    clock.pause();
    expect(clock.getScale()).toBe(0.0);
    expect(clock.isPaused()).toBe(true);

    clock.resume();
    expect(clock.getScale()).toBe(0.75);
    expect(clock.isPaused()).toBe(false);
  });
});
