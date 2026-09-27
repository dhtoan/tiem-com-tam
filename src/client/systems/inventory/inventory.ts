import type { InventoryState, InventoryBatch } from "../../../shared/types/game-state";
import type { PurchaseStockInput, PurchaseStockResult, FreshnessStage } from "../../../shared/types/inventory";
import { ingredientsCatalog } from "../../data/ingredients";

export function purchaseStock(input: PurchaseStockInput): PurchaseStockResult {
  const currentCount = input.inventory.items[input.ingredientId] ?? 0;
  const newBatch: InventoryBatch = {
    id: `batch-${input.ingredientId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ingredientId: input.ingredientId,
    quantity: input.quantity,
    dayPurchased: input.currentDay,
    freshness: "fresh",
  };

  const nextInventory: InventoryState = {
    ...input.inventory,
    items: {
      ...input.inventory.items,
      [input.ingredientId]: currentCount + input.quantity,
    },
    batches: [...input.inventory.batches, newBatch],
  };

  return {
    inventory: nextInventory,
    totalCost: input.quantity * input.unitCost,
    success: true,
  };
}

export function consumeStock(
  state: InventoryState,
  ingredientId: string,
  quantity: number
): InventoryState {
  const currentCount = state.items[ingredientId] ?? 0;
  if (currentCount < quantity) {
    // Insufficient stock, reject without mutating
    return state;
  }

  let remainingToConsume = quantity;
  const nextBatches: InventoryBatch[] = [];

  for (const batch of state.batches) {
    if (batch.ingredientId === ingredientId && remainingToConsume > 0) {
      if (batch.quantity <= remainingToConsume) {
        remainingToConsume -= batch.quantity;
        // Batch completely consumed, don't keep in active list
      } else {
        nextBatches.push({
          ...batch,
          quantity: batch.quantity - remainingToConsume,
        });
        remainingToConsume = 0;
      }
    } else {
      nextBatches.push(batch);
    }
  }

  return {
    ...state,
    items: {
      ...state.items,
      [ingredientId]: currentCount - quantity,
    },
    batches: nextBatches,
  };
}

export function advanceFreshness(
  state: InventoryState,
  currentDay: number
): InventoryState {
  const updatedBatches: InventoryBatch[] = [];
  const activeItemsCount: Record<string, number> = {};

  for (const key of Object.keys(state.items)) {
    activeItemsCount[key] = 0;
  }

  for (const batch of state.batches) {
    const def = ingredientsCatalog[batch.ingredientId];
    const shelfLife = def?.shelfLifeDays ?? 3;
    const age = currentDay - batch.dayPurchased;
    const ratio = age / shelfLife;

    let freshness: FreshnessStage = "fresh";
    if (ratio > 1.0) {
      freshness = "spoiled";
    } else if (ratio > 0.6) {
      freshness = "use-soon";
    } else if (ratio > 0.3) {
      freshness = "okay";
    }

    if (freshness !== "spoiled") {
      activeItemsCount[batch.ingredientId] =
        (activeItemsCount[batch.ingredientId] ?? 0) + batch.quantity;
    }

    updatedBatches.push({
      ...batch,
      freshness,
    });
  }

  return {
    items: activeItemsCount,
    batches: updatedBatches,
  };
}
