import { test, expect } from '@playwright/test';

const DESKTOP_VIEWPORTS = [
  { width: 1152, height: 648, name: '1152x648' },
  { width: 1280, height: 720, name: '1280x720' },
  { width: 1440, height: 900, name: '1440x900' },
];

const MOBILE_VIEWPORTS = [
  { width: 390, height: 844, name: '390x844' },
  { width: 360, height: 800, name: '360x800' },
];

test.describe('Responsive Viewports Suite', () => {
  for (const vp of DESKTOP_VIEWPORTS) {
    test(`renders full desktop stall hierarchy without horizontal scroll at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Verify desktop stall hierarchy
      await expect(page.locator('#app')).toBeVisible();
      await expect(page.locator('#game-root')).toBeVisible();
      await expect(page.locator('#ui-root')).toBeVisible();
      await expect(page.locator('.game-hud')).toBeVisible();

      // Check no horizontal scroll
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }

  for (const vp of MOBILE_VIEWPORTS) {
    test(`renders mobile view with station navigation and zero horizontal scroll at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      await expect(page.locator('#app')).toBeVisible();
      await expect(page.locator('#ui-root')).toBeVisible();

      // Check no horizontal scroll
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // Verify station navigation bar exists or HUD quick buttons are accessible
      const hud = page.locator('.game-hud');
      await expect(hud).toBeVisible();

      // If morning brief is present, dismiss it to access stall navigation
      const backdrop = page.locator('.overlay-backdrop');
      if (await backdrop.isVisible()) {
        await page.keyboard.press('Escape');
      }

      // Assert mobile station navigation or HUD action buttons can be triggered in 1 action
      const marketBtn = hud.locator('.market-btn');
      await expect(marketBtn).toBeVisible();
      await marketBtn.click();
      await expect(page.locator('.overlay-backdrop')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.overlay-backdrop')).not.toBeVisible();
    });
  }
});
