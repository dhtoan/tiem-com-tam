import type { GameState } from "../../shared/types/game-state";

export interface SaveEnvelope {
  schemaVersion: number;
  revision: number;
  updatedAt: number;
  state: GameState;
}

export const CURRENT_SCHEMA_VERSION = 1;
export const LOCAL_STORAGE_KEY = "tiem_com_tam_save_v1";
