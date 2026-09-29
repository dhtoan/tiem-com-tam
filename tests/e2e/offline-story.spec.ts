import { test, expect } from '@playwright/test';

test.describe('Offline Story Mode E2E', () => {
  test('story mode continues and preserves saves when completely offline', async ({ page, context }) => {
    // 1. Initial load online
    await page.goto('/');

    // Verify morning brief appears and dismiss it
    const brief = page.locator('.brief-container');
    await expect(brief).toBeVisible();
    const startBtn = brief.locator('.start-prep-btn');
    await startBtn.click();
    await expect(brief).not.toBeVisible();

    // Verify HUD is present and stall is running
    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();
    await expect(hud.locator('.cash-value')).toBeVisible();

    // 2. Disconnect network
    await context.setOffline(true);

    // Verify offline badge appears
    const offlineBadge = page.locator('[data-testid="offline-badge"]');
    await expect(offlineBadge).toBeVisible();

    // 3. Interact with game mechanics offline (open Market, etc.)
    const marketBtn = hud.locator('.market-btn');
    await marketBtn.click();

    const marketModal = page.locator('.overlay-backdrop');
    await expect(marketModal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(marketModal).not.toBeVisible();

    // 4. Modify store state offline
    await page.evaluate(() => {
      const win = window as any;
      if (win.__store) {
        win.__store.dispatch((s: any) => ({
          ...s,
          economy: {
            ...s.economy,
            shopCash: 777000
          }
        }));
      }
    });

    // Verify money updated on HUD
    await expect(hud.locator('.cash-value')).toContainText('777.000');

    // 5. Verify local save exists in localStorage
    const localSaveRaw = await page.evaluate(() => localStorage.getItem('tiem_com_tam_save_v1'));
    expect(localSaveRaw).not.toBeNull();
    const localSave = JSON.parse(localSaveRaw!);
    expect(localSave.state.economy.shopCash).toBe(777000);

    // 6. Reconnect network and verify offline badge disappears
    await context.setOffline(false);
    await expect(offlineBadge).not.toBeVisible();

    // 7. Reload page and assert persisted state is restored
    await page.reload();
    const reloadedHud = page.locator('.game-hud');
    await expect(reloadedHud.locator('.cash-value')).toContainText('777.000');
  });
});
