# Full Content + Media + Localization + Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace development media with a coherent production asset set, complete all recipe/customer/story content, provide full Vietnamese/English localization, and ship a bounded audio/asset pipeline with validation.

**Architecture:** Every runtime asset is referenced through a typed manifest and grouped into load bundles. Character and food generation use locked reference sheets/perspective guides. Localization uses stable keys separated from story logic. Audio uses four buses and controllers rather than ad-hoc instances.

**Tech Stack:** Existing application stack plus repository scripts for asset validation/optimization. Runtime remains local; no AI API is required.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- Day 1 visual quality is accepted before campaign-wide asset production.
- Original art only; reference screenshot guides composition, not tracing.
- No watermarks or AI-garbled dynamic text.
- Joy/JD/husband identity must remain consistent.
- Plate toppings share the same perspective/coordinates.
- Production has zero placeholder emoji/media.
- Third-party media requires explicit license metadata/CREDITS entry.
- Vietnamese default and English complete.

## Review Focus

1. Manifest path exists on disk and has correct file type/dimensions.
2. Every dialogue/UI key exists in both VI and EN.
3. Character identity/perspective does not drift across generated batches.
4. Lazy bundles never request a missing asset when a dynamic event fires.
5. Audio loops are singular/controllers, not one unbounded instance per entity.

---

### Task 1: Build typed asset manifest and validation pipeline

**Files:**
- Create: `src/client/assets/manifest.ts`
- Create: `src/shared/types/assets.ts`
- Create: `scripts/validate-assets.mjs`
- Create: `scripts/validate-content.mjs`
- Modify: `package.json`
- Test: `tests/unit/asset-manifest.test.ts`

**Interfaces:**
- `AssetEntry`: id, path, type, width, height, bundle, license.
- `getAsset(id: AssetId): AssetEntry`.
- Scripts: `npm run validate:assets`, `npm run validate:content`.

- [ ] Write failing test for duplicate IDs and missing manifest path.
- [ ] Implement manifest schema and validator.
- [ ] Add validator to build/CI-facing scripts without hiding failures.
- [ ] Verify PASS.
- [ ] Commit: `feat: add validated asset manifest`.

### Task 2: Produce and integrate production Day 1 art reference set

**Files:**
- Create: `docs/art/style-bible.md`
- Create: `docs/art/character-reference-joy.md`
- Create: `docs/art/character-reference-jd.md`
- Create: `docs/art/character-reference-husband.md`
- Create: `docs/art/food-perspective-reference.md`
- Create: `public/assets/stall/*`
- Create: `public/assets/characters/{joy,jd,husband}/*`
- Create: `public/assets/food/day1/*`
- Create: `public/assets/ui/*`
- Test: `tests/e2e/day1-visual.spec.ts`

**Interfaces:**
- Uses stable manifest IDs; no renderer directly hardcodes file paths.

- [ ] Lock the shared style prefix, character reference sheets, plate perspective and desktop composition guide in docs.
- [ ] Generate/create original Day 1 stall, Joy/JD/husband expressions, grill/protein states, rice/toppings/plate and essential UI icons.
- [ ] Register/validate each asset before using it.
- [ ] Capture desktop 1280×720 and mobile 390×844 screenshots; manually review food clarity, identity consistency and station hierarchy.
- [ ] Commit only after Day 1 visual gate is accepted: `art: complete day 1 production visual slice`.

### Task 3: Complete ingredient and recipe data/media

**Files:**
- Modify: `src/client/data/ingredients.ts`
- Create/Modify: `src/client/data/recipes.ts`
- Create: `public/assets/food/ingredients/*`
- Create: `public/assets/food/plates/*`
- Test: `tests/unit/content-counts.test.ts`

**Interfaces:**
- Production target exactly/approximately as approved: 23 ingredients and about 25 recipes; validator treats the configured release counts as required minimums.
- Plate layers use shared semantic slots.

- [ ] Write failing content-count/reference tests.
- [ ] Fill all ingredient/recipe data with centralized price/cost/unlock references.
- [ ] Produce food art including full/medium/low/empty tray states and distinct grilled cook states.
- [ ] Run content + asset validators and tests.
- [ ] Commit: `content: complete food catalog`.

### Task 4: Complete customer, guard, incident and neighborhood character media

**Files:**
- Create/Modify: `src/client/data/customers.ts`
- Modify: `src/client/data/guards.ts`
- Create: `public/assets/customers/*`
- Create: `public/assets/guards/*`
- Create: `public/assets/characters/community/*`
- Create: `public/assets/characters/incidents/*`
- Test: `tests/unit/customer-content.test.ts`

