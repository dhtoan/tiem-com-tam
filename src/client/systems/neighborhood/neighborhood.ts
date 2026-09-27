import type { GameState, NeighborhoodState } from "../../../shared/types/game-state";
import type { ResolvedIncident } from "../../../shared/types/incidents";
import type { FollowUpEvent, NeighborhoodBenefits } from "../../../shared/types/neighborhood";
import { COMMUNITY_OFFICERS } from "../../data/neighborhoodEvents";

export function adjustNeighborhoodTrust(value: number, delta: number): number {
  return Math.max(0, Math.min(100, Math.round(value + delta)));
}

export function getNeighborhoodBenefits(state: NeighborhoodState): NeighborhoodBenefits {
  const trust = state.neighborhoodTrust;
  return {
    earlyWarningUnlocked: trust >= 60,
    repeatTrafficBonus: Number((Math.min(0.20, (trust / 100) * 0.20)).toFixed(2)),
    communityAssistanceUnlocked: trust >= 75,
    discountMultiplier: trust >= 80 ? 0.95 : 1.0,
  };
}

export function createIncidentFollowUp(
  incident: ResolvedIncident,
  state: GameState
): FollowUpEvent | null {
  if (incident.type === "theft") {
    if (incident.evidenceCaptured) {
      const officer = COMMUNITY_OFFICERS.minh!;
      return {
        id: `follow-up-${incident.id}`,
        sourceIncidentId: incident.id,
        title: "Công an khu vực trao trả tang vật",
        description:
          "Nhờ trích xuất hình ảnh camera rõ nét, đồng chí Minh đã nhanh chóng xác minh và thu hồi đầy đủ tài sản bị mất cho tiệm.",
        targetDay: state.campaign.day + 1,
        officerName: officer.name,
        hasEvidence: true,
        trustDelta: 10,
        cashRewardOrRecovery: incident.cashLoss,
      };
    }

    if (state.neighborhood.neighborhoodTrust >= 50) {
      const officer = COMMUNITY_OFFICERS.bacBa!;
      return {
        id: `follow-up-${incident.id}`,
        sourceIncidentId: incident.id,
        title: "Bà con khu phố động viên",
        description:
          "Dù không có camera ghi lại hình ảnh, Bác Ba tổ trưởng và bà con hàng xóm vẫn ghé qua thăm hỏi, chia sẻ và cùng nhắc nhau tuần tra.",
        targetDay: state.campaign.day + 1,
        officerName: officer.name,
        hasEvidence: false,
        trustDelta: 2,
        cashRewardOrRecovery: 0,
      };
    }
  }

  return null;
}
