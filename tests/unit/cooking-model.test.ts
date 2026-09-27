import { describe, it, expect } from "vitest";
import {
  createGrillItem,
  advanceCook,
  flipCookItem,
} from "../../src/client/game/systems/cooking/cookingModel";

describe("Grill Cooking Model", () => {
  it("advances from raw to cooking-a and reaches ready-to-flip", () => {
    let item = createGrillItem("suon-heo");
    expect(item.stage).toBe("raw");

    item = advanceCook(item, 500, 1.0);
    expect(item.stage).toBe("cooking-a");

    // Advance to ready-to-flip (around 3500ms)
    item = advanceCook(item, 3500, 1.0);
    expect(item.stage).toBe("ready-to-flip");
  });

  it("handles valid flip during ready-to-flip and reaches perfect stage", () => {
    let item = createGrillItem("suon-heo");
    item = advanceCook(item, 4000, 1.0);
    expect(item.stage).toBe("ready-to-flip");

    item = flipCookItem(item);
    expect(item.stage).toBe("cooking-b");
    expect(item.flipCount).toBe(1);

    // Side B cooks to perfect (3500ms)
    item = advanceCook(item, 3500, 1.0);
    expect(item.stage).toBe("perfect");
    expect(item.quality).toBe(100);
  });

  it("transitions to overcooked and then burnt if neglected", () => {
    let item = createGrillItem("suon-heo");
    item = advanceCook(item, 4000, 1.0);
    item = flipCookItem(item);
    item = advanceCook(item, 3500, 1.0);
    expect(item.stage).toBe("perfect");

    // Left too long -> overcooked
    item = advanceCook(item, 3000, 1.0);
    expect(item.stage).toBe("overcooked");
    expect(item.quality).toBeLessThan(100);

    // Left even longer -> burnt
    item = advanceCook(item, 3500, 1.0);
    expect(item.stage).toBe("burnt");
    expect(item.quality).toBe(0);
  });

  it("penalizes repeated invalid flips", () => {
    let item = createGrillItem("suon-heo");
    item = advanceCook(item, 4000, 1.0);
    item = flipCookItem(item); // 1st valid flip
    expect(item.flipCount).toBe(1);

    const initialQ = item.quality;
    item = flipCookItem(item); // 2nd flip
    expect(item.flipCount).toBe(2);
    expect(item.quality).toBeLessThan(initialQ);

    item = flipCookItem(item); // 3rd flip
    expect(item.flipCount).toBe(3);
    expect(item.quality).toBeLessThan(initialQ - 10);
  });

  it("produces deterministic results from equal inputs", () => {
    let itemA = createGrillItem("suon-heo");
    let itemB = createGrillItem("suon-heo");

    itemA = advanceCook(itemA, 4200, 1.2);
    itemB = advanceCook(itemB, 4200, 1.2);

    expect(itemA.stage).toBe(itemB.stage);
    expect(itemA.quality).toBe(itemB.quality);
    expect(itemA.sideAElapsedMs).toBe(itemB.sideAElapsedMs);
  });
});
