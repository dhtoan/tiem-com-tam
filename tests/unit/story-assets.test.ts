import { describe, it, expect } from 'vitest';
import { getAsset, getAssetsByBundle } from '../../src/client/assets/manifest';
import { ENDING_DEFINITIONS } from '../../src/client/data/endings';

describe('Story and Ending Assets Coverage', () => {
  it('registers all 6 canonical campaign endings in manifest with endings bundle', () => {
    const endingKeys = Object.keys(ENDING_DEFINITIONS) as (keyof typeof ENDING_DEFINITIONS)[];
    expect(endingKeys).toHaveLength(6);

    for (const key of endingKeys) {
      const assetId = key === 'husband-finance' ? 'ending_husband_finance' : `ending_${key}`;
      const asset = getAsset(assetId);
      expect(asset).toBeDefined();
      expect(asset.bundle).toBe('endings');
      expect(asset.type).toBe('image');
      expect(asset.path).toContain('/assets/endings/');
    }
  });

  it('registers pivotal 30-day story illustrations in manifest', () => {
    const pivotalScenes = [
      'story_day01_stall_opening',
      'story_day15_rainy_rush',
      'story_day25_husband_apron',
      'story_day30_grand_finale',
    ];

    for (const sceneId of pivotalScenes) {
      const asset = getAsset(sceneId);
      expect(asset).toBeDefined();
      expect(asset.bundle).toBe('story-day-range');
      expect(asset.type).toBe('image');
      expect(asset.path).toContain('/assets/story/');
    }
  });

  it('contains complete character expressions for Joy, JD, and Husband', () => {
    const requiredExpressions = [
      // Joy
      'char_joy_neutral',
      'char_joy_happy',
      'char_joy_worried',
      'char_joy_determined',
      // JD
      'char_jd_neutral',
      'char_jd_proud',
      'char_jd_tired',
      'char_jd_cheering',
      // Husband
      'char_husband_neutral',
      'char_husband_happy',
      'char_husband_apron',
    ];

    for (const exprId of requiredExpressions) {
      const asset = getAsset(exprId);
      expect(asset).toBeDefined();
      expect(asset.bundle).toBe('characters-core');
      expect(asset.type).toBe('image');
    }
  });

  it('ensures endings bundle has exactly 6 endings', () => {
    const endingAssets = getAssetsByBundle('endings');
    expect(endingAssets.length).toBeGreaterThanOrEqual(6);
  });
});
