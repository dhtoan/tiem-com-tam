import type { GameStore } from "../../state/GameStore";
import type { GameState } from "../../../shared/types/game-state";

export class Hud {
  private element: HTMLElement;
  private store: GameStore;
  private unsubscribe: () => void;

  constructor(parent: HTMLElement, store: GameStore, onOpenSettings?: () => void) {
    this.store = store;
    this.element = document.createElement("header");
    this.element.className = "game-hud";
    this.element.setAttribute("aria-label", "Thông tin quán");

    parent.appendChild(this.element);
    this.render(this.store.getState(), onOpenSettings);

    this.unsubscribe = this.store.subscribe((state) => {
      this.update(state);
    });
  }

  private render(state: GameState, onOpenSettings?: () => void): void {
    this.element.innerHTML = `
      <div class="hud-group left">
        <div class="hud-badge day-badge">
          <span>📅 Ngày ${state.campaign.day}</span>
          <span style="opacity:0.7">| ${state.campaign.phase.toUpperCase()}</span>
        </div>
      </div>
      <div class="hud-group right">
        <div class="hud-badge cash" aria-label="Tiền mặt">
          <span>💵</span>
          <span class="cash-value">${state.economy.shopCash.toLocaleString("vi-VN")}đ</span>
        </div>
        <div class="hud-badge debt" aria-label="Quỹ trả nợ">
          <span>🏦</span>
          <span class="reserve-value">${state.economy.debtReserve.toLocaleString("vi-VN")}đ</span>
        </div>
        <div class="hud-badge rep" aria-label="Đánh giá quán">
          <span>⭐</span>
          <span class="rep-value">${state.reputation.rating.toFixed(1)}</span>
        </div>
        <button type="button" class="hud-btn settings-btn" aria-label="Cài đặt">⚙️</button>
      </div>
    `;

    const settingsBtn = this.element.querySelector(".settings-btn");
    if (settingsBtn && onOpenSettings) {
      settingsBtn.addEventListener("click", onOpenSettings);
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
