export type TheftStage =
  | "appear"
  | "observe"
  | "target"
  | "attempt"
  | "escape"
  | "resolved";

export type TheftTargetType = "cash" | "inventory" | "tip_jar";

export type TheftOutcome =
  | "escaped_with_loot"
  | "foiled_by_guard"
  | "scared_off"
  | "deterred_by_presence";

export interface DetectionContext {
  jdAssignedRole?: string;
  guardDetection?: number; // 0-100
  cameraLevel?: number; // 0-3
  hasLighting?: boolean;
  neighborhoodTrust?: number; // 0-100
  seed: string | number;
}

export interface TheftIncident {
  id: string;
  thiefId: string;
  targetType: TheftTargetType;
  targetAmount: number;
  stage: TheftStage;
  stageElapsedMs: number;
  stageDurationMs: number;
  isDetected: boolean;
  detectedAtStage?: TheftStage;
  stolenAmount: number;
  outcome?: TheftOutcome;
}

export interface IncidentAction {
  id: string;
  label: string;
  description: string;
  requiredRole?: string;
  requiredUpgrade?: string;
  requiresGuard?: boolean;
  requiresCameraLevel?: number;
  isDanger?: boolean; // JD must NEVER do physical danger
}

export interface ResolvedIncident {
  id: string;
  type: "theft" | "disturbance" | "inspection" | "community";
  resolvedAt: number;
  success: boolean;
  cashLoss: number;
  evidenceCaptured: boolean;
  notes: string;
}
