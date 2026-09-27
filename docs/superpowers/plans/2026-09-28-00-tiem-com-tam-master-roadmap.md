# Tiệm Cơm Tấm Master Implementation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved 30-day Cơm Tấm Sài Gòn management game as a production-ready TypeScript/Phaser/Cloudflare web game, with complete authored content, media, offline Story Mode, cloud/online modes, and release evidence.

**Architecture:** Build the product as seven sequential, independently reviewable implementation plans. The browser remains local-first: Phaser owns the live stall and direct manipulation, DOM/CSS owns management UI, pure domain systems own simulation, the Living Stall Director orchestrates events without mutating domains directly, and the Worker owns only networked capabilities.

**Tech Stack:** TypeScript 5.8+, Phaser 3.90, Vite 7, Vitest 3, Playwright 1.55, vanilla DOM/CSS, Cloudflare Workers 4.x, D1, ES2022, PWA/service worker.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- No React.
- Vietnamese is the default locale; English must cover all user-facing content.
- Story Mode must remain playable offline after an initial successful load.
- Desktop stall composition is locked: grill-left, food-display-center, rice-right, plating-bottom.
- Mobile uses focus anchors, not a shrunken desktop scene.
- One blocking overlay at a time; no stuck invisible overlays.
- JD has no explicit age and may only perform safe child-appropriate tasks.
- Tax/police/legal content is gameified, not current legal guidance.
- No live Cloudflare production deployment without separate owner authorization.
- No production placeholder emoji/media, missing asset references, or runtime asset 404s.
- Day 1 must pass the vertical-slice quality gate before mass-producing campaign media.
- Implementation follows TDD, small focused files, DRY/YAGNI, and frequent commits.
- Do not claim completion when a required verification command was not run.

## Review Focus

1. **Resume after browser close/network loss** — Story state must restore safely without requiring `/api/auth/me`; Plan 01 and Plan 05 own tests.
2. **Overlapping events and popup deadlocks** — Director and OverlayManager must never leave two blocking interactions active; Plan 01, 03, and 04 own tests.
3. **Economy soft-lock near debt milestones** — fail-forward paths must keep the campaign playable without free money; Plan 02 and Plan 07 own simulation tests.
4. **Cross-system event prerequisites** — events cannot offer camera/guard/JD actions when unavailable; Plan 03 and Plan 04 own eligibility/fuzz tests.
5. **Content/media drift** — missing dialogue keys, recipe references, or generated assets must fail validation before release; Plan 06 and Plan 07 own validators.

---

## Plan Sequence

### Plan 01 — Foundation + Day 1 Vertical Slice

**File:** `docs/superpowers/plans/2026-09-28-01-foundation-day1-vertical-slice.md`

Produces a complete playable Day 1 with:

- repository/toolchain;
- shared types and state;
- seeded RNG;
- Phaser stall shell;
- responsive camera anchors;
- cooking;
- plating/order validation;
- customer queue;
- HUD/OverlayManager;
- minimal Morning Brief and Day Summary;
- versioned local save;
- Day 1 E2E.

**Exit gate:** Day 1 can be played from New Game through Day Summary, closed, reloaded, and resumed without console errors or popup lock.

### Plan 02 — Economy + Management Systems

**File:** `docs/superpowers/plans/2026-09-28-02-economy-management-systems.md`

Adds:

- ledger/economy;
- inventory/freshness;
- deterministic market and suppliers;
- debt reserve/installments;
- pricing/tips/difficulty;
- upgrades/modifiers;
- JD progression;
- family/reputation metrics.

**Exit gate:** the Day 1 loop is now economically meaningful and deterministic; debt, market, JD, books and upgrades are testable without Phaser.

### Plan 03 — Security + Neighborhood + Incident Systems

**File:** `docs/superpowers/plans/2026-09-28-03-security-neighborhood-incident-systems.md`

Adds:

