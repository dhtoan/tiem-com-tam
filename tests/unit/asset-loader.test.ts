import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AssetLoader } from '../../src/client/assets/AssetLoader';
import { BUNDLE_DEFINITIONS } from '../../src/client/assets/bundles';
import type { AssetEntry } from '../../src/shared/types/assets';

describe('Asset Bundles & Lazy Loader', () => {
  let loader: AssetLoader;

  beforeEach(() => {
    loader = new AssetLoader();
  });

  describe('Bundle Definitions & Budgets', () => {
    it('defines all required production bundles with metadata', () => {
      const requiredBundles = [
        'boot',
        'stall-core',
        'characters-core',
        'dynamic-security',
        'story-day-range',
        'endings',
      ];

      for (const bundle of requiredBundles) {
        const def = BUNDLE_DEFINITIONS[bundle as keyof typeof BUNDLE_DEFINITIONS];
        expect(def, `Missing definition for ${bundle}`).toBeDefined();
        expect(def.maxBytesBudget).toBeGreaterThan(0);
        expect(def.description).toBeTruthy();
      }
    });
  });

  describe('AssetLoader Lifecycle & Deduplication', () => {
    it('starts with non-boot bundles unloaded', () => {
      expect(loader.isBundleLoaded('dynamic-security')).toBe(false);
      expect(loader.isBundleLoaded('endings')).toBe(false);
    });

    it('loads bundle assets and marks bundle as loaded', async () => {
      const mockLoaderFn = vi.fn().mockResolvedValue(undefined);
      loader.setCustomAssetFetcher(mockLoaderFn);

      await loader.ensureBundle('dynamic-security');

      expect(loader.isBundleLoaded('dynamic-security')).toBe(true);
      expect(mockLoaderFn).toHaveBeenCalled();
    });

    it('deduplicates simultaneous ensureBundle requests for the same bundle', async () => {
      let fetchCount = 0;
      const mockLoaderFn = vi.fn(async (_entry: AssetEntry) => {
        fetchCount++;
        await new Promise((r) => setTimeout(r, 10));
      });
      loader.setCustomAssetFetcher(mockLoaderFn);

      // Launch 3 simultaneous calls
      const [p1, p2, p3] = [
        loader.ensureBundle('dynamic-security'),
        loader.ensureBundle('dynamic-security'),
        loader.ensureBundle('dynamic-security'),
      ];

      await Promise.all([p1, p2, p3]);

      expect(loader.isBundleLoaded('dynamic-security')).toBe(true);
      // Fetcher should have been called once per asset in the bundle, not 3x
      const assetsInBundle = loader.getBundleAssets('dynamic-security');
      expect(fetchCount).toBe(assetsInBundle.length);
    });

    it('rejects with a controlled error when an asset load fails', async () => {
      const mockLoaderFn = vi.fn(async (entry: AssetEntry) => {
        if (entry.id.includes('pickpocket')) {
          throw new Error('Network timeout 404');
        }
      });
      loader.setCustomAssetFetcher(mockLoaderFn);

      await expect(loader.ensureBundle('dynamic-security')).rejects.toThrow(
        /Failed to load asset.*pickpocket/
      );
      expect(loader.isBundleLoaded('dynamic-security')).toBe(false);
    });
  });
});
