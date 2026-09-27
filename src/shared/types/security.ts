export interface SecurityCapabilities {
  hasLock: boolean;
  hasLighting: boolean;
  cameraLevel: number;
  hasActiveGuard: boolean;
}

export interface SecurityUpgradeItem {
  id: string;
  name: string;
  cost: number;
  type: "lock" | "lighting" | "camera";
  level?: number;
  scoreBonus: number;
  description: string;
}
