import type { BooksState } from "../../../shared/types/game-state";

export interface BooksPanelOptions {
  books: BooksState;
  onClose: () => void;
}

export function createBooksPanelElement(options: BooksPanelOptions): HTMLElement {
  const container = document.createElement("div");
  container.className = "books-panel-container";

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">📖 SỔ SÁCH & DOANH THU QUÁN</h2>
      <p class="modal-subtitle">Theo dõi thu chi minh bạch và chính xác</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin: 16px 0;">
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">Số dư thực tế trong két:</div>
        <div style="font-size:18px; font-weight:bold; color:#27ae60;">${options.books.actualBalance.toLocaleString("vi-VN")}đ</div>
      </div>
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">Số dư ghi trên sổ:</div>
        <div style="font-size:18px; font-weight:bold; color:#2980b9;">${options.books.recordedBalance.toLocaleString("vi-VN")}đ</div>
      </div>
    </div>

    <div style="background:#fff; padding:14px; border-radius:8px; border:1px solid #deb887; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#3e2723;">Độ chính xác sổ sách:</strong>
          <p style="font-size:12px; color:#7f5539;">Giảm thiểu sai sót khi có đoàn kiểm tra ghé thăm</p>
        </div>
        <div style="font-size:20px; font-weight:bold; color:${options.books.bookAccuracy >= 90 ? "#27ae60" : "#e67e22"};">
          ${options.books.bookAccuracy}%
        </div>
      </div>
      <div style="background:#e0d6c9; border-radius:6px; height:8px; margin-top:8px; overflow:hidden;">
        <div style="background:${options.books.bookAccuracy >= 90 ? "#27ae60" : "#e67e22"}; width:${options.books.bookAccuracy}%; height:100%;"></div>
      </div>
    </div>

    <div class="modal-actions" style="display:flex; justify-content:flex-end;">
      <button type="button" class="btn-primary close-books-btn">Đóng Sổ Sách</button>
    </div>
  `;

  const closeBtn = container.querySelector<HTMLButtonElement>(".close-books-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      options.onClose();
    });
  }

  return container;
}
