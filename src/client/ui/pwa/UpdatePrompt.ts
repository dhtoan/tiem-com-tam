export class UpdatePrompt {
  private element: HTMLElement;
  private onApply: () => void;
  private onDismiss?: () => void;

  constructor(onApply: () => void, onDismiss?: () => void) {
    this.onApply = onApply;
    this.onDismiss = onDismiss;
    this.element = this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public dismiss(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.onDismiss?.();
  }

  private render(): HTMLElement {
    const root = document.createElement('div');
    root.className = 'pwa-update-prompt';
    root.setAttribute('data-testid', 'pwa-update-prompt');
    root.innerHTML = `
      <div class="update-prompt-content">
        <span class="update-icon">⚡</span>
        <div class="update-text">
          <strong>Đã có bản cập nhật mới!</strong>
          <p>Tải lại để trải nghiệm các tính năng và sửa lỗi mới nhất.</p>
        </div>
      </div>
      <div class="update-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="defer">Để sau</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="apply">Cập nhật ngay</button>
      </div>
    `;

    root.querySelector('[data-action="defer"]')?.addEventListener('click', () => {
      this.dismiss();
    });

    root.querySelector('[data-action="apply"]')?.addEventListener('click', () => {
      this.onApply();
      this.dismiss();
    });

    return root;
  }
}
