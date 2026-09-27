# Living Stall Director + 30-Day Campaign + Endings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the data-driven Living Stall Director, authored 30-day Joy/JD/husband campaign, decision memory, six endings, and Day 31 Endless transition.

**Architecture:** Event selection is a deterministic pure layer over GameState; conditions/effects are serializable data, while ConsequenceEngine delegates mutations to domain systems. Mandatory story beats never depend on RNG. Dynamic events use event/stress budgets, cooldowns, repetition penalties and seeded selection.

**Tech Stack:** Existing Plans 01–03 stack.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- Exactly one required authored story beat per Day 1–30.
- Major dynamic events cannot stack during extreme player stress.
- Story choices have immediate/delayed/systemic/narrative effects.
- Day 10/20 misses do not end the run.
- Day 30 resolves one deterministic ending.
- Every ending can continue to Endless.
- No runtime AI is required for dialogue.

## Review Focus

1. Same seed/state chooses the same dynamic event.
2. Future-day story events never appear early.
3. Event cooldown/max-per-run/chain completion are respected after save/reload.
4. Multiple ending conditions resolve by a fixed priority.
5. Day 30 cannot end with no ending or a dead-end Continue button.

---

### Task 1: Define serializable event, condition and consequence schemas

**Files:**
- Create: `src/shared/types/events.ts`
- Create: `src/client/director/conditions.ts`
- Test: `tests/unit/event-schema.test.ts`

**Interfaces:**
- `EventDefinition`, `EventChoice`, `StateCondition`, `Consequence`, `TimeBehavior`.
- `evaluateCondition(condition: StateCondition, state: GameState): boolean`.
- Supported condition operators are explicit and finite; no eval/string code execution.

- [ ] Write failing schema/condition tests for metric comparisons, flags, capability checks, day range and phase.
- [ ] Verify failure.
- [ ] Implement typed serializable conditions.
- [ ] Verify PASS.
- [ ] Commit: `feat: define director event schema`.

### Task 2: Implement EventBudget, StressBudget and seeded EventSelector

**Files:**
- Create: `src/client/director/EventBudget.ts`
- Create: `src/client/director/StressBudget.ts`
- Create: `src/client/director/EventSelector.ts`
- Test: `tests/unit/event-selector.test.ts`

**Interfaces:**
- `calculateStress(state: GameState): number`.
- `createDailyEventBudget(day: number, difficulty: Difficulty): EventBudget`.
- `selectEvent(input: EventSelectionInput): EventDefinition | null`.

- [ ] Write failing tests for budget exhaustion, high-stress major-event suppression, cooldown, repetition penalty, max-per-run, mutex groups and deterministic seed.
- [ ] Verify failure.
- [ ] Implement weighted selection using only `createSeededRandom`.
- [ ] Verify PASS.
- [ ] Commit: `feat: add living stall event selector`.

### Task 3: Implement ConsequenceEngine and delayed follow-ups

**Files:**
- Create: `src/client/director/ConsequenceEngine.ts`
- Create: `src/client/director/followUps.ts`
- Test: `tests/unit/consequence-engine.test.ts`

**Interfaces:**
- `applyConsequences(state: GameState, consequences: Consequence[]): GameState`.
- `scheduleFollowUp(state: GameState, followUp: ScheduledFollowUp): GameState`.

- [ ] Write failing tests for cash/stock/metric/flag/XP/debt/incident consequences and delayed follow-up scheduling.
- [ ] Verify failure.
- [ ] Implement delegation to Plan 02/03 domain functions instead of direct duplicated formulas.
- [ ] Verify PASS.
- [ ] Commit: `feat: add consequence engine and followups`.

### Task 4: Implement campaign definitions and DayRunner enforcement

**Files:**
- Modify: `src/client/data/campaignDays.ts`
- Create: `src/client/campaign/campaignEngine.ts`
- Modify: `src/client/campaign/DayRunner.ts`
- Test: `tests/unit/campaign-days.test.ts`

**Interfaces:**
- `CampaignDayDefinition` contains `day`, `requiredStoryEventId`, `eventBudget`, optional modifiers/objectives.
- `getCampaignDay(day: number): CampaignDayDefinition`.

- [ ] Write failing test that exactly Days 1–30 exist, each has one valid required story event ID, and no duplicate day.
- [ ] Verify failure.
- [ ] Populate campaign day definitions from the approved spec.
- [ ] Verify PASS.
- [ ] Commit: `feat: define 30-day campaign schedule`.

### Task 5: Author story events and 12 major decisions for Days 1–10

**Files:**
- Create: `src/client/data/story/day01-10.ts`
- Create: `src/client/data/dialogue/day01-10.ts`
- Test: `tests/unit/story-day01-10.test.ts`

