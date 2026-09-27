# Balance + QA + Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the complete game meets economy, Director, save, responsive, accessibility, performance, content, CI and release gates, and produce an evidence-based release report.

**Architecture:** Add headless simulation/fuzz harnesses for systems that cannot be validated by manual play alone, then layer Playwright regression suites and CI. Final balance values are changed only in centralized data and are justified by simulation plus representative manual play.

**Tech Stack:** Existing application stack, Vitest, Playwright, GitHub Actions, Wrangler local D1.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- Release has 0 Blocker, 0 Critical, 0 Major known bugs.
- Runtime asset 404s, uncaught JS errors and unhandled rejections are 0 in release browser checks.
- Required commands must actually run; unavailable steps are reported as NOT RUN.
- Hard difficulty may be difficult but not impossible except by exploit.
- No live Cloudflare production deploy in this plan.

## Review Focus

1. Simulation result distribution matches intended Easy/Normal/Hard difficulty instead of only one lucky seed.
2. Long runs do not leak listeners/audio/customers/textures.
3. Overlay/accessibility options remain correct under mobile and timed-event stress.
4. Offline/update/cloud conflict paths survive release build, not just dev server.
5. Final report distinguishes PASS from NOT RUN/PENDING OWNER ACTION.

---

### Task 1: Build headless campaign simulation harness

**Files:**
- Create: `scripts/simulate-campaign.ts`
- Create: `tests/helpers/strategies/{poor,average,good,optimized}.ts`
- Create: `tests/integration/economy-simulation.test.ts`
- Modify: `package.json`

**Interfaces:**
- Script `npm run simulate:campaign -- --runs 10000 --difficulty normal`.
- Result summarizes debt completion, ending distribution, average profit, shortfall and rescue frequency.

- [ ] Write failing simulation smoke test for deterministic output with fixed seed set.
- [ ] Implement four strategies using production pure systems, no Phaser.
- [ ] Run at least thousands of runs per difficulty; inspect distributions.
- [ ] Tune only centralized balance files until Easy/Normal/Hard targets from spec are met without guaranteed wins.
- [ ] Commit: `test: add campaign balance simulation`.

### Task 2: Expand Director fuzz and invariant suite

**Files:**
- Modify: `tests/integration/director-fuzz.test.ts`
- Create: `scripts/fuzz-director.ts`

**Interfaces:**
- Script generates at least tens of thousands of valid/randomized state combinations.

- [ ] Add invariants for stress, mutex groups, cooldowns, unlock capabilities, JD availability, day range, completed chains, budget exhaustion.
- [ ] Run fuzz test with reproducible failure seed output.
- [ ] Fix production guard logic only where invariants fail.
- [ ] Re-run until zero failures.
- [ ] Commit: `test: harden director invariants`.

### Task 3: Complete save, migration, offline and conflict regressions

**Files:**
- Create: `tests/fixtures/saves/day10.json`
- Create: `tests/fixtures/saves/day29.json`
- Create: `tests/fixtures/saves/endless.json`
- Create/Modify: `tests/e2e/save-regressions.spec.ts`
- Modify: `tests/e2e/offline-story.spec.ts`
- Modify: `tests/e2e/cloud-conflict.spec.ts`

- [ ] Add restore assertions for cash, inventory, JD, Director cooldowns, flags, journal, debt and safe cooking state.
- [ ] Add old-schema migration fixture and future-schema rejection.
- [ ] Run release build offline test and two-device conflict.
- [ ] Fix only failing persistence boundaries.
- [ ] Commit: `test: lock save and offline regressions`.

