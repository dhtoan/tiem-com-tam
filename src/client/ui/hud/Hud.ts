import type { GameStore } from "../../state/GameStore";
import type { GameState } from "../../../shared/types/game-state";

export interface HudCallbacks {
  onOpenSettings?: () => void;
  onOpenMarket?: () => void;
  onOpenDebt?: () => void;
  onOpenJD?: () => void;
  onOpenBooks?: () => void;
}

export class Hud {
  private element: HTMLElement;
  private store: GameStore;
  private callbacks: HudCallbacks;
  private unsubscribe: () => void;

  constructor(parent: HTMLElement, store: GameStore, callbacks: HudCallbacks = {}) {
    this.store = store;
    this.callbacks = callbacks;
    this.element = document.createElement("header");
    this.element.className = "game-hud";
    this.element.setAttribute("aria-label", "Thông tin quán");

    parent.appendChild(this.element);
    this.render(this.store.getState());

    this.unsubscribe = this.store.subscribe((state) => {
      this.update(state);
    });
  }

  private render(state: GameState): void {
    this.element.innerHTML = `
      <div class="hud-group left">
        <div class="hud-badge day-badge">
          <span>📅 Ngày ${state.campaign.day}</span>
          <span style="opacity:0.7">| ${state.campaign.phase.toUpperCase()}</span>
        </div>
        <button type="button" class="hud-btn market-btn" aria-label="Chợ sáng">🏪 Chợ</button>
        <button type="button" class="hud-btn jd-btn" aria-label="JD Trợ thủ">👦 JD</button>
        <button type="button" class="hud-btn books-btn" aria-label="Sổ sách">📖 Sổ sách</button>
      </div>
      <div class="hud-group right">
        <button type="button" class="hud-badge cash" aria-label="Tiền mặt" style="cursor:pointer; border:none;">
          <span>💵</span>
          <span class="cash-value">${state.economy.shopCash.toLocaleString("vi-VN")}đ</span>
        </button>
        <button type="button" class="hud-badge debt debt-btn" aria-label="Quỹ trả nợ" style="cursor:pointer; border:1px solid #d4a373;">
          <span>🏦</span>
          <span class="reserve-value">${state.economy.debtReserve.toLocaleString("vi-VN")}đ</span>
        </button>
        <div class="hud-badge rep" aria-label="Đánh giá quán">
          <span>⭐</span>
          <span class="rep-value">${state.reputation.rating.toFixed(1)}</span>
        </div>
        <button type="button" class="hud-btn settings-btn" aria-label="Cài đặt">⚙️</button>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const marketBtn = this.element.querySelector(".market-btn");
    if (marketBtn && this.callbacks.onOpenMarket) {
      marketBtn.addEventListener("click", this.callbacks.onOpenMarket);
    }

    const jdBtn = this.element.querySelector(".jd-btn");
    if (jdBtn && this.callbacks.onOpenJD) {
      jdBtn.addEventListener("click", this.callbacks.onOpenJD);
    }

    const booksBtn = this.element.querySelector(".books-btn");
    if (booksBtn && this.callbacks.onOpenBooks) {
      booksBtn.addEventListener("click", this.callbacks.onOpenBooks);
    }

    const debtBtn = this.element.querySelector(".debt-btn");
    if (debtBtn && this.callbacks.onOpenDebt) {
      debtBtn.addEventListener("click", this.callbacks.onOpenDebt);
    }

    const settingsBtn = this.element.querySelector(".settings-btn");
    if (settingsBtn && this.callbacks.onOpenSettings) {
      settingsBtn.addEventListener("click", this.callbacks.onOpenSettings);
    }
  }

  private update(state: GameState): void {
    const dayBadge = this.element.querySelector(".day-badge");
    if (dayBadge) {
      dayBadge.innerHTML = `<span>📅 Ngày ${state.campaign.day}</span> <span style="opacity:0.7">| ${state.campaign.phase.toUpperCase()}</span>`;
    }

    const cashValue = this.element.querySelector(".cash-value");
    if (cashValue) {
      cashValue.textContent = `${state.economy.shopCash.toLocaleString("vi-VN")}đ`;
    }

    const reserveValue = this.element.querySelector(".reserve-value");
    if (reserveValue) {
      reserveValue.textContent = `${state.economy.debtReserve.toLocaleString("vi-VN")}đ`;
    }

    const repValue = this.element.querySelector(".rep-value");
    if (repValue) {
      repValue.textContent = state.reputation.rating.toFixed(1);
    }
  }

  public destroy(): void {
    this.unsubscribe();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
