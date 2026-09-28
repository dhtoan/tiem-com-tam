import type { GameState } from "../../shared/types/game-state";
import type {
  FlagOperator,
  MetricOperator,
  StateCondition,
} from "../../shared/types/events";

function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function compareValues(
  actual: unknown,
  operator: MetricOperator | FlagOperator,
  expected: unknown
): boolean {
  switch (operator) {
    case "eq":
      return actual === expected;
    case "neq":
      return actual !== expected;
    case "gt":
      return typeof actual === "number" && typeof expected === "number" && actual > expected;
    case "gte":
      return typeof actual === "number" && typeof expected === "number" && actual >= expected;
    case "lt":
      return typeof actual === "number" && typeof expected === "number" && actual < expected;
    case "lte":
      return typeof actual === "number" && typeof expected === "number" && actual <= expected;
    case "exists":
      return actual !== undefined;
    default:
      return false;
  }
}

export function evaluateCondition(
  condition: StateCondition,
  state: GameState
): boolean {
  switch (condition.type) {
    case "metric": {
      const actual = getNestedValue(state, condition.path);
      return compareValues(actual, condition.operator, condition.value);
    }

    case "flag": {
      const actual = state.campaign.flags[condition.key];
      return compareValues(actual, condition.operator, condition.value);
    }

    case "capability": {
      switch (condition.capability) {
        case "hasActiveGuard":
          return !!state.security?.activeGuardId;
        case "hasLighting":
          return !!state.security?.hasLighting;
        case "hasLock":
          return !!state.security?.hasLock;
        case "cameraLevelGte":
          return (
            typeof condition.value === "number" &&
            (state.security?.cameraLevel ?? 0) >= condition.value
          );
        case "jdRoleEq":
          return state.jd?.assignedRole === condition.value;
        default:
          return false;
      }
    }

    case "dayRange": {
      const day = state.campaign.day;
      if (condition.minDay !== undefined && day < condition.minDay) {
        return false;
      }
      if (condition.maxDay !== undefined && day > condition.maxDay) {
        return false;
      }
      return true;
    }

    case "phase": {
      return state.campaign.phase === condition.phase;
    }

    case "and": {
      return condition.conditions.every((c) => evaluateCondition(c, state));
    }

    case "or": {
      return condition.conditions.some((c) => evaluateCondition(c, state));
    }

    case "not": {
      return !condition.conditions.some((c) => evaluateCondition(c, state));
    }

    default:
      return false;
  }
}
