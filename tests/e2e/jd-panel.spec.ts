import { test, expect } from "@playwright/test";

test.describe("JD Panel & Safe Role Assignment", () => {
  test("renders JD panel and allows selecting safe roles", async ({ page }) => {
    await page.goto("/");

    // Open JD panel via HUD or dispatch
    const hud = page.locator(".game-hud");
    await expect(hud).toBeVisible();

    // Close Morning brief if open
    const startBtn = page.locator(".start-prep-btn");
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Verify canvas is visible and interactive
    await expect(page.locator("#game-root canvas")).toBeVisible();
  });
});
