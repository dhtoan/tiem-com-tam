import type { GameState } from "../../shared/types/game-state";
import type { EndingId } from "../../shared/types/endings";
import { ENDING_THRESHOLDS } from "../data/endings";

export function resolveEnding(state: GameState): EndingId {
  // 1. Perfect Ending (Top Priority)
  const perfectT = ENDING_THRESHOLDS.perfect;
  const isPerfect =
    state.debt.remainingDebt <= perfectT.maxRemainingDebt &&
    state.reputation.rating >= perfectT.minReputation &&
    state.neighborhood.neighborhoodTrust >= perfectT.minNeighborhoodTrust &&
    state.books.bookAccuracy >= perfectT.minBookAccuracy &&
    state.family.familyTrust >= perfectT.minFamilyTrust &&
    state.family.husbandConfidence >= perfectT.minHusbandConfidence &&
    state.jd.trustWithJoy >= perfectT.minJdTrust;

  if (isPerfect) {
    return "perfect";
  }

  // 2. Family Hidden Ending
  const familyT = ENDING_THRESHOLDS.family;
  const hasFamilyFlag =
    state.family.husbandHelpsInStall ||
    state.campaign.flags["story_day25_husband_joined"] === true;

  const isFamily =
    state.debt.remainingDebt <= familyT.maxRemainingDebt &&
    state.family.familyTrust >= familyT.minFamilyTrust &&
    state.family.husbandConfidence >= familyT.minHusbandConfidence &&
    state.jd.trustWithJoy >= familyT.minJdTrust &&
    hasFamilyFlag;

  if (isFamily) {
    return "family";
  }

  // 3. JD Hidden Ending
  const jdT = ENDING_THRESHOLDS.jd;
  const hasJdMastery =
    state.jd.level >= 3 || state.campaign.flags["story_day22_jd_mastered"] === true;

  const isJD =
    state.debt.remainingDebt <= jdT.maxRemainingDebt &&
    state.jd.trustWithJoy >= jdT.minJdTrust &&
    state.jd.stamina >= jdT.minJdStamina &&
    state.jd.mood >= jdT.minJdMood &&
    hasJdMastery;

  if (isJD) {
    return "jd";
  }

  // 4. Neighborhood Ending (Can override finance with 90%+ paid)
  const neighT = ENDING_THRESHOLDS.neighborhood;
  const originalDebt = state.debt.originalDebt > 0 ? state.debt.originalDebt : 5_000_000;
  const isNeighborhood =
    state.debt.remainingDebt <= originalDebt * neighT.maxDebtRatio &&
    state.neighborhood.neighborhoodTrust >= neighT.minNeighborhoodTrust &&
    state.reputation.rating >= neighT.minReputation;

  if (isNeighborhood) {
    return "neighborhood";
  }

  // 5. Husband-Finance Ending
  const hfT = ENDING_THRESHOLDS.husbandFinance;
  const isHusbandFinance =
    state.debt.remainingDebt > 0 &&
    state.economy.shopCash >= 0 &&
    state.reputation.rating >= hfT.minReputation;

  if (isHusbandFinance) {
    return "husband-finance";
  }

  // 6. Comeback Ending (Default fallback)
  return "comeback";
}
