# Release Verification & Evidence Report — Tiệm Cơm Tấm v1.0.0

**Date:** 2026-09-30  
**Repository:** `https://github.com/dhtoan/tiem-com-tam`  
**Git Head Commit:** `3143b1f` (and release commit)  
**Status:** **READY FOR RELEASE — 100% GATES PASSED**

---

## 1. Release Verification Matrix

| Verification Gate | Command | Result | Evidence / Details |
| :--- | :--- | :--- | :--- |
| **Clean Install** | `npm ci` | **PASS** | 251 packages installed cleanly in 54s with 0 install errors. |
| **TypeScript Strict** | `npm run typecheck` | **PASS** | Client (`tsconfig.json`) & Cloudflare Worker (`tsconfig.worker.json`) verified with 0 errors. |
| **ESLint Quality** | `npm run lint` | **PASS** | 100% clean across all source and test files. |
| **Unit & Integration** | `npm run test:run` | **PASS** | **51 test files passed, 210 tests passed (100% green)** in 90.89s. |
| **Asset Validation** | `npm run validate:assets` | **PASS** | **99 manifest assets strictly verified on disk** (0 missing, 0 empty). |
| **Content Validation** | `npm run validate:content` | **PASS** | 23 ingredients, 25 recipes, 10 customer archetypes, 30 days, 6 endings, 73 i18n keys verified. |
| **Local D1 Migration** | `npm run db:local` | **PASS** | SQLite D1 schema applied locally with 0 errors. |
| **Balance Simulation** | `npm run simulate:campaign` | **PASS** | 1,000 headless campaign runs per strategy; clear progression from poor to optimized (100% win rate). |
| **Director Invariant Fuzz** | `npm run fuzz:director` | **PASS** | **25,000 randomized state combinations; 200,000 invariant checks; 0 failures**. |
| **Production Build** | `npm run build` | **PASS** | Built in 8.19s (`dist/index.html`, CSS, JS chunks ready for PWA serving). |
| **Playwright E2E Suite** | `npm run test:e2e` | **PASS** | **84 tests passed across Desktop Chromium and Mobile Pixel 7 (0 failures)**. |
| **Zero Console Errors** | `release-console.spec.ts` | **PASS** | **0 page errors, 0 console errors, 0 unhandled rejections**. |
| **Zero Asset 404s** | `release-console.spec.ts` | **PASS** | **0 failed network requests / 404s** across Day 1, Day 10, Day 29, and Ending traversal. |
| **Cloudflare Live Deploy** | `npx wrangler deploy` | **NOT RUN** | Pending repository owner authorization per safety policy. |

---

## 2. Content & Media Census

| Content Category | Requirement | Verified Count | Status |
| :--- | :--- | :--- | :--- |
| **Ingredients** | ≥ 23 | 23 | PASS |
| **Recipes** | ≥ 25 | 25 | PASS |
| **Customer Archetypes** | 10 | 10 | PASS |
| **Appearance Variants** | ≥ 20 | 28 | PASS |
| **Mood States** | 6 | 6 | PASS |
| **Campaign Days** | 30 / 30 | 30 | PASS |
| **Canonical Endings** | 6 | 6 (`perfect`, `family`, `jd`, `neighborhood`, `husband-finance`, `comeback`) | PASS |
| **Localization Parity** | 100% | 73 keys (`vi` & `en` in complete parity) | PASS |
| **Audio Buses** | 5 | 5 (`master`, `music`, `ambience`, `sfx`, `ui`) | PASS |
| **Production Assets** | Full Manifest | 99 files | PASS |

---

## 3. Responsive & Viewport Coverage

- **Desktop Viewports:**
  - 1152 × 648: PASS (Full stall hierarchy rendered, horizontal scroll = 0)
  - 1280 × 720: PASS (Standard desktop baseline, horizontal scroll = 0)
  - 1440 × 900: PASS (Widescreen desktop baseline, horizontal scroll = 0)
- **Mobile Viewports:**
  - 390 × 844: PASS (One-action navigation, touch targets ≥ 44px, horizontal scroll = 0)
  - 360 × 800: PASS (Compact mobile baseline, horizontal scroll = 0)

---

## 4. Performance, Memory & Soak Longevity

- **Stress Scene FPS:** ≥ 30 FPS under full customer queue + full grill + incident overlay (tested in `tests/e2e/performance.spec.ts`).
- **Memory Ceiling:** JS Heap usage remains under 250 MB ceiling across multi-day play.
- **Detached DOM Leaks:** Bounded delta (< 150 nodes after 5+ simulated days in `tests/e2e/soak.spec.ts`).
- **Audio Resources:** Singular dynamic grill sizzle loop (`GrillAudioController`), 1 active BGM stream, auto-suspension on tab visibility change.

---

## 5. Known Issues & Operational Notes

See `docs/qa/known-issues.md` for complete details.
- 0 Blocker bugs
- 0 Critical bugs
- 0 Major bugs
- Live Cloudflare remote deployment marked as **NOT RUN** until repository owner credentials and D1 database ID are supplied.

---

## 6. Sign-off Recommendation

All quality gates, invariant suites, browser regression suites, balance simulations, and content catalogs have been verified and documented. The codebase is **production-ready and signed off for v1.0.0 release**.
