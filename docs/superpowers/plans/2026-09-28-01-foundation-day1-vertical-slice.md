# Foundation + Day 1 Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a production-quality, local-first Day 1 vertical slice from New Game through Day Summary with responsive stall interaction, cooking, plating, customers, overlays, and versioned local save.

**Architecture:** Establish the strict TypeScript/Vite/Phaser shell first, then keep simulation rules as pure domain functions and rendering as adapters. The Day 1 slice uses the final state/store/save/overlay contracts so later systems extend rather than replace the foundation.

**Tech Stack:** TypeScript 5.8+, Phaser 3.90, Vite 7, Vitest 3, Playwright 1.55, jsdom 27, vanilla DOM/CSS, ES2022.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- No React.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Desktop composition: grill-left, display-center, rice-right, plating-bottom.
- Mobile uses focus anchors.
- One blocking overlay at a time.
- Vietnamese default; English-ready key-based UI strings from the start.
- Story Mode must not depend on a server.
- Day 1 must contain no production placeholder emoji in the final vertical-slice review.

## Review Focus

1. Page reload during a safe phase restores the same Day 1 state.
2. Opening/closing every overlay restores canvas pointer interaction.
3. Mobile at 360px width has no horizontal page scroll and can focus all four stations.
4. Grill state and rendered food state cannot disagree after flip/overcook.
5. Serving an invalid plate cannot mutate cash/customer completion as if it were correct.

---

### Task 1: Scaffold the strict application and test toolchain

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `tsconfig.worker.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `index.html`
- Create: `src/client/main.ts`
- Test: `tests/unit/bootstrap.test.ts`

**Interfaces:**
- Produces npm scripts: `dev`, `build`, `typecheck`, `lint`, `test`, `test:run`, `test:e2e`.
- Produces browser root elements `#app`, `#game-root`, and `#ui-root`.

- [ ] **Step 1: Write the failing bootstrap test**

Assert that `index.html` exposes the three root elements and `package.json` exposes every required script.

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- tests/unit/bootstrap.test.ts`  
Expected: FAIL because scaffold files/scripts do not yet exist.

- [ ] **Step 3: Create the toolchain**

Use the approved historical dependency floor: Phaser `^3.90.0`, TypeScript `^5.8.3`, Vite `^7.1.7`, Vitest `^3.2.4`, Playwright `^1.55.1`, jsdom `^27.0.0`, ESLint 9.x and Wrangler 4.x-compatible worker typings.

- [ ] **Step 4: Verify**

Run: `npm ci && npm run typecheck && npm run lint && npm run test:run && npm run build`  
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.worker.json vite.config.ts eslint.config.js vitest.config.ts playwright.config.ts index.html src/client/main.ts tests/unit/bootstrap.test.ts
git commit -m "chore: scaffold strict game application"
```

### Task 2: Define shared state, day phases, seeded RNG, and store

**Files:**
- Create: `src/shared/types/game-state.ts`
- Create: `src/shared/types/core.ts`
- Create: `src/shared/random/seededRandom.ts`
- Create: `src/client/state/createInitialState.ts`
- Create: `src/client/state/GameStore.ts`
- Test: `tests/unit/state-foundation.test.ts`

**Interfaces:**
- Produces `Difficulty`, `DayPhase`, `GameState`.
- Produces `createInitialState(difficulty: Difficulty, runSeed: string): GameState`.
- Produces `createSeededRandom(seed: string): SeededRandom` with `next(): number` and `int(min: number, max: number): number`.
- Produces `GameStore` with `getState()`, `dispatch(action)`, `subscribe(listener)`, and `replaceState(state)`.

- [ ] **Step 1: Write failing tests**

Test exact initial values for day 1, phase `morning`, requested difficulty, run seed, zero active overlays, and deterministic RNG output for identical seeds.

- [ ] **Step 2: Verify failure**

Run: `npm test -- tests/unit/state-foundation.test.ts`  
Expected: FAIL on missing types/functions.

- [ ] **Step 3: Implement the state/store foundation**

