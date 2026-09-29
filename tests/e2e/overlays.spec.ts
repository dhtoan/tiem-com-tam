import { test, expect } from "@playwright/test";

test.describe("Overlay Safety & Pointer Restoration", () => {
  test("opens and closes overlay and preserves canvas interaction", async ({ page }) => {
    await page.goto("/");

    const app = page.locator("#app");
    await expect(app).toBeVisible();

    // Check no blocking overlay initially or brief can be closed
    const overlay = page.locator(".overlay-backdrop");
    if (await overlay.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(overlay).not.toBeVisible();
    }

    // Verify game canvas receives clicks
    const canvas = page.locator("#game-root canvas");
    if (await canvas.isVisible()) {
      await canvas.click({ position: { x: 100, y: 100 } });
    }
  });

  test("sequentially opens and closes Settings, JD, Market, Debt, Books, Dialogue, and Event overlays without blocking", async ({ page }) => {
    await page.goto("/");

    // 0. Dismiss morning brief if open
    const briefBackdrop = page.locator(".overlay-backdrop");
    if (await briefBackdrop.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(briefBackdrop).not.toBeVisible();
    }

    const hud = page.locator(".game-hud");
    await expect(hud).toBeVisible();

    // 1. Settings Overlay
    const settingsBtn = hud.locator(".settings-btn");
    await settingsBtn.click();
    const settingsOverlay = page.locator('.overlay-backdrop[data-overlay-id="settings-modal"]');
    await expect(settingsOverlay).toBeVisible();
    await settingsOverlay.locator(".overlay-close-btn").click();
    await expect(settingsOverlay).not.toBeVisible();

    // 2. JD Panel Overlay
    const jdBtn = hud.locator(".jd-btn");
    await jdBtn.click();
    const jdOverlay = page.locator('.overlay-backdrop[data-overlay-id="jd-panel"]');
    await expect(jdOverlay).toBeVisible();
    await jdOverlay.locator(".overlay-close-btn").click();
    await expect(jdOverlay).not.toBeVisible();

    // 3. Market Overlay
    const marketBtn = hud.locator(".market-btn");
    await marketBtn.click();
    const marketOverlay = page.locator('.overlay-backdrop[data-overlay-id="market-board"]');
    await expect(marketOverlay).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(marketOverlay).not.toBeVisible();

    // 4. Debt Overlay
    const debtBtn = hud.locator(".debt-btn");
    await debtBtn.click();
    const debtOverlay = page.locator('.overlay-backdrop[data-overlay-id="debt-panel"]');
    await expect(debtOverlay).toBeVisible();
    await debtOverlay.locator(".overlay-close-btn").click();
    await expect(debtOverlay).not.toBeVisible();

    // 5. Books Overlay
    const booksBtn = hud.locator(".books-btn");
    await booksBtn.click();
    const booksOverlay = page.locator('.overlay-backdrop[data-overlay-id="books-panel"]');
    await expect(booksOverlay).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(booksOverlay).not.toBeVisible();

    // 6. Dialogue Overlay (simulated via OverlayManager)
    await page.evaluate(() => {
      const win = window as any;
      const el = document.createElement("div");
      el.className = "test-dialogue-content";
      el.textContent = "Hội thoại thử nghiệm";
      win.__overlayManager.open("dialogue", el, { closable: true, title: "Hội thoại" });
    });
    const dialogueOverlay = page.locator('.overlay-backdrop[data-overlay-id="dialogue"]');
    await expect(dialogueOverlay).toBeVisible();
    await dialogueOverlay.locator(".overlay-close-btn").click();
    await expect(dialogueOverlay).not.toBeVisible();

    // 7. Event Overlay (simulated via OverlayManager)
    await page.evaluate(() => {
      const win = window as any;
      const el = document.createElement("div");
      el.className = "test-event-content";
      el.textContent = "Sự kiện kiểm tra";
      win.__overlayManager.open("incident", el, { closable: true, title: "Biến cố" });
    });
    const incidentOverlay = page.locator('.overlay-backdrop[data-overlay-id="incident"]');
    await expect(incidentOverlay).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(incidentOverlay).not.toBeVisible();

    // Final Assertion: Zero lingering overlays in DOM
    const lingeringBackdrops = page.locator(".overlay-backdrop");
    await expect(lingeringBackdrops).toHaveCount(0);
  });
});
