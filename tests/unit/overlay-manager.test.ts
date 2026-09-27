import { describe, it, expect, beforeEach } from "vitest";
import { OverlayManager } from "../../src/client/ui/OverlayManager";

describe("OverlayManager & Overlay Safety", () => {
  let container: HTMLElement;
  let manager: OverlayManager;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    manager = new OverlayManager(container);
  });

  it("opens an overlay and increments blocking count to 1", () => {
    expect(manager.getBlockingCount()).toBe(0);

    const content = document.createElement("div");
    content.textContent = "Test Overlay Content";

    manager.open("test-dialog", content, { closable: true });
    expect(manager.getBlockingCount()).toBe(1);
    expect(manager.getActiveOverlayId()).toBe("test-dialog");
  });

  it("enforces only ONE blocking overlay at a time", () => {
    const content1 = document.createElement("div");
    content1.textContent = "Dialog 1";
    manager.open("dialog-1", content1, { closable: true });
    expect(manager.getBlockingCount()).toBe(1);

    const content2 = document.createElement("div");
    content2.textContent = "Dialog 2";
    manager.open("dialog-2", content2, { closable: true });

    // The second overlay replaces or closes the previous one, keeping blocking count exactly 1
    expect(manager.getBlockingCount()).toBe(1);
    expect(manager.getActiveOverlayId()).toBe("dialog-2");
  });

  it("closes overlay via closeTop or Escape key and restores blocking count to 0", () => {
    const triggerBtn = document.createElement("button");
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    const content = document.createElement("div");
    manager.open("escape-test", content, { closable: true });
    expect(manager.getBlockingCount()).toBe(1);

    // Simulate Escape key press
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(manager.getBlockingCount()).toBe(0);
    expect(manager.getActiveOverlayId()).toBeUndefined();
    // Focus restored to trigger element
    expect(document.activeElement).toBe(triggerBtn);
  });
});