Create a complete domain-shaped `GameState` now, even where later-plan domain values begin with minimal defaults, so later plans add behavior without replacing the root schema.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/unit/state-foundation.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared src/client/state tests/unit/state-foundation.test.ts
git commit -m "feat: add deterministic game state foundation"
```

### Task 3: Build the Phaser stall shell and responsive camera anchors

**Files:**
- Create: `src/client/game/Game.ts`
- Create: `src/client/game/scenes/BootScene.ts`
- Create: `src/client/game/scenes/StallScene.ts`
- Create: `src/client/game/layout/stallLayout.ts`
- Create: `src/client/game/camera/StationCamera.ts`
- Create: `src/client/styles/app.css`
- Modify: `src/client/main.ts`
- Test: `tests/unit/stall-layout.test.ts`
- Test: `tests/e2e/stall-responsive.spec.ts`

**Interfaces:**
- Produces `StationId = "grill" | "display" | "plating" | "customers"`.
- Produces `getStallLayout(viewportWidth: number, viewportHeight: number): StallLayout`.
- Produces `StationCamera.focus(station: StationId): void`.

- [ ] **Step 1: Write failing layout tests**

Assert desktop station order and mobile focus anchors. Assert the four anchor rectangles do not collapse to zero size.

- [ ] **Step 2: Verify failure**

Run: `npm test -- tests/unit/stall-layout.test.ts`.

- [ ] **Step 3: Implement scene/layout/camera**

Use neutral generated/local art slots only as development backing if production Day 1 media is not yet available, but preserve the final spatial hierarchy and stable asset IDs.

- [ ] **Step 4: Add E2E responsive assertions**

At 1280×720 assert full-stall mode. At 390×844 and 360×800 assert station navigation works and `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run && npm run test:e2e -- tests/e2e/stall-responsive.spec.ts`  
Expected: PASS.

Commit: `feat: add responsive stall shell`.

### Task 4: Implement grill cooking as a pure state machine

**Files:**
- Create: `src/shared/types/cooking.ts`
- Create: `src/client/game/systems/cooking/cookingModel.ts`
- Create: `src/client/game/interactions/GrillInteraction.ts`
- Test: `tests/unit/cooking-model.test.ts`

**Interfaces:**
- Produces `CookStage = "raw" | "cooking-a" | "ready-to-flip" | "cooking-b" | "perfect" | "overcooked" | "burnt"`.
- Produces `advanceCook(item: GrillItemState, dtMs: number, heat: number): GrillItemState`.
- Produces `flipCookItem(item: GrillItemState): GrillItemState`.
- Produces `createGrillItem(proteinId: string): GrillItemState`.

- [ ] **Step 1: Write failing tests**

Cover raw→ready-to-flip, valid flip, perfect window, overcook, burn, repeated invalid flip, and deterministic advancement from equal inputs.

- [ ] **Step 2: Verify failure**

Run: `npm test -- tests/unit/cooking-model.test.ts`.

- [ ] **Step 3: Implement pure model then adapter**

Keep Phaser sprite changes in `GrillInteraction`; the model itself must not import Phaser.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/unit/cooking-model.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add grill cooking state machine`.

### Task 5: Implement plate assembly, orders, and customer lifecycle

**Files:**
- Create: `src/shared/types/orders.ts`
- Create: `src/client/game/systems/orders/plateValidator.ts`
- Create: `src/client/game/systems/customers/customerQueue.ts`
- Create: `src/client/data/day1Recipes.ts`
- Create: `src/client/data/day1Customers.ts`
- Test: `tests/unit/plate-validator.test.ts`
- Test: `tests/unit/customer-queue.test.ts`

**Interfaces:**
- Produces `validatePlate(order: OrderDefinition, plate: PlateAssembly): ServeScore`.
- Produces `createCustomerTicket(input: CreateTicketInput): CustomerTicket`.
- Produces `advanceCustomerQueue(state: CustomerQueueState, dtMs: number): CustomerQueueState`.
- `ServeScore` contains `accuracy`, `cookQuality`, `speed`, `presentation`, and `accepted`.

- [ ] **Step 1: Write failing plate tests**

Cover correct cơm sườn, missing component, wrong protein, burnt protein, extra component, and exact accepted threshold behavior.

- [ ] **Step 2: Write failing customer tests**

Cover spawn→queue→waiting, patience expiry, successful serve→pay→leave, and ensure rejected plate does not mark the customer paid.

- [ ] **Step 3: Implement minimal domain logic**

