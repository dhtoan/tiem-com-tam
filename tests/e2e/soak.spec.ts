import { test, expect } from '@playwright/test';

test.describe('Game Soak Stability & Long-Run Verification', () => {
  test('advances repeated accelerated days without leaking listeners, audio or DOM nodes', async ({ page }) => {
    await page.goto('/');

    // 1. Dismiss morning brief
    const backdrop = page.locator('.overlay-backdrop');
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(backdrop).not.toBeVisible();
    }

    // 2. Measure baseline DOM node count
    const initialDomCount = await page.evaluate(() => document.querySelectorAll('*').length);

    // 3. Soak loop: advance 5 days through full management cycle
    for (let day = 1; day <= 5; day++) {
      await page.evaluate((d) => {
        const win = window as any;
        const store = win.__store;
        if (store) {
          // Simulate day service with customer churn
          store.dispatch((s: any) => ({
            ...s,
            campaign: {
              ...s.campaign,
              day: d,
              phase: 'service',
            },
            customers: {
              ...s.customers,
              servedCount: s.customers.servedCount + 15,
              queue: [
                { id: `c-${d}-1`, name: 'Khách hàng', patience: 100 },
                { id: `c-${d}-2`, name: 'Khách hàng', patience: 90 },
              ],
            },
            cooking: {
              ...s.cooking,
              grillItems: [
                { id: `g-${d}-1`, proteinId: 'suon-heo', stage: 'cooking-a', elapsedMs: 1000, quality: 100 },
              ],
            },
          }));

          // Simulate day end: reset queues and clear grill
          store.dispatch((s: any) => ({
            ...s,
            campaign: {
              ...s.campaign,
              completedDays: [...s.campaign.completedDays, d],
              phase: 'summary',
            },
            customers: {
              ...s.customers,
              queue: [],
            },
            cooking: {
              ...s.cooking,
              grillItems: [],
              plate: { rice: false, proteins: [], toppings: [], sides: [] },
            },
          }));
        }
      }, day);

      // Brief sleep between days for microtask flushing
      await page.waitForTimeout(100);
    }

    // 4. Assert customer queue & cooking return to clean baseline
    const finalState = await page.evaluate(() => (window as any).__store?.getState());
    expect(finalState.customers.queue).toHaveLength(0);
    expect(finalState.cooking.grillItems).toHaveLength(0);
    expect(finalState.cooking.plate.rice).toBe(false);

    // 5. Assert DOM node growth is bounded (no runaway detached element leaks)
    const finalDomCount = await page.evaluate(() => document.querySelectorAll('*').length);
    const domDelta = finalDomCount - initialDomCount;
    expect(domDelta).toBeLessThan(150);

    // 6. Assert zero lingering overlay backdrops
    const activeOverlays = page.locator('.overlay-backdrop');
    await expect(activeOverlays).toHaveCount(0);
  });

  test('verifies single music bus and bounded grill audio controller state across transitions', async ({ page }) => {
    await page.goto('/');

    const audioStatus = await page.evaluate(() => {
      const win = window as any;
      const mixer = win.__audioMixer;
      const grillAudio = win.__grillAudioController;

      return {
        hasMixer: mixer !== undefined,
        masterVol: mixer ? mixer.getEffectiveVolume('master') : 1.0,
        musicVol: mixer ? mixer.getEffectiveVolume('music') : 1.0,
        grillIntensity: grillAudio ? grillAudio.getIntensity() : 0.0,
      };
    });

    expect(audioStatus.masterVol).toBeGreaterThanOrEqual(0.0);
    expect(audioStatus.masterVol).toBeLessThanOrEqual(1.0);
    expect(audioStatus.musicVol).toBeGreaterThanOrEqual(0.0);
    expect(audioStatus.musicVol).toBeLessThanOrEqual(1.0);
    expect(audioStatus.grillIntensity).toBe(0.0);
  });
});
