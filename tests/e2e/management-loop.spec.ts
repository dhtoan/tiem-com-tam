import { test, expect } from "@playwright/test";

test.describe("Management Simulation Integration Loop", () => {
  test("opens Market, Debt, JD, and Books panels and preserves state", async ({ page }) => {
    await page.goto("/");

    // 1. Close Morning Brief
    const startBtn = page.locator(".start-prep-btn");
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // 2. Open Market Board
    const marketBtn = page.locator(".market-btn");
    await expect(marketBtn).toBeVisible();
    await marketBtn.click();

    const marketPanel = page.locator(".market-board-container");
    await expect(marketPanel).toBeVisible();
    await expect(marketPanel).toContainText("BẢNG GIÁ CHỢ SÁNG");

    // Close Market Board
    await page.keyboard.press("Escape");
    await expect(marketPanel).not.toBeVisible();

    // 3. Open Debt Panel
    const debtBtn = page.locator(".debt-btn");
    await expect(debtBtn).toBeVisible();
    await debtBtn.click();

    const debtPanel = page.locator(".debt-panel-container");
    await expect(debtPanel).toBeVisible();
    await expect(debtPanel).toContainText("KÈO 30 NGÀY");

    // Close Debt Panel
    await page.keyboard.press("Escape");
    await expect(debtPanel).not.toBeVisible();

    // 4. Open JD Panel
    const jdBtn = page.locator(".jd-btn");
    await expect(jdBtn).toBeVisible();
    await jdBtn.click();

    const jdPanel = page.locator(".jd-panel-container");
    await expect(jdPanel).toBeVisible();
    await expect(jdPanel).toContainText("TRỢ THỦ MÙA HÈ");

    // Close JD Panel
    await page.keyboard.press("Escape");
    await expect(jdPanel).not.toBeVisible();

    // 5. Open Books Panel
    const booksBtn = page.locator(".books-btn");
    await expect(booksBtn).toBeVisible();
    await booksBtn.click();

    const booksPanel = page.locator(".books-panel-container");
    await expect(booksPanel).toBeVisible();
    await expect(booksPanel).toContainText("SỔ SÁCH & DOANH THU");

    // Close Books Panel
    await page.keyboard.press("Escape");
    await expect(booksPanel).not.toBeVisible();
  });
});
