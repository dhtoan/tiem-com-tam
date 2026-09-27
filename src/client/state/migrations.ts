import { CURRENT_SCHEMA_VERSION, type SaveEnvelope } from "./saveSchema";

export function migrateSave(raw: unknown): SaveEnvelope {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid save data: not an object");
  }

  const envelope = raw as Partial<SaveEnvelope>;
  if (typeof envelope.schemaVersion !== "number") {
    throw new Error("Invalid save data: missing schemaVersion");
  }

  if (envelope.schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(`Unsupported future schema version: ${envelope.schemaVersion}`);
  }

  if (!envelope.state || typeof envelope.state !== "object") {
    throw new Error("Invalid save data: missing state");
  }

  // Schema v1 normalization:
  // If saved mid-service or with transient state, ensure cooking and customer queue are clean
  const state = { ...envelope.state };
  if (state.campaign && state.campaign.phase === "service") {
    // Keep phase service, but clear transient non-persisted grill items
    state.cooking = {
      ...state.cooking,
      grillItems: [],
      plate: {
        rice: false,
        proteins: [],
        toppings: [],
        sides: [],
      },
    };
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    revision: envelope.revision ?? 1,
    updatedAt: envelope.updatedAt ?? Date.now(),
    state,
  };
}
