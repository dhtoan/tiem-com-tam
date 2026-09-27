import { describe, it, expect } from "vitest";
import {
  purchaseStock,
  consumeStock,
  advanceFreshness,
} from "../../src/client/systems/inventory/inventory";
import type { InventoryState } from "../../src/shared/types/game-state";

describe("Inventory, Freshness and Spoilage", () => {
  const initialInventory: InventoryState = {
    items: {
      "suon-heo": 10,
      "com-tam": 20,
    },
    batches: [
      {
        id: "batch-1",
        ingredientId: "suon-heo",
        quantity: 10,
        dayPurchased: 1,
        freshness: "fresh",
      },
    ],
  };

  it("purchases new stock in batches and updates total count", () => {
    const result = purchaseStock({
      inventory: initialInventory,
      ingredientId: "suon-heo",
      quantity: 5,
      unitCost: 15_000,
      currentDay: 1,
    });

    expect(result.success).toBe(true);
    expect(result.totalCost).toBe(75_000);
    expect(result.inventory.items["suon-heo"]).toBe(15);
    expect(result.inventory.batches).toHaveLength(2);
  });

  it("consumes stock FIFO from oldest batch", () => {
    const inv = consumeStock(initialInventory, "suon-heo", 4);
    expect(inv.items["suon-heo"]).toBe(6);
    expect(inv.batches[0]?.quantity).toBe(6);
  });

  it("throws or returns unchanged when stock is insufficient", () => {
    const inv = consumeStock(initialInventory, "suon-heo", 50);
    // Cannot consume 50 when only 10 available
    expect(inv.items["suon-heo"]).toBe(10);
  });

  it("advances freshness over days and spoils expired stock", () => {
    // Sườn heo has shelf life 3 days
    let inv = advanceFreshness(initialInventory, 2); // Day 2
    expect(inv.batches[0]?.freshness).toBe("okay");

    inv = advanceFreshness(inv, 3); // Day 3
    expect(inv.batches[0]?.freshness).toBe("use-soon");

    inv = advanceFreshness(inv, 5); // Day 5 -> Expired!
    expect(inv.batches[0]?.freshness).toBe("spoiled");
    // Spoiled stock removed from usable items count without going below 0
    expect(inv.items["suon-heo"]).toBe(0);
  });
});
