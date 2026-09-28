import type { DayPhase } from "./core";

export type TimeBehavior = "pause" | "slow" | "realtime";

export type EventCategory =
  | "story"
  | "dynamic"
  | "neighborhood"
  | "family"
  | "market"
  | "incident";

export type EventUrgency = "low" | "medium" | "high" | "critical";

export type MetricOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

export type FlagOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "exists";

export interface MetricCondition {
  type: "metric";
  path: string; // e.g. "economy.shopCash", "neighborhood.neighborhoodTrust"
  operator: MetricOperator;
  value: number | string | boolean;
}

export interface FlagCondition {
  type: "flag";
  key: string;
  operator: FlagOperator;
  value?: boolean | number | string;
}

export interface CapabilityCondition {
  type: "capability";
  capability:
    | "hasActiveGuard"
    | "hasLighting"
    | "hasLock"
    | "cameraLevelGte"
    | "jdRoleEq";
  value?: number | string | boolean;
}

export interface DayRangeCondition {
  type: "dayRange";
  minDay?: number;
  maxDay?: number;
}

export interface PhaseCondition {
  type: "phase";
  phase: DayPhase;
}

export interface CompoundCondition {
  type: "and" | "or" | "not";
  conditions: StateCondition[];
}

export type StateCondition =
  | MetricCondition
  | FlagCondition
  | CapabilityCondition
  | DayRangeCondition
  | PhaseCondition
  | CompoundCondition;

export type Consequence =
  | { type: "cash"; amount: number }
  | { type: "stock"; ingredientId: string; quantity: number }
  | { type: "trust"; delta: number }
  | { type: "reputation"; delta: number }
  | { type: "familyTrust"; delta: number }
  | { type: "husbandConfidence"; delta: number }
  | { type: "jdStamina"; delta: number }
  | { type: "jdMood"; delta: number }
  | { type: "jdXp"; delta: number }
  | { type: "flag"; key: string; value: boolean | number | string }
  | { type: "scheduleFollowUp"; eventId: string; delayDays: number }
  | { type: "unlockUpgrade"; upgradeId: string }
  | { type: "missedInstallment"; count?: number }
  | { type: "husbandHelps"; helps: boolean };

export interface EventChoice {
  id: string;
  label: string;
  description?: string;
  conditions?: StateCondition[];
  consequences: Consequence[];
  leadsToEventId?: string;
}

export interface EventDefinition {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  urgency: EventUrgency;
  timeBehavior: TimeBehavior;
  conditions?: StateCondition[];
  choices: EventChoice[];
  cooldownDays?: number;
  maxPerRun?: number;
  stressImpact?: number;
  weight?: number;
  mutexGroup?: string;
}
