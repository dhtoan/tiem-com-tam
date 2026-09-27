import type {
  DetectionContext,
  TheftIncident,
  TheftOutcome,
  TheftStage,
  TheftTargetType,
} from "../../../shared/types/incidents";
import { createSeededRandom } from "../../../shared/random/seededRandom";

const STAGE_ORDER: TheftStage[] = ["appear", "observe", "target", "attempt", "escape"];

export function createTheftIncident(params: {
  id: string;
  thiefId: string;
  targetType: TheftTargetType;
  targetAmount: number;
  stageDurationMs?: number;
}): TheftIncident {
  return {
    id: params.id,
    thiefId: params.thiefId,
    targetType: params.targetType,
    targetAmount: params.targetAmount,
    stage: "appear",
    stageElapsedMs: 0,
    stageDurationMs: params.stageDurationMs ?? 3000,
    isDetected: false,
    stolenAmount: 0,
  };
}

export function calculateDetectionChance(
  context: DetectionContext,
  stage: TheftStage
): number {
  if (stage === "resolved") return 1.0;

  const baseChanceByStage: Record<TheftStage, number> = {
    appear: 0.05,
    observe: 0.12,
    target: 0.22,
    attempt: 0.35,
    escape: 0.45,
    resolved: 1.0,
  };

  let chance = baseChanceByStage[stage] ?? 0.1;

  if (context.jdAssignedRole === "camera-awareness") {
    chance += 0.22;
  } else if (context.jdAssignedRole === "cashier") {
    chance += 0.08;
  }

  if (context.guardDetection && context.guardDetection > 0) {
    chance += (context.guardDetection / 100) * 0.25;
  }

  if (context.cameraLevel && context.cameraLevel > 0) {
    chance += Math.min(0.20, context.cameraLevel * 0.07);
  }

  if (context.hasLighting) {
    chance += 0.08;
  }

  if (context.neighborhoodTrust && context.neighborhoodTrust > 0) {
    chance += (context.neighborhoodTrust / 100) * 0.12;
  }

  // Clamped: Security never eliminates all risk (max 0.95, min 0.05)
  return Math.max(0.05, Math.min(0.95, chance));
}

export function resolveTheftIncident(
  incident: TheftIncident,
  outcome: TheftOutcome
): TheftIncident {
  return {
    ...incident,
    stage: "resolved",
    isDetected: true,
    stolenAmount: 0,
    outcome,
  };
}

export function advanceTheftIncident(
  incident: TheftIncident,
  context: DetectionContext,
  dtMs: number
): TheftIncident {
  if (incident.stage === "resolved" || incident.stage === "escape") {
    return incident;
  }

  const updated: TheftIncident = { ...incident };
  updated.stageElapsedMs += dtMs;

  // Check detection if not yet detected
  if (!updated.isDetected) {
    const rng = createSeededRandom(
      `${context.seed}::theft-detect::${incident.id}::${incident.stage}`
    );
    const chance = calculateDetectionChance(context, incident.stage);
    if (rng.next() < chance) {
      updated.isDetected = true;
      updated.detectedAtStage = incident.stage;
    }
  }

  // Stage transition if stage elapsed
  if (updated.stageElapsedMs >= updated.stageDurationMs) {
    const currentIndex = STAGE_ORDER.indexOf(updated.stage);
    if (currentIndex >= 0 && currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1]!;
      updated.stage = nextStage;
      updated.stageElapsedMs = 0;

      if (nextStage === "escape") {
        // Escaped: loot stolen
        updated.stolenAmount = updated.targetAmount;
        updated.outcome = "escaped_with_loot";
      }
    }
  }

  return updated;
}
