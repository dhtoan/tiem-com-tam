import { test, expect } from "@playwright/test";

test.describe("Day 1 Vertical Slice Service Loop", () => {
  test("starts Day 1, displays Morning Brief, and opens service", async ({ page }) => {
    await page.goto("/");

    // 1. Verify app and HUD loaded
    await expect(page.locator("#app")).toBeVisible();
    await expect(page.locator(".game-hud")).toBeVisible();
    await expect(page.locator(".day-badge")).toContainText("Ngày 1");

    // 2. Verify Morning Brief overlay
    const brief = page.locator(".brief-container");
    await expect(brief).toBeVisible();
    await expect(brief.locator(".modal-title")).toContainText("BẢN TIN CHỢ SÁNG");

    // 3. Click start button to begin prep & service
    const startBtn = brief.locator(".start-prep-btn");
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // 4. Verify Morning Brief closed and canvas is active
    await expect(brief).not.toBeVisible();
    await expect(page.locator("#game-root canvas")).toBeVisible();
  });
});
