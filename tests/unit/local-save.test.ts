import { describe, it, expect, beforeEach } from "vitest";
import { saveLocal, loadLocal } from "../../src/client/state/localSave";
import { migrateSave } from "../../src/client/state/migrations";
import { createInitialState } from "../../src/client/state/createInitialState";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

class MockStorage implements Storage {
  private data: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.data).length;
  }
  clear(): void {
    this.data = {};
  }
  getItem(key: string): string | null {
    return this.data[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.data)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.data[key];
  }
  setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}

describe("Versioned Local Save & Migrations", () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it("performs a complete save and load round-trip", () => {
    const original = createInitialState("normal", "round-trip-seed");
    original.economy.shopCash = 1_450_000;

    const envelope = saveLocal(original, mockStorage);
    expect(envelope.schemaVersion).toBe(1);
    expect(envelope.revision).toBe(2);

    const loaded = loadLocal(mockStorage);
    expect(loaded).not.toBeNull();
    expect(loaded?.economy.shopCash).toBe(1_450_000);
    expect(loaded?.meta.runSeed).toBe("round-trip-seed");
  });

  it("safely handles corrupted or invalid JSON in storage", () => {
    mockStorage.setItem("tiem_com_tam_save_v1", "INVALID_JSON_CORRUPTED{{{");
    const loaded = loadLocal(mockStorage);
    expect(loaded).toBeNull();
  });

  it("rejects unsupported future schema version with clear error", () => {
    const futureEnvelope = {
      schemaVersion: 999,
      revision: 1,
      updatedAt: Date.now(),
      state: createInitialState("normal", "future"),
    };

    expect(() => migrateSave(futureEnvelope)).toThrow(/Unsupported future schema version/);
  });

  it("migrates save-v1 fixture successfully", () => {
    const fixturePath = resolve(process.cwd(), "tests/fixtures/save-v1.json");
    const fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));

    const result = migrateSave(fixture);
    expect(result.schemaVersion).toBe(1);
    expect(result.state.campaign.difficulty).toBe("normal");
  });

  it("safely normalizes mid-service save to clean resumable state", () => {
    const midServiceState = createInitialState("normal", "mid-service");
    midServiceState.campaign.phase = "service";
    // Add transient grill item
    midServiceState.cooking.grillItems = [
      {
        id: "transient-1",
        proteinId: "suon-heo",
        stage: "cooking-a",
        heat: 1,
        elapsedMs: 2000,
        flipCount: 0,
        quality: 100,
      },
    ];

    const envelope = {
      schemaVersion: 1,
      revision: 1,
      updatedAt: Date.now(),
      state: midServiceState,
    };

    const migrated = migrateSave(envelope);
    expect(migrated.state.campaign.phase).toBe("service");
    // Transient grill item should be cleared so the game resumes safely
    expect(migrated.state.cooking.grillItems).toHaveLength(0);
  });
});
