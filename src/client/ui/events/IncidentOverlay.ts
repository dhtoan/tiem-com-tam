import type { IncidentAction, IncidentEvent } from "../../../shared/types/incidents";

export function createIncidentOverlay(
  event: IncidentEvent,
  actions: IncidentAction[],
  onSelect: (actionId: string) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "incident-dialog";
  container.dataset.incidentId = event.id;

  const header = document.createElement("div");
  header.className = "incident-header";

  const title = document.createElement("h2");
  title.className = "incident-title";
  title.textContent = event.title;

  const badge = document.createElement("span");
  badge.className = `urgency-badge urgency-${event.urgency}`;
  badge.textContent = `Mức độ: ${event.urgency.toUpperCase()}`;

  header.appendChild(title);
  header.appendChild(badge);
  container.appendChild(header);

  const desc = document.createElement("p");
  desc.className = "incident-desc";
  desc.textContent = event.description;
  container.appendChild(desc);

  const actionsList = document.createElement("div");
  actionsList.className = "incident-actions-list";

  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "incident-action-btn";
    btn.dataset.actionId = action.id;

    const btnLabel = document.createElement("div");
    btnLabel.className = "action-btn-label";
    btnLabel.textContent = action.label;

    const btnDesc = document.createElement("div");
    btnDesc.className = "action-btn-desc";
    btnDesc.textContent = action.description;

    btn.appendChild(btnLabel);
    btn.appendChild(btnDesc);

    btn.addEventListener("click", () => {
      onSelect(action.id);
    });

    actionsList.appendChild(btn);
  });

  container.appendChild(actionsList);

  return container;
}
