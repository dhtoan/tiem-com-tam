import type { EndingDefinition } from "../../../shared/types/endings";
import type { JournalEntry } from "../../../shared/types/journal";

export function createEndingScreenElement(
  ending: EndingDefinition,
  montageEntries: JournalEntry[],
  onContinue: () => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "ending-screen-dialog";
  container.dataset.endingId = ending.id;

  const header = document.createElement("div");
  header.className = "ending-header";

  const badge = document.createElement("div");
  badge.className = "ending-badge";
  badge.textContent = "HỒI KẾT KÈO 30 NGÀY";
  header.appendChild(badge);

  const title = document.createElement("h1");
  title.className = "ending-title";
  title.textContent = ending.title;
  header.appendChild(title);

  const subtitle = document.createElement("h3");
  subtitle.className = "ending-subtitle";
  subtitle.textContent = ending.subtitle;
  header.appendChild(subtitle);

  container.appendChild(header);

  const desc = document.createElement("p");
  desc.className = "ending-desc";
  desc.textContent = ending.description;
  container.appendChild(desc);

  if (montageEntries.length > 0) {
    const montageSection = document.createElement("div");
    montageSection.className = "ending-montage";

    const montageTitle = document.createElement("h4");
    montageTitle.className = "montage-title";
    montageTitle.textContent = "KHOẢNH KHẮC ĐÁNG NHỚ";
    montageSection.appendChild(montageTitle);

    const list = document.createElement("ul");
    list.className = "montage-list";

    montageEntries.slice(0, 5).forEach((entry) => {
      const li = document.createElement("li");
      li.className = "montage-item";
      li.innerHTML = `<strong>Ngày ${entry.day}:</strong> ${entry.title} — <span>${entry.description}</span>`;
      list.appendChild(li);
    });

    montageSection.appendChild(list);
    container.appendChild(montageSection);
  }

  const unlockBox = document.createElement("div");
  unlockBox.className = "ending-unlock-box";
  unlockBox.innerHTML = `<strong>Phần thưởng Chế độ Vô Tận:</strong> ${ending.endlessModifierDescription}`;
  container.appendChild(unlockBox);

  const actions = document.createElement("div");
  actions.className = "ending-actions";

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className = "btn-primary btn-continue-endless";
  continueBtn.textContent = "Tiếp tục vào Chế độ Vô Tận (Day 31)";
  continueBtn.addEventListener("click", () => {
    onContinue();
  });

  actions.appendChild(continueBtn);
  container.appendChild(actions);

  return container;
}
