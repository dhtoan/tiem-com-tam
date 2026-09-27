export interface OverlayOptions {
  closable?: boolean;
  onClose?: () => void;
  title?: string;
  ariaLabel?: string;
}

interface ActiveOverlay {
  id: string;
  element: HTMLElement;
  options: OverlayOptions;
  previousFocusedElement: HTMLElement | null;
}

export class OverlayManager {
  private container: HTMLElement;
  private current: ActiveOverlay | null = null;
  private keydownHandler: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.current && this.current.options.closable !== false) {
        this.closeTop();
      }
    };
    window.addEventListener("keydown", this.keydownHandler);
  }

  public open(id: string, content: HTMLElement, options: OverlayOptions = {}): void {
    // If an overlay is currently open, close it first to enforce single blocking overlay rule
    if (this.current) {
      this.close(this.current.id);
    }

    const previousFocusedElement = document.activeElement as HTMLElement | null;

    const backdrop = document.createElement("div");
    backdrop.className = "overlay-backdrop";
    backdrop.dataset.overlayId = id;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    if (options.ariaLabel || options.title) {
      backdrop.setAttribute("aria-label", options.ariaLabel || options.title || id);
    }

    const panel = document.createElement("div");
    panel.className = "overlay-panel";

    if (options.closable !== false) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "overlay-close-btn";
      closeBtn.type = "button";
      closeBtn.innerHTML = "&times;";
      closeBtn.setAttribute("aria-label", "Đóng");
      closeBtn.addEventListener("click", () => this.close(id));
      panel.appendChild(closeBtn);
    }

    panel.appendChild(content);
    backdrop.appendChild(panel);
    this.container.appendChild(backdrop);

    this.current = {
      id,
      element: backdrop,
      options,
      previousFocusedElement,
    };

    // Focus first focusable element or panel
    panel.setAttribute("tabindex", "-1");
    panel.focus();
  }

  public close(id: string): void {
    if (!this.current || this.current.id !== id) return;

    const overlay = this.current;
    this.current = null;

    if (overlay.element.parentNode) {
      overlay.element.parentNode.removeChild(overlay.element);
    }

    if (overlay.options.onClose) {
      try {
        overlay.options.onClose();
      } catch (err) {
        console.error("Error in overlay onClose callback:", err);
      }
    }

    if (overlay.previousFocusedElement && typeof overlay.previousFocusedElement.focus === "function") {
      overlay.previousFocusedElement.focus();
    }
  }

  public closeTop(): void {
    if (this.current) {
      this.close(this.current.id);
    }
  }

  public getBlockingCount(): number {
    return this.current ? 1 : 0;
  }

  public getActiveOverlayId(): string | undefined {
    return this.current?.id;
  }

  public destroy(): void {
    window.removeEventListener("keydown", this.keydownHandler);
    if (this.current) {
      this.close(this.current.id);
    }
  }
}