### Task 4: Complete responsive, overlay and accessibility browser suite

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/viewports.spec.ts`
- Modify: `tests/e2e/overlays.spec.ts`

**Interfaces:**
- Viewports: 1152×648, 1280×720, 1440×900, 390×844, 360×800.

- [ ] Assert desktop stall hierarchy at all desktop viewports.
- [ ] Assert no horizontal scroll and one-action station navigation on mobile.
- [ ] Sequentially open/close Settings, JD, Market, Debt, Books, Dialogue, Event and verify zero blocking overlays/focus restoration.
- [ ] Test keyboard focus, ARIA labels, reduced motion, Auto Pause, Extra Slow Time and No Timed Decisions.
- [ ] Commit: `test: add responsive overlay and accessibility gate`.

### Task 5: Add performance, memory and audio soak checks

**Files:**
- Create: `tests/e2e/performance.spec.ts`
- Create: `tests/e2e/soak.spec.ts`
- Create: `docs/qa/performance-baseline.md`

**Interfaces:**
- Test stress scene: full queue + full grill + smoke + rain + security event + overlay.
- Soak advances many accelerated days.

- [ ] Capture desktop/mobile frame timing baseline and ensure no catastrophic regression from target ~60 desktop/~30 mobile.
- [ ] Assert customer/listener/audio instance counts return near baseline after repeated days.
- [ ] Assert one music track and bounded grill loop behavior.
- [ ] Fix leaks before documenting baseline.
- [ ] Commit: `perf: verify game soak stability`.

### Task 6: Enforce content, zero-404 and console-error release gate

**Files:**
- Create: `tests/e2e/release-console.spec.ts`
- Modify: `scripts/validate-assets.mjs`
- Modify: `scripts/validate-content.mjs`

- [ ] Fail the test on pageerror, unhandled rejection, failed asset request, missing translation, missing campaign day/recipe/ingredient/ending reference.
- [ ] Traverse Day 1 fixture, mid-campaign fixture, security/books event and ending fixture.
- [ ] Run validators and browser test against production build.
- [ ] Fix all release-gate failures.
- [ ] Commit: `test: enforce zero error release gate`.

### Task 7: Create CI release workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/e2e.yml`

**Interfaces:**
- CI stages: install → typecheck → lint → unit/integration → content/assets validation → build.
- E2E is a separate required release job.

- [ ] Add workflow syntax test/lint if available locally.
- [ ] Configure npm cache and Playwright install.
- [ ] Ensure failing tests are not ignored and no deployment step is included.
- [ ] Push branch/commit and confirm workflows green.
- [ ] Commit: `ci: add release quality gates`.

### Task 8: Complete README and Cloudflare preparation docs

**Files:**
- Create/Modify: `README.md`
- Create: `docs/deployment/cloudflare.md`
- Create: `docs/architecture/overview.md`

**Interfaces:**
- New developer can clone, install, test, build, apply local D1 migration, and start local Worker using docs alone.

- [ ] Document game/stack/local setup/scripts/architecture/content pipeline/PWA/D1.
- [ ] Document Worker target `tiem-com-tam`, D1 target `tiem-com-tam`, optional domain `comtam.aunomay.com`, and `REPLACE_WITH_D1_DATABASE_ID` owner action.
- [ ] Explicitly mark live deploy as not run without authorization.
- [ ] Verify docs commands against a clean install.
- [ ] Commit: `docs: add production setup and deployment guide`.

### Task 9: Run final release verification and write evidence report

**Files:**
- Create: `docs/qa/release-verification.md`
- Create: `docs/qa/known-issues.md`

**Interfaces:**
- Report fields: repo, commit, build, typecheck, lint, unit/integration, E2E, campaign 30/30, content counts, visual QA, console errors, asset 404s, D1 local, production deploy status, known issues.

- [ ] Run: `npm ci`.
- [ ] Run: `npm run typecheck && npm run lint && npm run test:run && npm run validate:assets && npm run validate:content && npm run build && npm run db:local && npm run test:e2e`.
- [ ] Run final simulation/fuzz commands and browser visual review.
- [ ] Record PASS/FAIL/NOT RUN exactly; do not soften missing evidence.
- [ ] Commit: `release: record v1 verification evidence`.
