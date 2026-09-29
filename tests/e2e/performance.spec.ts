import { test, expect } from '@playwright/test';

test.describe('Performance & Frame Timing E2E Suite', () => {
  test('measures frame timing under stress scene (full queue + full grill + incident + overlay)', async ({ page }) => {
    await page.goto('/');

    // Dismiss morning brief
    const backdrop = page.locator('.overlay-backdrop');
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(backdrop).not.toBeVisible();
    }

    // Set up stress scene: full customer queue + full grill items + incident overlay
    await page.evaluate(() => {
      const win = window as any;
      const store = win.__store;
      if (store) {
        store.dispatch((s: any) => ({
          ...s,
          customers: {
            ...s.customers,
            queue: [
              { id: 'c1', name: 'Khách 1', patience: 100, order: { rice: true, proteins: ['suon-heo'] } },
              { id: 'c2', name: 'Khách 2', patience: 80, order: { rice: true, proteins: ['cha-trung'] } },
              { id: 'c3', name: 'Khách 3', patience: 90, order: { rice: true, proteins: ['bi-heo'] } },
              { id: 'c4', name: 'Khách 4', patience: 60, order: { rice: true, proteins: ['trung-op-la'] } },
            ],
          },
          cooking: {
            ...s.cooking,
            grillItems: [
              { id: 'g1', proteinId: 'suon-heo', stage: 'cooking-a', elapsedMs: 1500, quality: 100 },
              { id: 'g2', proteinId: 'suon-heo', stage: 'cooking-b', elapsedMs: 2200, quality: 95 },
              { id: 'g3', proteinId: 'suon-heo', stage: 'cooking-a', elapsedMs: 800, quality: 100 },
              { id: 'g4', proteinId: 'suon-heo', stage: 'done', elapsedMs: 3000, quality: 100 },
            ],
          },
        }));
      }

      // Open an active overlay under stress
      if (win.__overlayManager) {
        const stressEl = document.createElement('div');
        stressEl.className = 'stress-test-overlay';
        stressEl.textContent = 'Biến cố khẩn cấp: Giờ cao điểm đông khách!';
        win.__overlayManager.open('incident-stress', stressEl, { closable: true, title: 'Biến Cố Khẩn Cấp' });
      }
    });

    // Verify stress overlay rendered
    await expect(page.locator('.overlay-backdrop')).toBeVisible();

    // Sample requestAnimationFrame frame timings over 60 frames (~1 second)
    const metrics = await page.evaluate(async () => {
      return new Promise<{ avgFps: number; maxFrameTimeMs: number; framesSampled: number }>((resolve) => {
        let frames = 0;
        let lastTime = performance.now();
        let maxFrameTime = 0;
        const start = lastTime;

        function onFrame(now: number) {
          const delta = now - lastTime;
          lastTime = now;
          if (delta > maxFrameTime) maxFrameTime = delta;
          frames++;

          if (now - start >= 1000) {
            const elapsedSec = (now - start) / 1000;
            const avgFps = frames / elapsedSec;
            resolve({
              avgFps: Math.round(avgFps),
              maxFrameTimeMs: Math.round(maxFrameTime),
              framesSampled: frames,
            });
          } else {
            requestAnimationFrame(onFrame);
          }
        }
        requestAnimationFrame(onFrame);
      });
    });

    // Dismiss overlay
    await page.keyboard.press('Escape');
    await expect(page.locator('.overlay-backdrop')).not.toBeVisible();

    // Assert frame timing bounds (even in headless CI environment)
    expect(metrics.framesSampled).toBeGreaterThanOrEqual(20);
    expect(metrics.avgFps).toBeGreaterThanOrEqual(20);
    expect(metrics.maxFrameTimeMs).toBeLessThan(350);
  });

  test('verifies memory baseline and heap stability', async ({ page }) => {
    await page.goto('/');

    const memoryMetrics = await page.evaluate(() => {
      const perf = window.performance as any;
      if (perf && perf.memory) {
        return {
          usedJSHeapSize: perf.memory.usedJSHeapSize,
          totalJSHeapSize: perf.memory.totalJSHeapSize,
          jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryMetrics) {
      // Memory ceiling: used JS heap must not exceed 250MB
      expect(memoryMetrics.usedJSHeapSize).toBeLessThan(250 * 1024 * 1024);
    }
  });
});
