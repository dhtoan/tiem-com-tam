import type { AssetEntry, AssetBundle, ManifestValidationResult } from '../../shared/types/assets';

export const ASSET_ENTRIES: AssetEntry[] = [
  // Boot & Shell
  {
    id: 'manifest_webmanifest',
    path: '/manifest.webmanifest',
    type: 'json',
    bundle: 'boot',
    description: 'PWA Web Manifest'
  },
  {
    id: 'service_worker',
    path: '/sw.js',
    type: 'json',
    bundle: 'boot',
    description: 'Service Worker Script'
  },

  // Stall Core
  {
    id: 'stall_background',
    path: '/assets/stall/stall_background.png',
    type: 'image',
    width: 1280,
    height: 720,
    bundle: 'stall-core',
    description: 'Saigon street food stall background'
  },
  {
    id: 'grill_station',
    path: '/assets/stall/grill_station.png',
    type: 'image',
    width: 400,
    height: 300,
    bundle: 'stall-core',
    description: 'Charcoal grill station with smoke exhaust'
  },
  {
    id: 'display_counter',
    path: '/assets/stall/display_counter.png',
    type: 'image',
    width: 480,
    height: 320,
    bundle: 'stall-core',
    description: 'Food display glass counter with warm lighting'
  },
  {
    id: 'rice_station',
    path: '/assets/stall/rice_station.png',
    type: 'image',
    width: 350,
    height: 300,
    bundle: 'stall-core',
    description: 'Large commercial rice steamer station'
  },
  {
    id: 'prep_table',
    path: '/assets/stall/prep_table.png',
    type: 'image',
    width: 600,
    height: 250,
    bundle: 'stall-core',
    description: 'Plating prep counter with ingredient bowls'
  },

  // Food - Plates & Bases
  {
    id: 'plate_base',
    path: '/assets/food/plates/plate_base.png',
    type: 'image',
    width: 256,
    height: 256,
    bundle: 'stall-core',
    description: 'Traditional Saigon melamine dinner plate'
  },
  {
    id: 'food_broken_rice',
    path: '/assets/food/ingredients/broken_rice.png',
    type: 'image',
    width: 200,
    height: 200,
    bundle: 'stall-core',
    description: 'Mounded fragrant broken rice (cơm tấm)'
  },

  // Food - Proteins & Cook States
  {
    id: 'meat_pork_chop_raw',
    path: '/assets/food/ingredients/pork_chop_raw.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Marinated raw pork chop (sườn)'
  },
  {
    id: 'meat_pork_chop_grilled',
    path: '/assets/food/ingredients/pork_chop_grilled.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Golden caramelized grilled pork chop'
  },
  {
    id: 'meat_pork_chop_burnt',
    path: '/assets/food/ingredients/pork_chop_burnt.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Charred/overcooked pork chop'
  },
  {
    id: 'food_egg_meatloaf',
    path: '/assets/food/ingredients/egg_meatloaf.png',
    type: 'image',
    width: 140,
    height: 140,
    bundle: 'stall-core',
    description: 'Steamed egg meatloaf with yolk glaze (chả trứng)'
  },
  {
    id: 'food_shredded_pork_skin',
    path: '/assets/food/ingredients/shredded_pork_skin.png',
    type: 'image',
    width: 140,
    height: 140,
    bundle: 'stall-core',
    description: 'Seasoned shredded pork skin with roasted rice powder (bì)'
  },
  {
    id: 'food_fried_egg',
    path: '/assets/food/ingredients/fried_egg.png',
    type: 'image',
    width: 130,
    height: 130,
    bundle: 'stall-core',
    description: 'Sunny-side-up fried egg with crispy edges (trứng ốp la)'
  },
  {
    id: 'food_scallion_oil',
    path: '/assets/food/ingredients/scallion_oil.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Fragrant scallion oil with crispy pork lard (mỡ hành)'
  },
  {
    id: 'food_pickled_vegetables',
    path: '/assets/food/ingredients/pickled_vegetables.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Pickled daikon and carrots (đồ chua)'
  },
  {
    id: 'food_fish_sauce',
    path: '/assets/food/ingredients/fish_sauce.png',
    type: 'image',
    width: 100,
    height: 100,
    bundle: 'stall-core',
    description: 'Sweet and savory garlic chili dipping fish sauce (nước mắm tỏi ớt)'
  },
  {
    id: 'plate_tray_takeaway',
    path: '/assets/food/plates/plate_tray_takeaway.png',
    type: 'image',
    width: 256,
    height: 256,
    bundle: 'stall-core',
    description: 'Recyclable takeout meal box'
  },
  {
    id: 'plate_bowl_soup',
    path: '/assets/food/plates/plate_bowl_soup.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Melamine side soup bowl'
  },
  {
    id: 'meat_sliced_pork',
    path: '/assets/food/ingredients/sliced_pork.png',
    type: 'image',
    width: 160,
    height: 160,
    bundle: 'stall-core',
    description: 'Pan-fried thinly sliced pork belly'
  },
  {
    id: 'meat_grilled_chicken',
    path: '/assets/food/ingredients/grilled_chicken.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Lemongrass grilled chicken quarter'
  },
  {
    id: 'meat_grilled_squid',
    path: '/assets/food/ingredients/grilled_squid.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Satay chili grilled baby squid'
  },
  {
    id: 'meat_ribs_honey',
    path: '/assets/food/ingredients/ribs_honey.png',
    type: 'image',
    width: 180,
    height: 180,
    bundle: 'stall-core',
    description: 'Honey glazed barbecue spare ribs'
  },
  {
    id: 'food_crab_cake',
    path: '/assets/food/ingredients/crab_cake.png',
    type: 'image',
    width: 140,
    height: 140,
    bundle: 'stall-core',
    description: 'Steamed seafood and crab cake patty'
  },
  {
    id: 'food_chinese_sausage',
    path: '/assets/food/ingredients/chinese_sausage.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Sweet savory cured Chinese sausage (lạp xưởng)'
  },
  {
    id: 'food_meatball_shumai',
    path: '/assets/food/ingredients/meatball_shumai.png',
    type: 'image',
    width: 130,
    height: 130,
    bundle: 'stall-core',
    description: 'Tender pork shumai meatballs in fresh tomato sauce'
  },
  {
    id: 'food_tofu_meat',
    path: '/assets/food/ingredients/tofu_meat.png',
    type: 'image',
    width: 130,
    height: 130,
    bundle: 'stall-core',
    description: 'Golden fried tofu stuffed with savory minced pork'
  },
  {
    id: 'food_pork_ham',
    path: '/assets/food/ingredients/pork_ham.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Silky steamed pork ham roll (chả lụa)'
  },
  {
    id: 'food_cucumber_slices',
    path: '/assets/food/ingredients/cucumber_slices.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Crisp fresh cucumber diagonal cuts'
  },
  {
    id: 'food_tomato_slices',
    path: '/assets/food/ingredients/tomato_slices.png',
    type: 'image',
    width: 120,
    height: 120,
    bundle: 'stall-core',
    description: 'Juicy ripe red tomato slices'
  },
  {
    id: 'food_soy_sauce',
    path: '/assets/food/ingredients/soy_sauce.png',
    type: 'image',
    width: 100,
    height: 100,
    bundle: 'stall-core',
    description: 'Aromatic seasoned soy sauce with fresh chili'
  },
  {
    id: 'food_chili_paste',
    path: '/assets/food/ingredients/chili_paste.png',
    type: 'image',
    width: 100,
    height: 100,
    bundle: 'stall-core',
    description: 'Spicy roasted shrimp chili oil paste (sa tế)'
  },
  {
    id: 'food_bitter_melon_soup',
    path: '/assets/food/ingredients/bitter_melon_soup.png',
    type: 'image',
    width: 140,
    height: 140,
    bundle: 'stall-core',
    description: 'Traditional bitter melon soup stuffed with pork'
  },
  {
    id: 'food_mustard_soup',
    path: '/assets/food/ingredients/mustard_soup.png',
    type: 'image',
    width: 140,
    height: 140,
    bundle: 'stall-core',
    description: 'Clear pork rib soup with pickled mustard greens'
  },

  // Characters - Core Family
  {
    id: 'char_joy_neutral',
    path: '/assets/characters/joy/joy_neutral.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'Má Năm (Joy) neutral resilient expression'
  },
  {
    id: 'char_joy_happy',
    path: '/assets/characters/joy/joy_happy.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'Má Năm warm smiling expression'
  },
  {
    id: 'char_joy_worried',
    path: '/assets/characters/joy/joy_worried.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'Má Năm stressed/concerned expression'
  },
  {
    id: 'char_jd_neutral',
    path: '/assets/characters/jd/jd_neutral.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'JD attentive helper posture'
  },
  {
    id: 'char_jd_proud',
    path: '/assets/characters/jd/jd_proud.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'JD confident capable expression'
  },
  {
    id: 'char_husband_neutral',
    path: '/assets/characters/husband/husband_neutral.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'Ba Long (Husband) thoughtful expression'
  },
  {
    id: 'char_husband_apron',
    path: '/assets/characters/husband/husband_apron.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'characters-core',
    description: 'Ba Long wearing stall apron ready to grill'
  },

  // Security & Guards
  {
    id: 'guard_chu_tam',
    path: '/assets/guards/chu_tam.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'dynamic-security',
    description: 'Chú Tám friendly veteran neighborhood guard'
  },
  {
    id: 'guard_anh_hung',
    path: '/assets/guards/anh_hung.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'dynamic-security',
    description: 'Anh Hùng athletic security officer'
  },
  {
    id: 'guard_co_lan',
    path: '/assets/guards/co_lan.png',
    type: 'image',
    width: 256,
    height: 384,
    bundle: 'dynamic-security',
    description: 'Cô Lan experienced community patrol leader'
  },

  // Audio - Music & Ambience
  {
    id: 'music_stall_theme',
    path: '/audio/music/carefree.mp3',
    type: 'audio',
    bundle: 'audio',
    license: 'CC-BY 3.0 Kevin MacLeod',
    description: 'Relaxed upbeat acoustic daytime stall music'
  },
  {
    id: 'ambience_street_day',
    path: '/audio/ambience/street_day.mp3',
    type: 'audio',
    bundle: 'audio',
    license: 'Royalty-Free Open Audio',
    description: 'Saigon street murmur, distant scooters, birds'
  },
  {
    id: 'sfx_grill_sizzle',
    path: '/audio/sfx/grill_sizzle.mp3',
    type: 'audio',
    bundle: 'audio',
    license: 'Royalty-Free Open Audio',
    description: 'Charcoal grill meat searing sizzle loop'
  },
  {
    id: 'sfx_order_bell',
    path: '/audio/sfx/order_bell.mp3',
    type: 'audio',
    bundle: 'audio',
    license: 'Royalty-Free Open Audio',
    description: 'Customer order complete bell chime'
  },
  {
    id: 'sfx_cash_register',
    path: '/audio/sfx/cash_register.mp3',
    type: 'audio',
    bundle: 'audio',
    license: 'Royalty-Free Open Audio',
    description: 'Payment collection and coin register sound'
  }
];

