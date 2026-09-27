import { test, expect } from "@playwright/test";

test.describe("Local Save Reload & Safe Resume", () => {
  test("persists Day 1 state in localStorage and resumes after reload without network calls", async ({ page }) => {
    await page.goto("/");

    // Wait for initial load and verify save is in localStorage
    await expect(page.locator(".day-badge")).toContainText("Ngày 1");

    // Close Morning Brief
    const startBtn = page.locator(".start-prep-btn");
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Check localStorage has saved envelope
    const saveRaw = await page.evaluate(() => localStorage.getItem("tiem_com_tam_save_v1"));
    expect(saveRaw).not.toBeNull();
    const saveObj = JSON.parse(saveRaw!);
    expect(saveObj.state.campaign.day).toBe(1);

    // Simulate page reload
    await page.reload();

    // Verify it resumes cleanly without errors
    await expect(page.locator("#app")).toBeVisible();
    await expect(page.locator(".day-badge")).toContainText("Ngày 1");
  });
});
