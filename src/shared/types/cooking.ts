export type CookStage =
  | "raw"
  | "cooking-a"
  | "ready-to-flip"
  | "cooking-b"
  | "perfect"
  | "overcooked"
  | "burnt";

export interface GrillItemState {
  id: string;
  proteinId: string;
  stage: CookStage;
  heat: number; // 1.0 = normal
  sideAElapsedMs: number;
  sideBElapsedMs: number;
  flipCount: number;
  quality: number; // 0-100
}
