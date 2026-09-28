import "./styles/app.css";
import "./styles/ui.css";
import { createGame } from "./game/Game";
import type Phaser from "phaser";
import { StallScene } from "./game/scenes/StallScene";
import type { StationId } from "../shared/types/core";
import { GameStore } from "./state/GameStore";
import { createInitialState } from "./state/createInitialState";
import { loadLocal, saveLocal } from "./state/localSave";
import { OverlayManager } from "./ui/OverlayManager";
import { Hud } from "./ui/hud/Hud";
import { DayRunner } from "./campaign/DayRunner";
import { createMarketBoardElement } from "./ui/market/MarketBoard";
import { createDebtPanelElement } from "./ui/debt/DebtPanel";
import { createJDPanelElement } from "./ui/jd/JDPanel";
import { createBooksPanelElement } from "./ui/books/BooksPanel";
import { generateMarket } from "./systems/market/market";
import { purchaseStock } from "./systems/inventory/inventory";
import { transferToDebtReserve, withdrawDebtReserve } from "./systems/debt/debt";
import { assignJD, restJD } from "./systems/jd/jd";

import { GameClock } from "./game/time/GameClock";
import { IncidentController } from "./systems/incidents/IncidentController";
import { SaveConflictDialog, type SaveConflictDialogOptions } from "./ui/account/SaveConflictDialog";
import { createOfflineIndicator } from "./api/networkStatus";
import { UpdatePrompt } from "./ui/pwa/UpdatePrompt";
import { registerServiceWorker } from "./pwa/register";
import * as authApi from "./api/auth";
import * as saveApi from "./api/save";
import * as dailyApi from "./api/daily";
import * as leaderboardsApi from "./api/leaderboards";
import * as i18n from "./i18n/i18n";

export interface MountedApp {
  game?: Phaser.Game;
  store: GameStore;
  overlayManager: OverlayManager;
  dayRunner: DayRunner;
  gameClock: GameClock;
  incidentController: IncidentController;
  destroy: () => void;
}

