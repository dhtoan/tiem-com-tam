import { test, expect } from '@playwright/test';

test.describe('Content & Media Smoke Gate E2E', () => {
  test('exercises full gameplay loop, panels, localization, and zero asset 404s', async ({ page }) => {
    const failedNetworkRequests: string[] = [];
    const consoleErrors: string[] = [];

    page.on('requestfailed', (req) => {
      failedNetworkRequests.push(`${req.url()} (${req.failure()?.errorText})`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // 1. Morning brief dismissal
    const brief = page.locator('.brief-container');
    await expect(brief).toBeVisible();
    await brief.locator('.start-prep-btn').click();
    await expect(brief).not.toBeVisible();

    // 2. HUD presence
    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();
    await expect(hud.locator('.cash-value')).toBeVisible();

    // 3. Open Market panel
    await hud.locator('.market-btn').click();
    const overlayPanel = page.locator('.overlay-panel');
    await expect(overlayPanel).toBeVisible();
    await overlayPanel.locator('.overlay-close-btn').click();
    await expect(overlayPanel).not.toBeVisible();

    // 4. Open Debt panel
    await hud.locator('.debt-btn').click();
    await expect(overlayPanel).toBeVisible();
    await overlayPanel.locator('.overlay-close-btn').click();
    await expect(overlayPanel).not.toBeVisible();

    // 5. Open JD panel
    await hud.locator('.jd-btn').click();
    await expect(overlayPanel).toBeVisible();
    await overlayPanel.locator('.overlay-close-btn').click();
    await expect(overlayPanel).not.toBeVisible();

    // 6. Open Books panel
    await hud.locator('.books-btn').click();
    await expect(overlayPanel).toBeVisible();
    await overlayPanel.locator('.overlay-close-btn').click();
    await expect(overlayPanel).not.toBeVisible();

    // 7. Verify dynamic loading of all remaining lazy bundles
    await page.evaluate(async () => {
      const loader = (window as unknown as {
        __assetLoader: {
          ensureBundle: (b: string) => Promise<void>;
          isBundleLoaded: (b: string) => boolean;
        };
      }).__assetLoader;

      await loader.ensureBundle('dynamic-security');
      await loader.ensureBundle('story-day-range');
      await loader.ensureBundle('endings');
    });

    const allLoaded = await page.evaluate(() => {
      const loader = (window as unknown as {
        __assetLoader: {
          isBundleLoaded: (b: string) => boolean;
        };
      }).__assetLoader;

      return (
        loader.isBundleLoaded('dynamic-security') &&
        loader.isBundleLoaded('story-day-range') &&
        loader.isBundleLoaded('endings')
      );
    });
    expect(allLoaded).toBe(true);

    // 8. Verify English runtime localization
    const enTitle = await page.evaluate(() => {
      const i18n = (window as unknown as {
        __i18n: {
          setLocale: (l: string) => void;
          t: (k: string) => string;
        };
      }).__i18n;

      i18n.setLocale('en');
      return i18n.t('ui.game_title');
    });
    expect(enTitle).toBe('Saigon Broken Rice Stall');

    // 9. Zero asset 404s and clean console
    expect(failedNetworkRequests).toEqual([]);
    expect(consoleErrors.filter((e) => !e.includes('favicon'))).toEqual([]);
  });
});
