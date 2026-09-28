export type AssetType = 'image' | 'audio' | 'json' | 'font';

export type AssetBundle =
  | 'boot'
  | 'stall-core'
  | 'characters-core'
  | 'dynamic-security'
  | 'story-day-range'
  | 'endings'
  | 'audio';

export interface AssetEntry {
  id: string;
  path: string;
  type: AssetType;
  width?: number;
  height?: number;
  bundle: AssetBundle;
  license?: string;
  description?: string;
}

export interface ManifestValidationResult {
  valid: boolean;
  errors: string[];
}
