export interface NeighborhoodBenefits {
  earlyWarningUnlocked: boolean;
  repeatTrafficBonus: number;
  communityAssistanceUnlocked: boolean;
  discountMultiplier: number;
}

export interface FollowUpEvent {
  id: string;
  sourceIncidentId: string;
  title: string;
  description: string;
  targetDay: number;
  officerName: string;
  hasEvidence: boolean;
  trustDelta: number;
  cashRewardOrRecovery: number;
}
