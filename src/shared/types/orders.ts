export interface PlateAssembly {
  rice: boolean;
  proteins: string[];
  proteinCookQualities: Record<string, number>;
  toppings: string[];
  sides: string[];
}

export interface OrderDefinition {
  recipeId: string;
  name: string;
  basePrice: number;
  requiredRice: boolean;
  requiredProteins: string[];
  requiredToppings: string[];
  requiredSides: string[];
}

export interface ServeScore {
  accuracy: number; // 0-100
  cookQuality: number; // 0-100
  speed: number; // 0-100
  presentation: number; // 0-100
  accepted: boolean;
  feedback: string;
}

export interface CustomerTicket {
  ticketId: string;
  customerId: string;
  customerName: string;
  customerArchetype: string;
  order: OrderDefinition;
  patienceRemainingMs: number;
  totalPatienceMs: number;
  state: "waiting" | "served" | "abandoned" | "rejected";
  tip: number;
  paidAmount: number;
}
