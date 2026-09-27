# Security + Neighborhood + Incident Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the linked security, guards, theft, Neighborhood Trust, community/police follow-up and bookkeeping-inspection incident systems without unsafe JD interactions or arbitrary punishment.

**Architecture:** Incidents use explicit state machines and context capabilities. The incident layer asks pure domain systems what actions are currently available, and a live-event controller maps event urgency to GameClock slow-time or pause.

**Tech Stack:** Existing Plans 01–02 stack.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- JD never physically confronts thieves or performs dangerous grill intervention.
- Theft cannot instantly subtract money without an observable attempt state.
- Police/community-order NPCs are gameified and not legal guidance.
- Security strength improves detection but does not eliminate all risk.
- Choices requiring guard/camera/JD are hidden when unavailable.

## Review Focus

1. Incident action list reflects actual unlocked equipment/personnel.
2. Repeat thief chain cannot restart after final resolution.
3. Guard intimidation can trade customer comfort for security.
4. High Neighborhood Trust warns/helps but does not set theft chance to zero.
5. Book inspection discrepancies preserve actual vs recorded amounts.

---

### Task 1: Implement security score and equipment capabilities

**Files:**
- Create: `src/shared/types/security.ts`
- Create: `src/client/systems/security/security.ts`
- Create: `src/client/data/securityUpgrades.ts`
- Test: `tests/unit/security.test.ts`

**Interfaces:**
- `calculateSecurityScore(state: SecurityState): number`
- `getSecurityCapabilities(state: SecurityState): SecurityCapabilities`
- Capabilities include `hasLock`, `hasLighting`, `cameraLevel`, `hasActiveGuard`.

- [ ] Write failing score/capability tests for no upgrades, lock, light, camera levels, and active guard.
- [ ] Verify failure.
- [ ] Implement centralized equipment effects.
- [ ] Verify PASS.
- [ ] Commit: `feat: add security equipment capabilities`.

### Task 2: Implement guard roster, hiring and shift behavior

**Files:**
- Create: `src/shared/types/guards.ts`
- Create: `src/client/systems/security/guards.ts`
- Create: `src/client/data/guards.ts`
- Test: `tests/unit/guards.test.ts`

**Interfaces:**
- `hireGuardForShift(state: GameState, guardId: string, shift: GuardShift): GameState`
- `resolveGuardAttendance(input: GuardAttendanceInput): GuardAttendanceResult`
- Stable roster IDs: `chu-tam`, `anh-hung`, `co-lan`.

- [ ] Write failing tests for 160K/280K/380K target costs, insufficient cash, reliability, stamina, and intimidation comfort modifier.
- [ ] Verify failure.
- [ ] Implement roster stats and seeded attendance quirks.
- [ ] Verify PASS.
- [ ] Commit: `feat: add guard roster and shifts`.

### Task 3: Implement theft incident state machine and detection

**Files:**
- Create: `src/shared/types/incidents.ts`
- Create: `src/client/systems/security/theft.ts`
- Test: `tests/unit/theft.test.ts`

**Interfaces:**
- `TheftStage = "appear" | "observe" | "target" | "attempt" | "escape" | "resolved"`.
- `advanceTheftIncident(incident: TheftIncident, context: DetectionContext, dtMs: number): TheftIncident`
- `calculateDetectionChance(context: DetectionContext, stage: TheftStage): number`.

- [ ] Write failing tests for progression, no instant loss at `appear`, higher detection with JD/camera/guard/trust, and deterministic seeded detection decisions.
- [ ] Verify failure.
- [ ] Implement stage transitions and outcome payloads without Phaser dependency.
- [ ] Verify PASS.
- [ ] Commit: `feat: add theft incident state machine`.

### Task 4: Implement Neighborhood Trust and community-helper follow-up

**Files:**
- Create: `src/shared/types/neighborhood.ts`
- Create: `src/client/systems/neighborhood/neighborhood.ts`
- Create: `src/client/data/neighborhoodEvents.ts`
- Test: `tests/unit/neighborhood.test.ts`