**Interfaces:**
- Events use Task 1 schema; dialogue uses localization keys rather than hardcoded renderer text.

- [ ] Write failing content tests for required event IDs, Day 4/6/9/10 major choices, and Day 10 20% debt settlement flow.
- [ ] Author data and consequences.
- [ ] Verify tests.
- [ ] Commit: `feat: author campaign days 1 to 10`.

### Task 6: Author story events and major decisions for Days 11–20

**Files:**
- Create: `src/client/data/story/day11-20.ts`
- Create: `src/client/data/dialogue/day11-20.ts`
- Test: `tests/unit/story-day11-20.test.ts`

- [ ] Write failing tests for neighborhood introduction, missing-item chain, Day 13 guard/camera choice, Day 14 JD rest choice, competitor response, Day 18 books event, Day 19 finance choice, Day 20 30% installment.
- [ ] Author events/dialogue/consequences.
- [ ] Verify PASS.
- [ ] Commit: `feat: author campaign days 11 to 20`.

### Task 7: Author story events and major decisions for Days 21–30

**Files:**
- Create: `src/client/data/story/day21-30.ts`
- Create: `src/client/data/dialogue/day21-30.ts`
- Test: `tests/unit/story-day21-30.test.ts`

- [ ] Write failing tests for JD specialization, security climax, catering, husband-help state, market shock, final books check, neighborhood climax, Day 29 strategy and Day 30 final installment.
- [ ] Author events/dialogue/consequences.
- [ ] Verify PASS.
- [ ] Commit: `feat: author campaign days 21 to 30`.

### Task 8: Implement journal, decision flags and ending montage data

**Files:**
- Create: `src/client/campaign/journal.ts`
- Create: `src/shared/types/journal.ts`
- Test: `tests/unit/journal.test.ts`

**Interfaces:**
- `recordJournalEntry(state: GameState, entry: JournalEntry): GameState`.
- `recordDecision(state: GameState, decision: DecisionRecord): GameState`.
- `getEndingMontageEntries(state: GameState): JournalEntry[]`.

- [ ] Write failing tests for chronological records, no duplicate once-only moments, persistence across save, and selection of major montage moments.
- [ ] Implement.
- [ ] Verify PASS.
- [ ] Commit: `feat: add campaign journal and decision memory`.

### Task 9: Implement six-ending resolver

**Files:**
- Create: `src/shared/types/endings.ts`
- Create: `src/client/director/EndingResolver.ts`
- Create: `src/client/data/endings.ts`
- Create: `tests/fixtures/endings/*.json`
- Test: `tests/unit/ending-resolver.test.ts`

**Interfaces:**
- `EndingId = "perfect" | "family" | "jd" | "neighborhood" | "husband-finance" | "comeback"`.
- `resolveEnding(state: GameState): EndingId`.
- Priority: perfect → family → JD → neighborhood → husband-finance → comeback.

- [ ] Write six failing fixture tests plus overlap-priority tests.
- [ ] Verify failure.
- [ ] Implement configurable thresholds centralized in `endings.ts`.
- [ ] Verify PASS.
- [ ] Commit: `feat: add deterministic campaign endings`.

### Task 10: Implement Endless transition and Director Inspector

**Files:**
- Create: `src/client/game/modes/EndlessMode.ts`
- Create: `src/client/director/DirectorInspector.ts`
- Test: `tests/unit/endless-transition.test.ts`
- Test: `tests/e2e/day30-ending.spec.ts`

**Interfaces:**
- `transitionToEndless(state: GameState, ending: EndingId): GameState`.
- `getDirectorDebugSnapshot(state: GameState): DirectorDebugSnapshot`.
- Debug inspector is development-only.

- [ ] Write failing tests for all six ending modifiers on Day 31.
- [ ] Write E2E fixture test for Day 30 → ending screen → Continue → Day 31.
- [ ] Implement Endless transition and dev inspector.
- [ ] Verify PASS.
- [ ] Commit: `feat: add day 31 endless transition`.

### Task 11: Add campaign fast-forward and Director fuzz verification

**Files:**
- Create: `tests/integration/campaign-fast-forward.test.ts`
- Create: `tests/integration/director-fuzz.test.ts`
- Create: `tests/helpers/campaignBot.ts`

**Interfaces:**
- Test helpers only; production interfaces unchanged.

- [ ] Write fast-forward test that traverses all 30 days with deterministic decisions and always reaches an ending.
- [ ] Write fuzz invariants for tens of thousands of generated states: no dual blocking major events, no locked capability actions, no future-day story event, no completed-chain restart.
- [ ] Implement only missing production guards exposed by failing tests.
- [ ] Run `npm run test:run`; expect PASS.
- [ ] Commit: `test: verify complete campaign director flow`.
