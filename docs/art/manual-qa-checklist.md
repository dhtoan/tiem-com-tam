# Manual QA & Art Inspection Checklist

This checklist verifies visual quality, asset compliance, perspective integrity, and localization coverage across the full production release of **Tiệm Cơm Tấm / Cơm Tấm Sài Gòn**.

---

## 1. Character Identity & Expression Review

- [x] **Má Năm (Joy):**
  - Traditional Vietnamese floral bà ba blouse (teal/indigo tones), neat hair bun with modest hairpin.
  - Expressions: `neutral` (resilient), `happy` (warm welcoming smile), `worried` (concerned look during audits/debt), `determined` (resolute stare for milestone goals).
  - No facial feature drift across expressions.

- [x] **JD (Em họ):**
  - Energetic youth in polo shirt and practical waist apron.
  - Expressions: `neutral` (focused helper), `proud` (confident posture), `tired` (sweating after dinner rush), `cheering` (triumphant double thumbs-up).

- [x] **Ba Long (Chồng):**
  - Casual collared shirt with rolled sleeves; transition to wearing grill apron (`char_husband_apron`) on Day 25.
  - Expressions: `neutral` (thoughtful contemplation), `happy` (warm supportive smile), `apron` (hands-on active helper at the charcoal grill).

- [x] **Guards & Community NPCs:**
  - Chú Tám (veteran guard in faded blue uniform with cap).
  - Anh Hùng (athletic security officer in crisp black uniform).
  - Cô Lan (experienced neighborhood patrol leader in olive vest).
  - Fictionalized safety/accounting NPCs (`npc_tax_officer`, `npc_community_warden`, `npc_hygiene_inspector`) avoid copying real-world agency emblems.

---

## 2. Food Perspective & Plating Guidelines

- [x] **Top-Down Oblique Perspective:**
  - Standard angle: 45° elevation, consistent warm directional lighting from top-left.
  - Dinner plate: Traditional oval/round melamine plate (256×256 base) with rim border.
  - Rice mound: Centered slightly offset to lower-middle.
  - Sườn cốt lết (Grilled pork chop): Positioned diagonally across top half with grilled grill marks.
  - Chả trứng (Egg meatloaf) & Bì (Shredded skin): Placed neatly alongside rice.
  - Dưa leo & Đồ chua: Crisp garnish on upper-right plate rim.
  - Nước mắm: Small clear melamine dipping bowl with chili bits.

---

## 3. Responsive & Mobile Layout Verification

- [x] **Desktop (1280×720):**
  - Complete 4-station hierarchy clearly displayed:
    - Charcoal Grill: Left station with smoke hood.
    - Glass Display Counter: Center warm-lit display case.
    - Steamer Station: Right large stainless steel broken rice steamer.
    - Prep & Plating: Bottom center workspace.
  - Zero horizontal scrollbars.

- [x] **Mobile (390×844):**
  - Quick-switch station navigation buttons visible and comfortably tappable (>=32px height).
  - Responsive HUD showing Day counter, cash, debt, reputation, and quick-action menu.
  - Zero overflow or horizontal body scrolling.

---

## 4. Audio Architecture & Boundaries

- [x] Audio mixer manages 5 distinct volume buses: `master`, `music`, `ambience`, `sfx`, `ui`.
- [x] Volume clamping strictly bounded between `[0.0, 1.0]`.
- [x] Charcoal grill loop handled by single intensity controller (`GrillAudioController`), never spawning duplicate loop instances per steak.
- [x] Background tab suspension: audio mutes/pauses immediately on `visibilitychange` hidden and resumes on visible.
- [x] All audio files and art assets explicitly licensed in [`CREDITS.md`](file:///c:/Users/dohuy/Downloads/Aunomay/Game/Tiem%20Com%20Tam/CREDITS.md).

---

## 5. Localization & Text Integrity

- [x] 100% key parity between Vietnamese (`src/client/i18n/vi.ts`) and English (`src/client/i18n/en.ts`).
- [x] Zero AI-garbled text or corrupted character glyphs.
- [x] Tone in English preserves colloquial Vietnamese warmth without literal legal jargon.
- [x] Persistent language choice preserved across browser reloads via localStorage.
