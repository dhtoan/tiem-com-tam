import type { DebtState } from "../../../shared/types/game-state";

export interface DebtPanelOptions {
  debt: DebtState;
  shopCash: number;
  debtReserve: number;
  onTransferToReserve: (amount: number) => void;
  onWithdrawReserve: (amount: number) => void;
  onClose: () => void;
}

export function createDebtPanelElement(options: DebtPanelOptions): HTMLElement {
  const container = document.createElement("div");
  container.className = "debt-panel-container";

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">🏦 KÈO 30 NGÀY — QUẢN LÝ NỢ & QUỸ DỰ PHÒNG</h2>
      <p class="modal-subtitle">Chứng minh tiệm cơm tấm thành công với ông xã</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin: 16px 0;">
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">Tổng nợ ban đầu:</div>
        <div style="font-size:18px; font-weight:bold; color:#7d2e1f;">${options.debt.originalDebt.toLocaleString("vi-VN")}đ</div>
      </div>
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">Còn nợ lại:</div>
        <div style="font-size:18px; font-weight:bold; color:#c0392b;">${options.debt.remainingDebt.toLocaleString("vi-VN")}đ</div>
      </div>
    </div>

    <div style="background:#f4ece1; padding:12px; border-radius:8px; border:1px solid #d4a373; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:14px; color:#6b4226;">Quỹ trả nợ hiện có:</span>
          <div style="font-size:20px; font-weight:bold; color:#27ae60;">${options.debtReserve.toLocaleString("vi-VN")}đ</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn-transfer-500k" style="
            background:#27ae60; color:#fff; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; font-weight:bold; font-size:13px;
          ">+ Gửi 500.000đ</button>
          <button type="button" class="btn-withdraw-500k" style="
            background:#e67e22; color:#fff; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; font-weight:bold; font-size:13px;
          ">- Rút 500.000đ</button>
        </div>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <h4 style="color:#7d2e1f; margin-bottom:8px;">📅 Các mốc trả nợ cam kết:</h4>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${options.debt.milestones
          .map(
            (m) => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 14px; border-radius:8px; border:1px solid ${m.isPaid ? "#27ae60" : "#deb887"};">
            <div>
              <strong>Mốc Ngày ${m.day}</strong>
              <div style="font-size:12px; color:#7f5539;">Mục tiêu: ${m.targetAmount.toLocaleString("vi-VN")}đ</div>
            </div>
            <div>
              <span style="font-weight:bold; color:${m.isPaid ? "#27ae60" : "#c0392b"};">
                ${m.isPaid ? "✅ Đã trả" : "⏳ Chưa tới hạn"}
              </span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887; margin-bottom:16px;">
      <div style="font-size:13px; color:#7f5539;">
        💬 <strong>Niềm tin của chồng:</strong> ${options.debt.husbandConfidence}/100
        <div style="background:#e0d6c9; border-radius:6px; height:8px; margin-top:4px; overflow:hidden;">
          <div style="background:${options.debt.husbandConfidence >= 50 ? "#27ae60" : "#e74c3c"}; width:${options.debt.husbandConfidence}%; height:100%;"></div>
        </div>
      </div>
    </div>

    <div class="modal-actions" style="display:flex; justify-content:flex-end;">
      <button type="button" class="btn-primary close-debt-btn">Đóng Kèo Nợ</button>
    </div>
  `;

  // Bind transfer/withdraw buttons
  const transferBtn = container.querySelector<HTMLButtonElement>(".btn-transfer-500k");
  if (transferBtn) {
    transferBtn.addEventListener("click", () => {
      options.onTransferToReserve(500_000);
    });
  }

  const withdrawBtn = container.querySelector<HTMLButtonElement>(".btn-withdraw-500k");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", () => {
      options.onWithdrawReserve(500_000);
    });
  }

  const closeBtn = container.querySelector<HTMLButtonElement>(".close-debt-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      options.onClose();
    });
  }

  return container;
}
