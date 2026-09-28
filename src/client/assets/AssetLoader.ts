import type { AssetBundle, AssetEntry } from '../../shared/types/assets';
import { getAssetsByBundle } from './manifest';

export type AssetFetcher = (entry: AssetEntry) => Promise<void>;

export class AssetLoader {
  private loadedBundles = new Set<AssetBundle>();
  private inFlightLoads = new Map<AssetBundle, Promise<void>>();
  private customFetcher: AssetFetcher | null = null;

  public setCustomAssetFetcher(fetcher: AssetFetcher): void {
    this.customFetcher = fetcher;
  }

  public isBundleLoaded(bundleId: AssetBundle): boolean {
    return this.loadedBundles.has(bundleId);
  }

  public getBundleAssets(bundleId: AssetBundle): AssetEntry[] {
    return getAssetsByBundle(bundleId);
  }

  public async ensureBundle(bundleId: AssetBundle): Promise<void> {
    if (this.loadedBundles.has(bundleId)) {
      return;
    }

    const inFlight = this.inFlightLoads.get(bundleId);
    if (inFlight) {
      return inFlight;
    }

    const loadPromise = this.executeBundleLoad(bundleId);
    this.inFlightLoads.set(bundleId, loadPromise);

    try {
      await loadPromise;
      this.loadedBundles.add(bundleId);
    } finally {
      this.inFlightLoads.delete(bundleId);
    }
  }

  private async executeBundleLoad(bundleId: AssetBundle): Promise<void> {
    const assets = this.getBundleAssets(bundleId);
    if (assets.length === 0) {
      return;
    }

    const loadTasks = assets.map(async (entry) => {
      try {
        if (this.customFetcher) {
          await this.customFetcher(entry);
        } else {
          await this.defaultFetchAsset(entry);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load asset: ${entry.id} (${entry.path}) - ${msg}`);
      }
    });

    await Promise.all(loadTasks);
  }

  private async defaultFetchAsset(entry: AssetEntry): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (entry.type === 'image' && typeof Image !== 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image failed to load'));
        img.src = entry.path;
      });
    } else {
      const response = await fetch(entry.path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
    }
  }
}

export const assetLoader = new AssetLoader();
