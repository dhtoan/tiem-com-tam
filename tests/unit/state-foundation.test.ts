import { describe, it, expect } from "vitest";
import { createInitialState } from "../../src/client/state/createInitialState";
import { GameStore } from "../../src/client/state/GameStore";
import { createSeededRandom } from "../../src/shared/random/seededRandom";

describe("State Foundation, Seeded RNG, and Store", () => {
  it("creates initial state with exact difficulty parameters", () => {
    const easyState = createInitialState("easy", "seed-easy");
    expect(easyState.campaign.day).toBe(1);
    expect(easyState.campaign.phase).toBe("morning");
    expect(easyState.campaign.difficulty).toBe("easy");
    expect(easyState.meta.runSeed).toBe("seed-easy");
    expect(easyState.economy.shopCash).toBe(1_500_000);
    expect(easyState.debt.originalDebt).toBe(15_000_000);
    expect(easyState.debt.milestones[0]?.targetAmount).toBe(3_000_000);
    expect(easyState.debt.milestones[1]?.targetAmount).toBe(4_500_000);
    expect(easyState.debt.milestones[2]?.targetAmount).toBe(7_500_000);
    expect(easyState.settings.activeOverlayId).toBeUndefined();

    const normalState = createInitialState("normal", "seed-normal");
    expect(normalState.economy.shopCash).toBe(1_200_000);
    expect(normalState.debt.originalDebt).toBe(30_000_000);
    expect(normalState.debt.milestones[0]?.targetAmount).toBe(6_000_000);
    expect(normalState.debt.milestones[1]?.targetAmount).toBe(9_000_000);
    expect(normalState.debt.milestones[2]?.targetAmount).toBe(15_000_000);

    const hardState = createInitialState("hard", "seed-hard");
    expect(hardState.economy.shopCash).toBe(1_000_000);
    expect(hardState.debt.originalDebt).toBe(50_000_000);
    expect(hardState.debt.milestones[0]?.targetAmount).toBe(10_000_000);
    expect(hardState.debt.milestones[1]?.targetAmount).toBe(15_000_000);
    expect(hardState.debt.milestones[2]?.targetAmount).toBe(25_000_000);
  });

  it("produces deterministic random values for identical seeds", () => {
    const rng1 = createSeededRandom("tiem-com-tam-test-seed");
    const rng2 = createSeededRandom("tiem-com-tam-test-seed");

    for (let i = 0; i < 20; i++) {
      expect(rng1.next()).toBe(rng2.next());
      expect(rng1.int(1, 100)).toBe(rng2.int(1, 100));
    }
  });

  it("operates GameStore dispatch, subscribe, and replaceState correctly", () => {
    const initial = createInitialState("normal", "store-test");
    const store = new GameStore(initial);

    let observedCash = 0;
    const unsubscribe = store.subscribe((state) => {
      observedCash = state.economy.shopCash;
    });

    store.dispatch((state) => ({
      ...state,
      economy: {
        ...state.economy,
        shopCash: state.economy.shopCash + 50_000,
      },
    }));

    expect(observedCash).toBe(1_250_000);
    expect(store.getState().economy.shopCash).toBe(1_250_000);

    unsubscribe();
    store.dispatch((state) => ({
      ...state,
      economy: {
        ...state.economy,
        shopCash: 2_000_000,
      },
    }));
    // After unsubscribe, observedCash is not updated
    expect(observedCash).toBe(1_250_000);
    expect(store.getState().economy.shopCash).toBe(2_000_000);
  });
});