**Interfaces:**
- 10 gameplay archetypes, roughly 24–32 appearance variants.
- Mood states: happy, neutral, waiting, impatient, angry, delighted.

- [ ] Write failing archetype/variant/mood coverage tests.
- [ ] Produce original variants without protected-class or socioeconomic thief stereotypes.
- [ ] Produce three visually distinct guards plus fictionalized tax/community-safety NPCs.
- [ ] Validate manifest/content.
- [ ] Commit: `art: complete customer and incident characters`.

### Task 5: Complete campaign expression/cutscene/ending media

**Files:**
- Create: `public/assets/story/*`
- Create: `public/assets/endings/*`
- Modify: `src/client/assets/manifest.ts`
- Test: `tests/unit/story-assets.test.ts`

**Interfaces:**
- Every story event that declares a required portrait/scene references an existing manifest ID.

- [ ] Write failing coverage test across 30-day story data.
- [ ] Produce required Joy/JD/husband expressions and ending/album assets using locked identities.
- [ ] Add Day 25 husband-apron payoff and Day 30 finale visual states.
- [ ] Validate.
- [ ] Commit: `art: complete campaign and ending media`.

### Task 6: Complete Vietnamese/English localization

**Files:**
- Create: `src/client/i18n/vi.ts`
- Create: `src/client/i18n/en.ts`
- Create: `src/client/i18n/i18n.ts`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/e2e/localization.spec.ts`

**Interfaces:**
- `t(key: TranslationKey, params?: Record<string, string | number>): string`.
- No renderer contains campaign dialogue literals except development/test copy.

- [ ] Write failing key parity test and raw-key rendering test.
- [ ] Move all UI/dialogue/error/ending/account copy to keys.
- [ ] Add English translations preserving tone rather than literal legal claims.
- [ ] E2E switch language and traverse representative story/market/debt/ending screens.
- [ ] Commit: `feat: complete vietnamese and english localization`.

### Task 7: Implement audio buses/controllers and production audio set

**Files:**
- Create: `src/client/audio/AudioMixer.ts`
- Create: `src/client/audio/GrillAudioController.ts`
- Create: `src/client/data/audioManifest.ts`
- Create: `public/audio/*`
- Create: `CREDITS.md`
- Test: `tests/unit/audio-controller.test.ts`

**Interfaces:**
- Buses: master, music, ambience, sfx, ui.
- `AudioMixer.setBusVolume(bus, value)`, `setMuted(boolean)`.
- Grill controller exposes one intensity-managed loop, not one loop per meat sprite.

- [ ] Write failing tests for bus volume clamp, mute, visibility pause/resume and singular grill loop.
- [ ] Add original/licensed ambience/SFX/music with license metadata.
- [ ] Implement controllers.
- [ ] Verify PASS.
- [ ] Commit: `feat: add bounded production audio system`.

### Task 8: Implement asset bundles, lazy loading and media performance limits

**Files:**
- Create: `src/client/assets/bundles.ts`
- Create: `src/client/assets/AssetLoader.ts`
- Modify: `src/client/game/scenes/BootScene.ts`
- Test: `tests/unit/asset-loader.test.ts`
- Test: `tests/e2e/dynamic-asset-load.spec.ts`

**Interfaces:**
- Bundles: boot, stall-core, characters-core, dynamic-security, story-day-range, endings.
- `AssetLoader.ensureBundle(bundleId): Promise<void>`.

- [ ] Write failing tests that dynamic security event waits for its bundle and missing asset rejects with a controlled error rather than silent 404.
- [ ] Implement deduplicated bundle loading/cache.
- [ ] Add size threshold warnings to validator.
- [ ] Verify PASS.
- [ ] Commit: `perf: add lazy production asset bundles`.

### Task 9: Run content/media completion gate

**Files:**
- Create: `docs/art/manual-qa-checklist.md`
- Create: `tests/e2e/content-smoke.spec.ts`

- [ ] Run `npm run validate:assets && npm run validate:content`; expected zero errors.
- [ ] Run representative E2E for Day 1, mid-campaign security/books, Day 30 ending in both locales.
- [ ] Manually review identity, perspective, no watermark/text corruption, no placeholder media, mobile crop.
- [ ] Record any remaining licensed assets in CREDITS.
- [ ] Commit: `test: complete content and media gate`.
