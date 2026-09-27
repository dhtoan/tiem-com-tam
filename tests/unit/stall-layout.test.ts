import { describe, it, expect } from "vitest";
import { getStallLayout } from "../../src/client/game/layout/stallLayout";
import type { StationId } from "../../src/shared/types/core";

describe("Stall Layout & Camera Anchors", () => {
  it("defines desktop layout with locked spatial hierarchy: grill left of display, plating bottom", () => {
    const layout = getStallLayout(1280, 720);
    expect(layout.isMobile).toBe(false);

    const { grill, display, plating, customers } = layout.stations;
    // Grill is to the left of the display
    expect(grill.x + grill.width).toBeLessThanOrEqual(display.x + 50);
    // Plating is at the bottom foreground
    expect(plating.y).toBeGreaterThan(display.y);
    // Customers queue is at top background
    expect(customers.y).toBeLessThan(grill.y);

    // Assert rectangles do not collapse to zero size
    const stations: StationId[] = ["grill", "display", "plating", "customers"];
    for (const id of stations) {
      const rect = layout.stations[id];
      expect(rect.width).toBeGreaterThan(50);
      expect(rect.height).toBeGreaterThan(50);
    }
  });

  it("defines mobile layout with four responsive station anchors", () => {
    const layout = getStallLayout(390, 844);
    expect(layout.isMobile).toBe(true);

    const stations: StationId[] = ["grill", "display", "plating", "customers"];
    for (const id of stations) {
      const rect = layout.stations[id];
      expect(rect.width).toBeGreaterThan(50);
      expect(rect.height).toBeGreaterThan(50);
    }
  });
});
