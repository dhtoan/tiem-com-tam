import type { GameState } from "../../shared/types/game-state";
import { CURRENT_SCHEMA_VERSION, LOCAL_STORAGE_KEY, type SaveEnvelope } from "./saveSchema";
import { migrateSave } from "./migrations";

export function saveLocal(state: GameState, storage?: Storage): SaveEnvelope {
  const store = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!store) {
    throw new Error("No storage available");
  }

  const envelope: SaveEnvelope = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    revision: (state.meta.saveRevision ?? 0) + 1,
    updatedAt: Date.now(),
    state: {
      ...state,
      meta: {
        ...state.meta,
        saveRevision: (state.meta.saveRevision ?? 0) + 1,
        updatedAt: Date.now(),
      },
    },
  };

  store.setItem(LOCAL_STORAGE_KEY, JSON.stringify(envelope));
  return envelope;
}

export function loadLocal(storage?: Storage): GameState | null {
  const store = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!store) return null;

  const raw = store.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateSave(parsed);
    return migrated.state;
  } catch (err) {
    console.error("Failed to load or migrate local save:", err);
    return null;
  }
}

export function clearLocal(storage?: Storage): void {
  const store = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (store) {
    store.removeItem(LOCAL_STORAGE_KEY);
  }
}
