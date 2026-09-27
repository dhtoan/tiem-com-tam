import "./styles/app.css";
import "./styles/ui.css";
import { createGame } from "./game/Game";
import type Phaser from "phaser";
import { StallScene } from "./game/scenes/StallScene";
import type { StationId } from "../shared/types/core";
import { GameStore } from "./state/GameStore";
import { createInitialState } from "./state/createInitialState";
import { loadLocal } from "./state/localSave";
import { OverlayManager } from "./ui/OverlayManager";
import { Hud } from "./ui/hud/Hud";
import { DayRunner } from "./campaign/DayRunner";

export interface MountedApp {
  game?: Phaser.Game;
  store: GameStore;
  overlayManager: OverlayManager;
  dayRunner: DayRunner;
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

  // Load existing save or create new state
  const existingSave = loadLocal();
  const initialState = existingSave ?? createInitialState("normal", `run-${Date.now()}`);

  const store = new GameStore(initialState);
  const overlayManager = new OverlayManager(uiRoot);
  const hud = new Hud(uiRoot, store, () => {
    // Settings modal callback
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
  });

  const dayRunner = new DayRunner(store, overlayManager);

  let game: Phaser.Game | undefined;
  if (typeof window !== "undefined" && typeof HTMLCanvasElement !== "undefined") {
    try {
      game = createGame(gameRoot);
      // Wait for StallScene ready to bind events
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

  // Start Day 1 loop
  dayRunner.startDay(store.getState().campaign.day);

  return {
    game,
    store,
    overlayManager,
    dayRunner,
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