export function mountApp(root?: HTMLElement): MountedApp {
  const targetRoot = root ?? document.getElementById("app");
  if (!targetRoot) {
    throw new Error("Root element #app not found");
  }

  let gameRoot = targetRoot.querySelector<HTMLElement>("#game-root");
  let uiRoot = targetRoot.querySelector<HTMLElement>("#ui-root");

  if (!gameRoot) {
    gameRoot = document.createElement("div");
    gameRoot.id = "game-root";
    targetRoot.appendChild(gameRoot);
  }

  if (!uiRoot) {
    uiRoot = document.createElement("div");
    uiRoot.id = "ui-root";
    targetRoot.appendChild(uiRoot);
  }

  const offlineBadge = createOfflineIndicator();
  uiRoot.appendChild(offlineBadge);

  const existingSave = loadLocal();
  const initialState = existingSave ?? createInitialState("normal", `run-${Date.now()}`);

  const store = new GameStore(initialState);
  store.subscribe((state) => {
    saveLocal(state);
  });
  const overlayManager = new OverlayManager(uiRoot);
  const gameClock = new GameClock();
  const incidentController = new IncidentController(gameClock, overlayManager);

  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__incidentController = incidentController;
    (window as unknown as Record<string, unknown>).__store = store;
    (window as unknown as Record<string, unknown>).__gameClock = gameClock;
    (window as unknown as Record<string, unknown>).__overlayManager = overlayManager;
    (window as unknown as Record<string, unknown>).__showSaveConflictDialog = (options: SaveConflictDialogOptions) => {
      const dialog = new SaveConflictDialog(options);
      overlayManager.open("save-conflict", dialog.getElement(), {
        closable: false,
        title: "Xung đột bản lưu đám mây",
      });
      return dialog;
    };
    (window as unknown as Record<string, unknown>).__showUpdatePrompt = (onApply: () => void) => {
      const prompt = new UpdatePrompt(onApply);
      uiRoot.appendChild(prompt.getElement());
      return prompt;
    };
    (window as unknown as Record<string, unknown>).__api = {
      auth: authApi,
      save: saveApi,
      daily: dailyApi,
      leaderboards: leaderboardsApi,
    };
    (window as unknown as Record<string, unknown>).__i18n = i18n;
  }

  registerServiceWorker({
    onUpdateAvailable: (applyUpdate) => {
      const prompt = new UpdatePrompt(applyUpdate);
      uiRoot.appendChild(prompt.getElement());
    },
  });

  const openMarket = () => {
    const state = store.getState();
    const market = generateMarket({
      day: state.campaign.day,
      difficulty: state.campaign.difficulty,
      runSeed: state.meta.runSeed,
    });

    const marketEl = createMarketBoardElement({
      market,
      inventory: state.inventory,
      shopCash: state.economy.shopCash,
      onBuyIngredient: (ingredientId, quantity, unitCost) => {
        const total = quantity * unitCost;
        if (store.getState().economy.shopCash >= total) {
          const res = purchaseStock({
            inventory: store.getState().inventory,
            ingredientId,
            quantity,
            unitCost,
            currentDay: store.getState().campaign.day,
          });

          store.dispatch((s) => ({
            ...s,
            economy: {
              ...s.economy,
              shopCash: s.economy.shopCash - total,
              totalExpenses: s.economy.totalExpenses + total,
            },
            inventory: res.inventory,
          }));

          // Re-render market board with updated cash/inventory
          openMarket();
        }
      },
      onClose: () => {
        overlayManager.close("market-board");
      },
    });

    overlayManager.open("market-board", marketEl, {
      closable: true,
      title: "Chợ Sáng",
    });
  };

  const openDebt = () => {
    const state = store.getState();
    const debtEl = createDebtPanelElement({
      debt: state.debt,
      shopCash: state.economy.shopCash,
      debtReserve: state.economy.debtReserve,
      onTransferToReserve: (amount) => {
        store.dispatch((s) => transferToDebtReserve(s, amount));
        openDebt();
      },
      onWithdrawReserve: (amount) => {
        store.dispatch((s) => withdrawDebtReserve(s, amount));
        openDebt();
      },
      onClose: () => {
        overlayManager.close("debt-panel");
      },
    });

    overlayManager.open("debt-panel", debtEl, {
      closable: true,
      title: "Kèo 30 Ngày",
    });
  };

  const openJD = () => {
    const state = store.getState();
    const jdEl = createJDPanelElement(state.jd, {
      onAssignRole: (role) => {
        store.dispatch((s) => ({
          ...s,
          jd: assignJD(s.jd, role),
        }));
        openJD();
      },
      onRestJD: () => {
        store.dispatch((s) => ({
          ...s,
          jd: restJD(s.jd),
        }));
        openJD();
      },
      onClose: () => {
        overlayManager.close("jd-panel");
      },
    });

    overlayManager.open("jd-panel", jdEl, {
      closable: true,
      title: "JD Trợ Thủ",
    });
  };

  const openBooks = () => {
    const state = store.getState();
    const booksEl = createBooksPanelElement({
      books: state.books,
      onClose: () => {
        overlayManager.close("books-panel");
      },
    });

    overlayManager.open("books-panel", booksEl, {
      closable: true,
      title: "Sổ Sách",
    });
  };

  const openSettings = () => {
    const settingsDiv = document.createElement("div");
    settingsDiv.innerHTML = `
      <h3 style="color:#7d2e1f; margin-bottom:12px;">CÀI ĐẶT TRÒ CHƠI</h3>
      <p style="margin-bottom:8px;">Chế độ: <strong>Cơm Tấm Sài Gòn — Kèo 30 Ngày</strong></p>
      <p style="margin-bottom:8px;">Độ khó: <strong>${store.getState().campaign.difficulty.toUpperCase()}</strong></p>
      <p style="color:#7f5539;">Phiên bản: 1.0.0 (Local First)</p>
    `;
    overlayManager.open("settings-modal", settingsDiv, {
      closable: true,
      title: "Cài đặt",
    });
  };

  const hud = new Hud(uiRoot, store, {
    onOpenMarket: openMarket,
    onOpenDebt: openDebt,
    onOpenJD: openJD,
    onOpenBooks: openBooks,
    onOpenSettings: openSettings,
  });

  const dayRunner = new DayRunner(store, overlayManager);

  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__dayRunner = dayRunner;
    (window as unknown as Record<string, unknown>).__store = store;
  }

  let game: Phaser.Game | undefined;
  if (typeof window !== "undefined" && typeof HTMLCanvasElement !== "undefined") {
    try {
      game = createGame(gameRoot);
      game.events.once("ready", () => {
        const stallScene = game?.scene.getScene("StallScene") as StallScene;
        if (stallScene) {
          stallScene.events.on("customer:paid", (amount: number) => {
            dayRunner.recordSale(amount);
          });
          stallScene.events.on("service:completed", () => {
            dayRunner.endService();
          });
        }
      });
    } catch (e) {
      console.warn("Phaser initialization skipped or failed in test/headless context:", e);
    }
  }

  // Render Mobile Station Navigation in uiRoot
  const navContainer = document.createElement("nav");
  navContainer.className = "mobile-station-nav";
  navContainer.setAttribute("aria-label", "Điều hướng khu vực tiệm");

  const stations: Array<{ id: StationId; label: string }> = [
    { id: "grill", label: "Lò nướng" },
    { id: "display", label: "Tủ kính" },
    { id: "plating", label: "Ra món" },
    { id: "customers", label: "Khách" },
  ];

  for (const st of stations) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.station = st.id;
    btn.textContent = st.label;
    btn.addEventListener("click", () => {
      navContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (game) {
        const stallScene = game.scene.getScene("StallScene") as StallScene;
        if (stallScene?.focusStation) {
          stallScene.focusStation(st.id);
        }
      }
    });
    navContainer.appendChild(btn);
  }

  uiRoot.appendChild(navContainer);

  // Start Day loop
  dayRunner.startDay(store.getState().campaign.day);

  return {
    game,
    store,
    overlayManager,
    dayRunner,
    gameClock,
    incidentController,
    destroy: () => {
      hud.destroy();
      overlayManager.destroy();
      if (game) {
        game.destroy(true);
      }
      targetRoot.innerHTML = "";
    },
  };
}

if (typeof window !== "undefined" && !import.meta.env?.SSR) {
  window.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("app");
    if (root) {
      mountApp(root);
    }
  });
}
