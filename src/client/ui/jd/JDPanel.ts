import type { JDState, JDRole } from "../../../shared/types/game-state";
import { JD_SAFE_ROLES } from "../../../shared/types/jd";

export interface JDPanelOptions {
  onAssignRole: (role: JDRole) => void;
  onRestJD: () => void;
  onClose: () => void;
}

export function createJDPanelElement(
  state: JDState,
  options: JDPanelOptions
): HTMLElement {
  const container = document.createElement("div");
  container.className = "jd-panel-container";

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">👦 JD — TRỢ THỦ MÙA HÈ (CẤP ${state.level})</h2>
      <p class="modal-subtitle">Giao việc an toàn cho con phụ giúp quán cơm tấm</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin: 16px 0;">
      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">⚡ Thể lực: <strong>${state.stamina}/100</strong></div>
        <div style="background:#e0d6c9; border-radius:6px; height:10px; margin-top:6px; overflow:hidden;">
          <div style="background:${state.stamina > 30 ? "#27ae60" : "#e74c3c"}; width:${state.stamina}%; height:100%;"></div>
        </div>
      </div>

      <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #deb887;">
        <div style="color:#7f5539;">😊 Tâm trạng: <strong>${state.mood}/100</strong></div>
        <div style="background:#e0d6c9; border-radius:6px; height:10px; margin-top:6px; overflow:hidden;">
          <div style="background:#f39c12; width:${state.mood}%; height:100%;"></div>
        </div>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <h4 style="color:#7d2e1f; margin-bottom:8px;">🎯 Phân công công việc hôm nay:</h4>
      <div class="jd-roles-list" style="display:flex; flex-direction:column; gap:8px;">
        ${Object.values(JD_SAFE_ROLES)
          .map(
            (r) => `
          <button type="button" class="btn-role ${state.assignedRole === r.role ? "active" : ""}" data-role="${r.role}" style="
            text-align:left;
            padding:10px 14px;
            border-radius:8px;
            background:${state.assignedRole === r.role ? "#deb887" : "#fff"};
            border:2px solid ${state.assignedRole === r.role ? "#8c5338" : "#e0d6c9"};
            cursor:pointer;
          ">
            <strong style="color:#3e2723;">${r.name} ${state.assignedRole === r.role ? "✓ (Đang làm)" : ""}</strong>
            <p style="font-size:12px; color:#6b4226; margin-top:4px;">${r.description}</p>
          </button>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="modal-actions" style="display:flex; justify-content:space-between; align-items:center;">
      <button type="button" class="btn-rest" style="
        background:#3498db; color:#fff; border:none; border-radius:8px; padding:10px 16px; cursor:pointer; font-weight:bold;
      ">🛌 Cho JD nghỉ ngơi</button>
      <button type="button" class="btn-primary close-jd-btn">Xong</button>
    </div>
  `;

  // Bind role buttons
  const roleButtons = container.querySelectorAll<HTMLButtonElement>(".btn-role");
  for (const btn of roleButtons) {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role as JDRole;
      if (role) {
        options.onAssignRole(role);
      }
    });
  }

  // Bind rest button
  const restBtn = container.querySelector<HTMLButtonElement>(".btn-rest");
  if (restBtn) {
    restBtn.addEventListener("click", () => {
      options.onRestJD();
    });
  }

  // Bind close button
  const closeBtn = container.querySelector<HTMLButtonElement>("close-jd-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      options.onClose();
    });
  }

  return container;
}
