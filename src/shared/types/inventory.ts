import type { InventoryState } from "./game-state";

export type FreshnessStage = "fresh" | "okay" | "use-soon" | "spoiled";

export interface IngredientDefinition {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
  category: "meat" | "rice" | "vegetable" | "condiment" | "topping";
  shelfLifeDays: number;
}

export interface PurchaseStockInput {
  inventory: InventoryState;
  ingredientId: string;
  quantity: number;
  unitCost: number;
  currentDay: number;
}

export interface PurchaseStockResult {
  inventory: InventoryState;
  totalCost: number;
  success: boolean;
}
