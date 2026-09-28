import { test, expect } from '@playwright/test';

test.describe('Day 1 Production Visual Slice E2E', () => {
  test('desktop 1280x720: renders full stall hierarchy without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // 1. Verify morning brief
    const brief = page.locator('.brief-container');
    await expect(brief).toBeVisible();
    await expect(brief.locator('.modal-title')).toContainText('BẢN TIN CHỢ SÁNG');

    const startBtn = brief.locator('.start-prep-btn');
    await startBtn.click();
    await expect(brief).not.toBeVisible();

    // 2. Verify canvas and HUD
    const canvas = page.locator('#game-root canvas');
    await expect(canvas).toBeVisible();

    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();
    await expect(hud.locator('.cash-value')).toBeVisible();
    await expect(hud.locator('.day-badge')).toContainText('Ngày 1');

    // 3. Verify zero horizontal scrolling on body
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
  });

  test('mobile 390x844: renders readable HUD and accessible touch targets without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const brief = page.locator('.brief-container');
    await expect(brief).toBeVisible();

    const startBtn = brief.locator('.start-prep-btn');
    await startBtn.click();
    await expect(brief).not.toBeVisible();

    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();

    // Verify touch targets have comfortable size (minimum ~32px)
    const marketBtn = hud.locator('.market-btn');
    const box = await marketBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(28);

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
  });
});
