import type { JDState, JDRole } from "../../../shared/types/game-state";

export function assignJD(state: JDState, role: JDRole): JDState {
  return {
    ...state,
    assignedRole: role,
  };
}

export function awardJDXp(state: JDState, role: JDRole, amount: number): JDState {
  const newXp = state.xp + amount;
  const currentRoleXp = (state.specializationProgress[role] ?? 0) + amount;
  // Level threshold: level 1 = 0-99 XP, level 2 = 100-249 XP, level 3 = 250+ XP
  const level = newXp >= 250 ? 3 : newXp >= 100 ? 2 : 1;

  return {
    ...state,
    xp: newXp,
    level,
    specializationProgress: {
      ...state.specializationProgress,
      [role]: currentRoleXp,
    },
  };
}

export function applyJDWork(state: JDState, effort: number): JDState {
  const newStamina = Math.max(0, Math.min(100, state.stamina - effort));
  let moodPenalty = 0;
  if (newStamina === 0) {
    moodPenalty = 20; // Overwork penalty
  } else if (newStamina < 30) {
    moodPenalty = 10;
  }

  const newMood = Math.max(20, Math.min(100, state.mood - moodPenalty));

  return {
    ...state,
    stamina: newStamina,
    mood: newMood,
  };
}

export function restJD(state: JDState): JDState {
  return {
    ...state,
    stamina: 100,
    mood: 100,
    trustWithJoy: Math.min(100, state.trustWithJoy + 5),
  };
}
