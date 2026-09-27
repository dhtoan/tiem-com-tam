import type { GameState } from "../../../shared/types/game-state";

export interface MorningBriefOptions {
  onStartDay: () => void;
}

export function createMorningBriefElement(
  state: GameState,
  options: MorningBriefOptions
): HTMLElement {
  const container = document.createElement("div");
  container.className = "brief-container";

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">BẢN TIN CHỢ SÁNG — NGÀY ${state.campaign.day}</h2>
      <p class="modal-subtitle">Chuẩn bị nguyên liệu và đón lượt khách đầu tiên</p>
    </div>

    <div class="brief-body" style="display:flex; flex-direction:column; gap:12px; font-size:14px;">
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <strong>📈 Tình hình chợ:</strong>
        <p>Giá thịt heo ổn định. Gạo tấm thơm dẻo loại 1 đã nhập về đủ số lượng.</p>
      </div>

      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <strong>🎯 Mục tiêu hôm nay:</strong>
        <p>Phục vụ ít nhất 5 lượt khách ăn cơm tấm sườn nướng, tích luỹ tiền vốn trả nợ kỳ 1.</p>
      </div>

      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <strong>💬 Lời nhắn gia đình:</strong>
        <p><em>Chồng: "Anh đã cho em mượn tiền mở quán, ráng làm ăn đàng hoàng đừng để lỗ vốn đó nha!"</em></p>
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn-primary start-prep-btn">Bắt Đầu Chuẩn Bị & Mở Quán</button>
    </div>
  `;

  const btn = container.querySelector<HTMLButtonElement>(".start-prep-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      options.onStartDay();
    });
  }

  return container;
}