const ASSET_MAP = new Map<string, AssetEntry>(
  ASSET_ENTRIES.map(entry => [entry.id, entry])
);

export function getAsset(id: string): AssetEntry {
  const asset = ASSET_MAP.get(id);
  if (!asset) {
    throw new Error(`Asset ID not found in manifest: ${id}`);
  }
  return asset;
}

export function getAllAssets(): AssetEntry[] {
  return [...ASSET_ENTRIES];
}

export function getAssetsByBundle(bundle: AssetBundle): AssetEntry[] {
  return ASSET_ENTRIES.filter(entry => entry.bundle === bundle);
}

export function validateManifest(entries: AssetEntry[]): ManifestValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const entry of entries) {
    if (!entry.id || typeof entry.id !== 'string') {
      errors.push(`Invalid or missing ID in entry: ${JSON.stringify(entry)}`);
      continue;
    }

    if (seenIds.has(entry.id)) {
      errors.push(`Duplicate asset ID detected: "${entry.id}"`);
    }
    seenIds.add(entry.id);

    if (!entry.path || !entry.path.startsWith('/')) {
      errors.push(`Asset "${entry.id}" path must start with "/": got "${entry.path}"`);
    }

    if (!['image', 'audio', 'json', 'font'].includes(entry.type)) {
      errors.push(`Asset "${entry.id}" has invalid type: "${entry.type}"`);
    }

    if (!entry.bundle) {
      errors.push(`Asset "${entry.id}" missing bundle assignment`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
