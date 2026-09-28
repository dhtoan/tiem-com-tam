import { test, expect } from '@playwright/test';

test.describe('Dynamic Lazy Asset Loading E2E', () => {
  test('core bundles are loaded at boot and dynamic bundles load on demand without 404', async ({ page }) => {
    // Listen for failed network requests
    const failedRequests: string[] = [];
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
    });

    await page.goto('/');

    // 1. Verify core bundles finish loading after boot
    await expect.poll(async () => {
      return page.evaluate(() => {
        const loader = (window as unknown as {
          __assetLoader: {
            isBundleLoaded: (b: string) => boolean;
          };
        }).__assetLoader;

        return (
          loader.isBundleLoaded('stall-core') &&
          loader.isBundleLoaded('characters-core')
        );
      });
    }, { timeout: 10_000 }).toBe(true);

    // Verify non-core bundles remain unloaded until requested
    const dynamicInitiallyUnloaded = await page.evaluate(() => {
      const loader = (window as unknown as {
        __assetLoader: {
          isBundleLoaded: (b: string) => boolean;
        };
      }).__assetLoader;

      return {
        dynamicSecurity: loader.isBundleLoaded('dynamic-security'),
        endings: loader.isBundleLoaded('endings'),
      };
    });

    expect(dynamicInitiallyUnloaded.dynamicSecurity).toBe(false);
    expect(dynamicInitiallyUnloaded.endings).toBe(false);

    // 2. Dynamically load security bundle
    await page.evaluate(async () => {
      const loader = (window as unknown as {
        __assetLoader: {
          ensureBundle: (b: string) => Promise<void>;
        };
      }).__assetLoader;
      await loader.ensureBundle('dynamic-security');
    });

    const securityLoaded = await page.evaluate(() => {
      const loader = (window as unknown as {
        __assetLoader: {
          isBundleLoaded: (b: string) => boolean;
        };
      }).__assetLoader;
      return loader.isBundleLoaded('dynamic-security');
    });
    expect(securityLoaded).toBe(true);

    // 3. Dynamically load endings bundle
    await page.evaluate(async () => {
      const loader = (window as unknown as {
        __assetLoader: {
          ensureBundle: (b: string) => Promise<void>;
        };
      }).__assetLoader;
      await loader.ensureBundle('endings');
    });

    const endingsLoaded = await page.evaluate(() => {
      const loader = (window as unknown as {
        __assetLoader: {
          isBundleLoaded: (b: string) => boolean;
        };
      }).__assetLoader;
      return loader.isBundleLoaded('endings');
    });
    expect(endingsLoaded).toBe(true);

    // 4. Ensure zero failed asset requests
    expect(failedRequests).toEqual([]);
  });
});