- security score/equipment;
- guards/shifts;
- theft state machine;
- Neighborhood Trust;
- community/police follow-up;
- bookkeeping discrepancies/inspection model;
- incident coordinator;
- slow-time contextual actions.

**Exit gate:** a representative theft/missing-item/books incident can run end-to-end and resolve through available equipment/people without invalid choices.

### Plan 04 — Living Stall Director + 30-Day Campaign + Endings

**File:** `docs/superpowers/plans/2026-09-28-04-living-stall-director-campaign-endings.md`

Adds:

- data-driven events;
- stress/event budgets;
- weighted seeded selection;
- consequence engine;
- 30 authored campaign days;
- 12 major decisions;
- journal;
- six endings;
- Day 31 Endless transition;
- Director inspector/fuzz tests.

**Exit gate:** a fast-forward simulation can traverse Day 1 through Day 30, resolve a deterministic ending, and continue into Day 31.

### Plan 05 — Cloud + Online + PWA

**File:** `docs/superpowers/plans/2026-09-28-05-cloud-online-pwa.md`

Adds:

- modular Worker router;
- D1 schema;
- secure auth/session cookies;
- cloud save with revision conflicts;
- Daily Challenge/run tokens;
- leaderboards;
- Endless run endpoints;
- client API wrappers;
- offline-first PWA/update behavior.

**Exit gate:** local Story Mode stays independent of server availability while authenticated cloud/online flows pass local Worker/D1 E2E tests.

### Plan 06 — Full Content + Media + Localization + Audio

**File:** `docs/superpowers/plans/2026-09-28-06-content-media-localization-audio.md`

Adds:

- asset manifest/validator;
- production Day 1 art;
- full food/character/customer/guard/event media;
- 25 recipes/23 ingredients/10 archetypes;
- VI/EN copy coverage;
- audio buses and sound/music assets;
- asset bundles/lazy loading;
- content/media QA.

**Exit gate:** no placeholder production media remains and all content/asset/localization validators pass.

### Plan 07 — Balance + QA + Release

**File:** `docs/superpowers/plans/2026-09-28-07-balance-qa-release.md`

Adds:

- campaign simulation;
- Director fuzzing;
- save/offline/conflict regression suite;
- responsive/overlay/accessibility tests;
- performance/memory/audio QA;
- zero-404/content release checks;
- CI;
- README/deploy docs;
- final verification report.

**Exit gate:** release criteria in the approved spec are evidenced, not assumed.

---

## Cross-Plan Contracts

The following names are stable across every plan.

### Shared core

- `Difficulty = "easy" | "normal" | "hard"`
- `DayPhase = "morning" | "market" | "prep" | "story" | "opening" | "service" | "closing" | "books" | "family" | "summary"`
- `GameState` in `src/shared/types/game-state.ts`
- `createInitialState(difficulty: Difficulty, runSeed: string): GameState`
- `createSeededRandom(seed: string): SeededRandom`
- `GameStore` in `src/client/state/GameStore.ts`
- `SaveEnvelope` with `schemaVersion`, `revision`, `updatedAt`, and `state`.

### Event layer

- `EventDefinition` in `src/shared/types/events.ts`
- `selectEvent(input: EventSelectionInput): EventDefinition | null`
- `applyConsequences(state: GameState, consequences: Consequence[]): GameState`
- `resolveEnding(state: GameState): EndingId`

### Server API

All network endpoints are under `/api/v1/`.

Cloud save uses optimistic revision control; stale writes return HTTP 409.

### Release commands

The repository must provide scripts equivalent to:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run db:local
npm run test:e2e
```

---

## Milestone Review Rule

After each plan:

- [ ] Run that plan's required unit/integration/E2E checks.
- [ ] Confirm its exit gate manually where browser behavior is involved.
- [ ] Commit only the reviewed deliverable.
- [ ] Do not start mass content/media work before Plan 01 is visually accepted.
- [ ] Do not tune final economy before Plan 04 campaign flow is complete.
- [ ] Do not prepare a release tag before Plan 07 is complete.