Keep all dish composition data outside the validator.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/unit/plate-validator.test.ts tests/unit/customer-queue.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add plating and customer lifecycle`.

### Task 6: Build HUD, OverlayManager, Morning Brief, and Day Summary shell

**Files:**
- Create: `src/client/ui/OverlayManager.ts`
- Create: `src/client/ui/hud/Hud.ts`
- Create: `src/client/ui/morning/MorningBrief.ts`
- Create: `src/client/ui/daySummary/DaySummary.ts`
- Create: `src/client/ui/stations/MobileStationNav.ts`
- Create: `src/client/styles/ui.css`
- Test: `tests/unit/overlay-manager.test.ts`
- Test: `tests/e2e/overlays.spec.ts`

**Interfaces:**
- Produces `OverlayManager.open(id, content, options): void`, `close(id): void`, `closeTop(): void`, `getBlockingCount(): number`.
- Only `OverlayManager` may create blocking UI layers.

- [ ] **Step 1: Write failing jsdom tests**

Assert a second blocking overlay replaces/queues according to the chosen single-blocking rule, Escape closes closable overlays, focus is restored, and blocking count returns to zero.

- [ ] **Step 2: Verify failure**

Run: `npm test -- tests/unit/overlay-manager.test.ts`.

- [ ] **Step 3: Implement UI shells**

Use semantic buttons and focus-visible styles. Morning Brief and Day Summary may initially show only Day 1 data/state.

- [ ] **Step 4: Add browser regression test**

Open/close Morning Brief and Day Summary; assert canvas receives pointer interaction afterward.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run && npm run test:e2e -- tests/e2e/overlays.spec.ts`  
Expected: PASS.

Commit: `feat: add safe game overlays and day UI`.

### Task 7: Add versioned local save and safe resume

**Files:**
- Create: `src/client/state/saveSchema.ts`
- Create: `src/client/state/localSave.ts`
- Create: `src/client/state/migrations.ts`
- Test: `tests/unit/local-save.test.ts`
- Test: `tests/fixtures/save-v1.json`

**Interfaces:**
- Produces `SaveEnvelope`.
- Produces `saveLocal(state: GameState, storage?: Storage): SaveEnvelope`.
- Produces `loadLocal(storage?: Storage): GameState | null`.
- Produces `migrateSave(envelope: unknown): SaveEnvelope`.
- Current initial schema version: `1`.

- [ ] **Step 1: Write failing tests**

Cover round trip, invalid JSON, unsupported future schema, v1 fixture migration path, and safe normalization of a mid-service save to a resumable checkpoint.

- [ ] **Step 2: Verify failure**

Run: `npm test -- tests/unit/local-save.test.ts`.

- [ ] **Step 3: Implement save/migration**

Persist at safe phase boundaries and a resume snapshot; never require a network call to load.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/unit/local-save.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add versioned local saves`.

### Task 8: Wire the complete Day 1 vertical slice and browser gate

**Files:**
- Create: `src/client/campaign/DayRunner.ts`
- Create: `src/client/data/campaignDays.ts`
- Modify: `src/client/main.ts`
- Modify: `src/client/game/scenes/StallScene.ts`
- Test: `tests/e2e/day1.spec.ts`
- Test: `tests/e2e/reload-resume.spec.ts`

**Interfaces:**
- Produces `DayRunner.startDay(day: number): void`, `setPhase(phase: DayPhase): void`, `completeDay(): void`.
- Day 1 phase order exactly matches the approved canonical loop.

- [ ] **Step 1: Write failing Day 1 E2E**

Cover New Game → Normal → Morning Brief → Prep → Service → cook/flip → assemble/serve → Closing → Summary.

- [ ] **Step 2: Write failing reload test**

Save at a safe mid-day checkpoint, reload the page, and assert the same day/progress resumes without `/api` dependency.

- [ ] **Step 3: Wire the vertical slice**

Connect existing pure models to Phaser/DOM; do not add economy or Director features ahead of Plan 02/04.

- [ ] **Step 4: Verify full gate**

Run: `npm run typecheck && npm run lint && npm run test:run && npm run build && npm run test:e2e`  
Expected: PASS with zero uncaught browser errors in Day 1 tests.

- [ ] **Step 5: Commit**

Commit: `feat: complete Day 1 vertical slice`.
