import type { GameState } from "../../../shared/types/game-state";
import type {
  GuardAttendanceInput,
  GuardAttendanceResult,
  GuardShift,
} from "../../../shared/types/guards";
import { getGuardById } from "../../data/guards";
import { createSeededRandom } from "../../../shared/random/seededRandom";

export function hireGuardForShift(
  state: GameState,
  guardId: string,
  _shift: GuardShift
): GameState {
  const guard = getGuardById(guardId);
  if (!guard) {
    throw new Error(`Guard not found: ${guardId}`);
  }

  if (state.economy.shopCash < guard.shiftCost) {
    throw new Error(
      `Insufficient cash to hire guard ${guard.name}. Needed ${guard.shiftCost}, had ${state.economy.shopCash}.`
    );
  }

  return {
    ...state,
    economy: {
      ...state.economy,
      shopCash: state.economy.shopCash - guard.shiftCost,
      totalExpenses: state.economy.totalExpenses + guard.shiftCost,
    },
    security: {
      ...state.security,
      activeGuardId: guard.id,
    },
  };
}

export function resolveGuardAttendance(
  input: GuardAttendanceInput
): GuardAttendanceResult {
  const guard = getGuardById(input.guardId);
  if (!guard) {
    return {
      attended: false,
      late: false,
      effectiveDetection: 0,
      comfortModifier: 0,
      note: `Guard ${input.guardId} not found in roster`,
    };
  }

  const rng = createSeededRandom(`${input.seed}::guard::${input.day}::${input.shift}::${input.guardId}`);
  const rollAttendance = rng.next();
  const rollPunctuality = rng.next();

  // Reliability threshold: higher reliability -> almost always attends
  // e.g. reliability 85 -> attend chance 95%, reliability 98 -> attend chance 99.8%
  const attendChance = 0.5 + (guard.reliability / 200);
  const attended = rollAttendance < attendChance;

  if (!attended) {
    return {
      attended: false,
      late: false,
      effectiveDetection: 0,
      comfortModifier: 0,
      note: `${guard.name} vắng mặt không lý do hôm nay!`,
    };
  }

  // Punctuality threshold
  const lateChance = Math.max(0.02, (100 - guard.stamina) / 200);
  const late = rollPunctuality < lateChance;

  const effectiveDetection = late
    ? Math.round(guard.detection * 0.75)
    : guard.detection;

  return {
    attended: true,
    late,
    effectiveDetection,
    comfortModifier: guard.comfortModifier,
    note: late
      ? `${guard.name} đến trễ một chút do kẹt xe nhưng đã sẵn sàng làm việc.`
      : `${guard.name} có mặt đúng giờ và đang túc trực nghiêm túc.`,
  };
}
