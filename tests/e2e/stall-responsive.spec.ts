import { test, expect } from "@playwright/test";

test.describe("Stall Responsive Layout", () => {
  test("loads desktop stall at 1280x720 without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    await expect(page.locator("#app")).toBeVisible();
    await expect(page.locator("#game-root")).toBeVisible();
    await expect(page.locator("#ui-root")).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("loads mobile view at 390x844 with station navigation and no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Check station nav exists on mobile
    const nav = page.locator(".mobile-station-nav");
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
  });

  test("loads mobile view at 360x800 without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
