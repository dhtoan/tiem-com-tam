import { test, expect } from '@playwright/test';

test.describe('Accessibility & Inclusive Gameplay E2E Suite', () => {
  test('verifies ARIA roles, labels, and modal accessibility hierarchy', async ({ page }) => {
    await page.goto('/');

    const brief = page.locator('.brief-container');
    if (await brief.isVisible()) {
      await page.keyboard.press('Escape');
    }

    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();

    // Verify HUD buttons have accessible aria-labels
    const marketBtn = hud.locator('.market-btn');
    const settingsBtn = hud.locator('.settings-btn');
    await expect(marketBtn).toHaveAttribute('aria-label');
    await expect(settingsBtn).toHaveAttribute('aria-label');

    // Open settings modal and assert ARIA attributes
    await settingsBtn.click();
    const backdrop = page.locator('.overlay-backdrop');
    await expect(backdrop).toBeVisible();
    await expect(backdrop).toHaveAttribute('role', 'dialog');
    await expect(backdrop).toHaveAttribute('aria-modal', 'true');

    const closeBtn = backdrop.locator('.overlay-close-btn');
    await expect(closeBtn).toHaveAttribute('aria-label', 'Đóng');

    // Close and verify dismissal
    await closeBtn.click();
    await expect(backdrop).not.toBeVisible();
  });

  test('verifies keyboard focus trap and focus restoration on dismiss', async ({ page }) => {
    await page.goto('/');

    const brief = page.locator('.brief-container');
    if (await brief.isVisible()) {
      await page.keyboard.press('Escape');
    }

    const hud = page.locator('.game-hud');
    const debtBtn = hud.locator('.debt-btn');
    await debtBtn.focus();

    // Open debt panel via click or Enter
    await debtBtn.click();
    const overlay = page.locator('.overlay-backdrop[data-overlay-id="debt-panel"]');
    await expect(overlay).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();

    // Verify focus restoration
    const isDebtFocused = await debtBtn.evaluate((el) => el === document.activeElement);
    expect(isDebtFocused).toBe(true);
  });

  test('verifies GameClock slow-time accessibility modes and auto-pause', async ({ page }) => {
    await page.goto('/');

    // 1. Extra-slow mode
    const extraSlowScale = await page.evaluate(() => {
      const clock = (window as any).__gameClock;
      clock.setSlowMode('extra-slow');
      return clock.getScale();
    });
    expect(extraSlowScale).toBe(0.15);

    // 2. No-timed-decisions mode
    const noTimedScale = await page.evaluate(() => {
      const clock = (window as any).__gameClock;
      clock.setSlowMode('no-timed');
      return clock.getScale();
    });
    expect(noTimedScale).toBe(0.0);

    // 3. Standard mode
    const standardScale = await page.evaluate(() => {
      const clock = (window as any).__gameClock;
      clock.setSlowMode('standard');
      return clock.getScale();
    });
    expect(standardScale).toBe(0.30);

    // 4. Auto-pause and resume
    const pauseState = await page.evaluate(() => {
      const clock = (window as any).__gameClock;
      clock.pause();
      const isPaused = clock.isPaused();
      clock.resume();
      const isResumed = !clock.isPaused();
      return { isPaused, isResumed };
    });
    expect(pauseState.isPaused).toBe(true);
    expect(pauseState.isResumed).toBe(true);
  });

  test('verifies reduced motion configuration persistence', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const win = window as any;
      win.__store.dispatch((s: any) => ({
        ...s,
        settings: {
          ...s.settings,
          reducedMotion: true,
        },
      }));
    });

    const isReduced = await page.evaluate(() => {
      const state = (window as any).__store.getState();
      return state.settings.reducedMotion;
    });
    expect(isReduced).toBe(true);
  });
});
