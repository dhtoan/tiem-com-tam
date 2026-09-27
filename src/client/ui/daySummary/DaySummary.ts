import type { GameState } from "../../../shared/types/game-state";

export interface DaySummaryOptions {
  onContinue: () => void;
  dayRevenue: number;
  dayExpenses: number;
  servedCount: number;
}

export function createDaySummaryElement(
  state: GameState,
  options: DaySummaryOptions
): HTMLElement {
  const container = document.createElement("div");
  container.className = "summary-container";

  const profit = options.dayRevenue - options.dayExpenses;

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">TỔNG KẾT NGÀY ${state.campaign.day}</h2>
      <p class="modal-subtitle">Hoàn thành ca bán hôm nay</p>
    </div>

    <div class="summary-body" style="display:flex; flex-direction:column; gap:12px; font-size:14px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
          <div style="color:#7f5539;">Doanh thu ca:</div>
          <div style="font-size:18px; font-weight:bold; color:#27ae60;">+${options.dayRevenue.toLocaleString("vi-VN")}đ</div>
        </div>
        <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
          <div style="color:#7f5539;">Chi phí & Nguyên liệu:</div>
          <div style="font-size:18px; font-weight:bold; color:#c0392b;">-${options.dayExpenses.toLocaleString("vi-VN")}đ</div>
        </div>
      </div>

      <div style="background:#f4ece1; padding:12px; border-radius:8px; border:1px solid #d4a373;">
        <strong>Lợi nhuận ròng hôm nay:</strong>
        <span style="font-size:18px; font-weight:bold; color:${profit >= 0 ? "#27ae60" : "#c0392b"}; margin-left:8px;">
          ${profit >= 0 ? "+" : ""}${profit.toLocaleString("vi-VN")}đ
        </span>
      </div>

      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <strong>👥 Khách hàng phục vụ:</strong> ${options.servedCount} lượt khách
      </div>

      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <strong>👦 JD giúp việc:</strong> +15 XP trợ thủ mùa hè!
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn-primary continue-day-btn">Qua Ngày Mới</button>
    </div>
  `;

  const btn = container.querySelector<HTMLButtonElement>(".continue-day-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      options.onContinue();
    });
  }

  return container;
}
