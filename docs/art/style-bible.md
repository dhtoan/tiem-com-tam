# Tiệm Cơm Tấm — Art Style Bible

## 1. Visual Identity & Creative Vision

Tiệm Cơm Tấm captures the warm, nostalgic, and bustling atmosphere of a classic Saigon street food stall (*quán cơm tấm vỉa hè Sài Gòn*). The visual design balances cozy, mouth-watering culinary appeal with grounded, heartfelt family drama.

### Guiding Principles
- **Warm & Appetizing:** Rich golden browns, amber caramelization, sizzling grill char, vibrant green scallion oil, crisp pickled carrots/daikon, and lustrous dipping sauce.
- **Authentic Saigon Atmosphere:** Low plastic stools, weathered wooden tables, metal prep counters, smoke plumes with glowing embers from charcoal grills, vintage signs, and dappled tropical sunlight.
- **Clarity & Silhouette:** Clear readability on mobile screens (360px width) up to 4K desktop displays. Distinct silhouettes for characters, stations, and ingredients.
- **Consistent Perspective:** 30-degree cabinet / top-down perspective for prep and cooking stations; eye-level profile for street customer queue and character dialogue portraits.

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| Deep Night Wood | `#1a0f0a` | Deep shadows, grill grates, background silhouettes |
| Charcoal Brown | `#2d1810` | Base dark background, wooden counters, outlines |
| Warm Clay / Terracotta | `#7d2e1f` | Brand accent, stall banners, primary headers |
| Roasted Cinnamon | `#8c5338` | Borders, station frames, secondary UI accents |
| Golden Amber | `#d4a373` | Embers, broth highlights, toasted rice, UI trim |
| Saigon Wheat | `#deb887` | Card backgrounds, badge surfaces, paper menus |
| Warm Rice Cream | `#fbf5ed` | Modal panels, clean plate surface, primary background |
| Scallion Green | `#2d6a4f` | Spring onion oil garnish, fresh herbs, positive status |
| Chili Crimson | `#dc2626` | Fresh chili, urgent alerts, debt warnings |

---

## 3. Station Layout & Spatial Hierarchy

### Desktop (1280×720)
```
+-------------------------------------------------------------------------------+
| HUD: [Day 1 | Sáng] [Chợ] [JD] [Sổ sách]      [💵 120.000đ] [🏦 0đ] [⭐ 4.5]   |
+-------------------------------------------------------------------------------+
| [Street & Customers]  Queue line with animated customer archetypes & orders   |
+----------------------+-----------------------------+--------------------------+
| GRILL STATION (Left) | FOOD DISPLAY (Center)       | RICE & SIDES (Right)     |
| - Charcoal embers    | - Heated display case       | - Steaming rice pot      |
| - 4 cooking slots    | - Trays: bì, chả, trứng     | - Soup warmer, bowls     |
| - Smoke FX           | - Sauce jars, pickles       | - Scallion oil dispenser |
+----------------------+-----------------------------+--------------------------+
| PLATING & PREP STATION (Bottom Foreground)                                    |
| - Melamine plate, ordered ingredient assembly, garnish, bell ringer           |
+-------------------------------------------------------------------------------+
```

### Mobile (390×844)
Uses dynamic focus anchors (`grill`, `display`, `rice`, `plating`, `customers`) with horizontal swipe or bottom-nav quick jumps while keeping the active order ticket sticky.

---

## 4. Production Quality Rules

1. **Zero Text Corruption:** No AI-hallucinated or misspelled Vietnamese lettering. All signs, labels, and text must use approved typography and localization keys.
2. **Perspective Alignment:** Plating toppings must share the same 30° top-down perspective to nest naturally onto the plate without visual shearing.
3. **Food Appeal:** Cooked proteins must look distinctly juicy, caramelized, and delicious; raw items must look fresh and pink; overcooked items must look blackened and dry.
4. **No Watermarks:** Every asset in production must be original or fully licensed and verified.
