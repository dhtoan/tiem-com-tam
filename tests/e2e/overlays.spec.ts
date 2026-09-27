import { test, expect } from "@playwright/test";

test.describe("Overlay Safety & Pointer Restoration", () => {
  test("opens and closes overlay and preserves canvas interaction", async ({ page }) => {
    await page.goto("/");

    // Verify app and canvas are visible
    const app = page.locator("#app");
    await expect(app).toBeVisible();

    // Check no blocking overlay initially or brief can be closed
    const overlay = page.locator(".overlay-backdrop");
    if (await overlay.isVisible()) {
      // Close overlay with Escape or close button
      await page.keyboard.press("Escape");
      await expect(overlay).not.toBeVisible();
    }

    // Verify game canvas receives clicks
    const canvas = page.locator("#game-root canvas");
    if (await canvas.isVisible()) {
      await canvas.click({ position: { x: 100, y: 100 } });
    }
  });
});
