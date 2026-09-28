import { test, expect } from '@playwright/test';

test.describe('PWA & Service Worker Lifecycle', () => {
  test('manifest is present, valid JSON, and contains standalone PWA metadata', async ({ page }) => {
    await page.goto('/');

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);
    const href = await manifestLink.getAttribute('href');
    expect(href).toBeTruthy();

    const response = await page.request.get(href!);
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toContain('Tiệm Cơm Tấm');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
  });

  test('update prompt provides defer or reload choices without interrupting service', async ({ page }) => {
    await page.goto('/');

    // Dismiss morning brief if present
    const backdrop = page.locator('.overlay-backdrop');
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
    }

    // Trigger update prompt via window helper
    await page.evaluate(() => {
      const win = window as any;
      win.__updateTriggered = false;
      win.__showUpdatePrompt?.(() => {
        win.__updateTriggered = true;
      });
    });

    const updatePrompt = page.locator('[data-testid="pwa-update-prompt"]');
    await expect(updatePrompt).toBeVisible();
    await expect(updatePrompt).toContainText('bản cập nhật mới');

    // Click "Để sau" to dismiss without reloading
    const deferBtn = updatePrompt.locator('[data-action="defer"]');
    await deferBtn.click();
    await expect(updatePrompt).not.toBeVisible();
    const deferred = await page.evaluate(() => (window as any).__updateTriggered);
    expect(deferred).toBe(false);

    // Reopen and click "Cập nhật ngay"
    await page.evaluate(() => {
      const win = window as any;
      win.__showUpdatePrompt?.(() => {
        win.__updateTriggered = true;
      });
    });
    await expect(updatePrompt).toBeVisible();

    const applyBtn = updatePrompt.locator('[data-action="apply"]');
    await applyBtn.click();
    const applied = await page.evaluate(() => (window as any).__updateTriggered);
    expect(applied).toBe(true);
  });
});
