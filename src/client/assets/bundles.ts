import type { AssetBundle } from '../../shared/types/assets';

export interface BundleDefinition {
  id: AssetBundle;
  name: string;
  description: string;
  maxBytesBudget: number;
}

export const BUNDLE_DEFINITIONS: Record<AssetBundle, BundleDefinition> = {
  boot: {
    id: 'boot',
    name: 'Boot & PWA Shell',
    description: 'Minimal app shell, icons, web manifest and service worker',
    maxBytesBudget: 150_000,
  },
  'stall-core': {
    id: 'stall-core',
    name: 'Stall & Kitchen Core',
    description: 'Day 1 stall background, grill stations, base plate and core ingredients',
    maxBytesBudget: 1_500_000,
  },
  'characters-core': {
    id: 'characters-core',
    name: 'Characters Core',
    description: 'Joy, JD, Ba Long, and core customer appearance variants',
    maxBytesBudget: 2_500_000,
  },
  'dynamic-security': {
    id: 'dynamic-security',
    name: 'Dynamic Security & Officials',
    description: 'Guards, municipal inspection NPCs, and incident character assets',
    maxBytesBudget: 1_200_000,
  },
  'story-day-range': {
    id: 'story-day-range',
    name: 'Story Moments & Milestones',
    description: 'Story day pivotal illustrations and event cutscenes',
    maxBytesBudget: 3_000_000,
  },
  endings: {
    id: 'endings',
    name: 'Campaign Endings & Epilogues',
    description: 'High-resolution ending artworks and album illustrations',
    maxBytesBudget: 2_500_000,
  },
  audio: {
    id: 'audio',
    name: 'Audio Set',
    description: 'Music themes, daytime street ambience, and cooking sound effects',
    maxBytesBudget: 4_000_000,
  },
};
