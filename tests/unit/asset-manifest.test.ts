import { describe, it, expect } from 'vitest';
import { getAsset, getAllAssets, validateManifest } from '../../src/client/assets/manifest';

describe('Asset Manifest & Type Validation', () => {
  it('retrieves registered assets with required metadata', () => {
    const assets = getAllAssets();
    expect(assets.length).toBeGreaterThan(0);

    const first = assets[0]!;
    expect(first.id).toBeTruthy();
    expect(first.path.startsWith('/')).toBe(true);
    expect(['image', 'audio', 'json', 'font']).toContain(first.type);
    expect(first.bundle).toBeTruthy();

    const retrieved = getAsset(first.id);
    expect(retrieved).toEqual(first);
  });

  it('rejects unknown asset ID with controlled error', () => {
    expect(() => getAsset('non_existent_asset_id_xyz')).toThrow(/not found/i);
  });

  it('detects duplicate IDs and invalid paths in manifest validator', () => {
    const validResult = validateManifest(getAllAssets());
    expect(validResult.valid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    // Test with duplicate IDs
    const duplicateList = [
      { id: 'dup_id', path: '/test1.png', type: 'image' as const, bundle: 'boot' as const },
      { id: 'dup_id', path: '/test2.png', type: 'image' as const, bundle: 'boot' as const },
    ];
    const dupResult = validateManifest(duplicateList);
    expect(dupResult.valid).toBe(false);
    expect(dupResult.errors.some(e => e.includes('Duplicate'))).toBe(true);

    // Test with invalid path (not starting with /)
    const badPathList = [
      { id: 'bad_path', path: 'relative/path.png', type: 'image' as const, bundle: 'boot' as const },
    ];
    const badPathResult = validateManifest(badPathList);
    expect(badPathResult.valid).toBe(false);
    expect(badPathResult.errors.some(e => e.includes('path'))).toBe(true);
  });
});
