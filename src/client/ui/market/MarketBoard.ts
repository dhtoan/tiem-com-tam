import type { MarketSnapshot } from "../../../shared/types/market";
import type { InventoryState } from "../../../shared/types/game-state";

export interface MarketBoardOptions {
  market: MarketSnapshot;
  inventory: InventoryState;
  shopCash: number;
  onBuyIngredient: (ingredientId: string, quantity: number, unitCost: number) => void;
  onClose: () => void;
}

export function createMarketBoardElement(options: MarketBoardOptions): HTMLElement {
  const container = document.createElement("div");
  container.className = "market-board-container";

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">🏪 BẢNG GIÁ CHỢ SÁNG — NGÀY ${options.market.day}</h2>
      <p class="modal-subtitle">Tiền mặt hiện có: <strong style="color:#27ae60;">${options.shopCash.toLocaleString("vi-VN")}đ</strong></p>
    </div>

    <div style="margin: 12px 0; background:#f4ece1; padding:10px; border-radius:8px; border:1px solid #d4a373; font-size:13px;">
      ℹ️ ${options.market.dailyBriefSummary}
    </div>

    <div class="market-items-list" style="display:flex; flex-direction:column; gap:8px; max-height:360px; overflow-y:auto;">
      ${Object.values(options.market.items)
        .map((item) => {
          const inStock = options.inventory.items[item.ingredientId] ?? 0;
          const trendIcon = item.trend === "up" ? "🔺 Tăng" : item.trend === "down" ? "🔻 Giảm" : "➖ Ổn định";
          const trendColor = item.trend === "up" ? "#c0392b" : item.trend === "down" ? "#27ae60" : "#7f5539";

          return `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 14px; border-radius:8px; border:1px solid #deb887;">
            <div>
              <strong style="color:#3e2723;">${item.ingredientId}</strong>
              <div style="font-size:12px; color:#7f5539;">Kho: <strong>${inStock}</strong> | Xu hướng: <span style="color:${trendColor}; font-weight:bold;">${trendIcon}</span></div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:15px; font-weight:bold; color:#7d2e1f;">${item.currentPrice.toLocaleString("vi-VN")}đ</span>
              <button type="button" class="btn-buy" data-id="${item.ingredientId}" data-cost="${item.currentPrice}" style="
                background:#b84b12; color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:bold;
              ">+ Mua 5</button>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>

    <div class="modal-actions" style="margin-top:16px; display:flex; justify-content:flex-end;">
      <button type="button" class="btn-primary close-market-btn">Đóng Bảng Giá</button>
    </div>
  `;

  // Bind buy buttons
  const buyButtons = container.querySelectorAll<HTMLButtonElement>(".btn-buy");
  for (const btn of buyButtons) {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const cost = Number(btn.dataset.cost);
      if (id && cost) {
        options.onBuyIngredient(id, 5, cost);
      }
    });
  }

  // Bind close button
  const closeBtn = container.querySelector<HTMLButtonElement>(".close-market-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      options.onClose();
    });
  }

  return container;
}