**Interfaces:**
- `adjustNeighborhoodTrust(value: number, delta: number): number`
- `getNeighborhoodBenefits(state: NeighborhoodState): NeighborhoodBenefits`
- `createIncidentFollowUp(incident: ResolvedIncident, state: GameState): FollowUpEvent | null`.

- [ ] Write failing tests for 0–100 clamp, warning benefit at high trust, missing-item follow-up with/without camera evidence, and no total risk immunity.
- [ ] Verify failure.
- [ ] Implement gameified community/police follow-up data.
- [ ] Verify PASS.
- [ ] Commit: `feat: add neighborhood trust and incident follow-up`.

### Task 5: Implement bookkeeping discrepancies and inspection resolution

**Files:**
- Create: `src/client/systems/books/discrepancies.ts`
- Create: `src/client/systems/books/inspection.ts`
- Create: `src/client/data/bookEvents.ts`
- Test: `tests/unit/books-inspection.test.ts`

**Interfaces:**
- `createBookDiscrepancy(txId: string, recordedAmount: number): BookDiscrepancy`
- `calculateBookAccuracy(books: BooksState): number`
- `resolveBookInspection(input: InspectionInput): InspectionResult`.

- [ ] Write failing tests for JD mis-entry, pending correction, clean books, and a timed receipt-search outcome.
- [ ] Verify failure.
- [ ] Implement actual-vs-recorded reconciliation and gameified consequences only.
- [ ] Verify PASS.
- [ ] Commit: `feat: add bookkeeping inspection incidents`.

### Task 6: Implement incident capability resolver and safe JD actions

**Files:**
- Create: `src/client/systems/incidents/incidentCapabilities.ts`
- Test: `tests/unit/incident-capabilities.test.ts`

**Interfaces:**
- `getIncidentActions(event: IncidentEvent, state: GameState): IncidentAction[]`.

- [ ] Write failing tests: camera action hidden at level 0, guard action hidden without active guard, JD-camera action shown only when JD assigned/available, no action ever instructs JD to chase/fight.
- [ ] Verify failure.
- [ ] Implement capability-based action filtering.
- [ ] Verify PASS.
- [ ] Commit: `feat: gate incident actions by real capabilities`.

### Task 7: Add GameClock slow-time and incident overlay controller

**Files:**
- Create: `src/client/game/time/GameClock.ts`
- Create: `src/client/ui/events/IncidentOverlay.ts`
- Create: `src/client/systems/incidents/IncidentController.ts`
- Test: `tests/unit/game-clock.test.ts`
- Test: `tests/e2e/incident-overlay.spec.ts`

**Interfaces:**
- `GameClock.setScale(scale: number): void`
- `IncidentController.start(event)`, `choose(actionId)`, `cancelIfAllowed()`.
- Settings map standard≈0.30, extra-slow≈0.15, auto-pause=0, no-timed=0 with no timeout.

- [ ] Write failing unit tests for scale clamping and setting modes.
- [ ] Write failing E2E for incident open→choose→close→scale restored→canvas interactive.
- [ ] Implement without bypassing OverlayManager.
- [ ] Verify all tests.
- [ ] Commit: `feat: add slow-time incident interactions`.

### Task 8: Prove a complete linked incident chain

**Files:**
- Create: `tests/integration/incident-chain.test.ts`
- Create: `tests/e2e/security-incident.spec.ts`

**Interfaces:**
- Uses all prior Plan 03 contracts.

- [ ] Write failing integration chain: suspicious person → JD/camera detection → guard intervention → resolved incident → Neighborhood Trust change → optional follow-up.
- [ ] Add alternate no-security path that loses value but keeps campaign state valid.
- [ ] Implement missing glue only.
- [ ] Run `npm run typecheck && npm run test:run && npm run test:e2e -- tests/e2e/security-incident.spec.ts`; expect PASS.
- [ ] Commit: `feat: complete linked security incident flow`.
