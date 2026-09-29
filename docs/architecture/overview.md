# Tiệm Cơm Tấm — Architecture & Systems Overview

## 1. High-Level Architecture

The game architecture follows a **Local-First, Reactive Unidirectional Data Flow** pattern. The core gameplay loop runs entirely in-memory in the browser with zero external network dependencies, while optional cloud features (cloud saves, daily challenge sync, global leaderboards) operate through an edge layer powered by Cloudflare Workers and D1.

```mermaid
graph TD
    User([Player Interaction]) --> Input[DOM UI & Phaser Canvas]
    Input --> Action[Store Action / Dispatch]
    Action --> Store[GameStore (Immutable State)]
    Store --> Persistence[LocalSave (localStorage)]
    Store --> Scenes[Phaser Scenes (StallScene, BootScene)]
    Store --> UI[DOM Overlays (HUD, Dialogue, Modals)]
    Store --> Director[Living Stall Director]
    Director --> Budget[Stress & Event Budget]
    Director --> Events[EventSelector & Follow-Ups]
    Events --> Store
    Store -.-> CloudSync[Background Cloud Save Sync]
    CloudSync -.-> EdgeAPI[Cloudflare Worker & D1]
```

---

## 2. Core Subsystems

### 2.1 State Management & Persistence (`src/client/state/`)
- **Single Source of Truth:** `GameStore` holds the entire `GameState` tree including campaign progression, economy ledger, debt schedule, inventory batches, cooking station, JD robot attributes, neighborhood metrics, family trust, and settings.
- **Unidirectional Flow:** State updates occur strictly via pure reducer functions dispatched through `store.dispatch(updater)`.
- **Local Persistence Envelope:** `saveLocal` encapsulates state within versioned envelopes (`SaveEnvelope`) containing `schemaVersion`, `revision`, `updatedAt`, and `state`.
- **Schema Migration Pipeline:** `migrateSave` parses envelopes, validates against future schema versions, and sanitizes transient in-flight service states (e.g. grill meats) before rehydration.

### 2.2 Living Stall Director (`src/client/director/`)
- **Stress Budget:** Calculates player stress dynamically from shop cash, JD stamina, missed debt payments, husband confidence, and shop rating. High stress automatically suppresses critical disruption events to prevent death spirals.
- **Event Budgeting:** Allocates 1–3 daily event slots based on difficulty (Easy: 1, Normal: 2, Hard: 3). Enforces strict limits: max 1 major incident per day.
- **Event Filtering & Selection:**
  - Evaluates metric, flag, capability (`hasActiveGuard`, `hasLock`, `cameraLevelGte`, `jdRoleEq`), and day-range conditions.
  - Enforces mutual exclusion groups (`mutexGroup`) and event cooldowns (`cooldownDays`).
  - Applies repetition penalties to balance variety across campaign playthroughs.
- **Branching Consequence Engine:** Mutates cash, stock, trust, reputation, relationship flags, or schedules future follow-up events.
- **Ending Resolver:** Evaluates 6 canonical endings on Day 30 based on debt status, family trust, husband confidence, and neighborhood standing.

### 2.3 Cooking & Plating Simulation (`src/client/game/`)
- **Discrete Timing & Grill Items:** Tracks pork chops and proteins through discrete cooking stages (`raw`, `cooking-a`, `cooking-b`, `done`, `burned`) with heat levels and flip mechanics.
- **Order Assembly:** Plate assembly validates rice base, proteins, toppings, and sides against active recipe definitions.
- **Customer Queue & Patience:** Dynamic queue management with archetype patience curves, mood changes, tips, and timeout walkouts.

### 2.4 Bounded Audio Engine (`src/client/audio/`)
- **Mixer Buses:** 5 volume buses (`master`, `music`, `ambience`, `sfx`, `ui`) managed by `AudioMixer`.
- **Singular Grill Sizzle Loop:** `GrillAudioController` maps total active grill meats to a single gain node, avoiding audio instance proliferation.
- **Lifecycle Auto-Mute:** Page visibility changes (`document.visibilitychange`) immediately mute or suspend audio.

### 2.5 Cloud & Edge Synchronization (`src/worker/`)
- **Edge Routing:** Cloudflare Worker handles REST endpoints (`/api/auth`, `/api/save`, `/api/daily`, `/api/leaderboard`).
- **Revisioned Cloud Saves:** Optimistic concurrency control via `revision` numbers. Write conflicts trigger interactive client-side 3-way conflict resolution (`SaveConflictDialog`).
- **D1 SQLite Storage:** Edge SQLite database storing salted user credentials, cloud state snapshots, and daily challenge records.

---

## 3. Directory Layout

```text
├── docs/                 # Product specs, implementation plans, and architecture docs
├── migrations/           # Cloudflare D1 SQL schema migrations
├── public/               # Static production assets (sprites, icons, audio, favicon)
├── scripts/              # Validation scripts and headless simulation/fuzz CLI tools
│   ├── simulate-campaign.mjs
│   ├── fuzz-director.mjs
│   ├── validate-assets.mjs
│   └── validate-content.mjs
├── src/
│   ├── client/           # Client application (Phaser, Store, UI, Audio, i18n)
│   ├── shared/           # Cross-environment types, schemas, and random seeds
│   └── worker/           # Cloudflare Worker edge API and D1 database queries
└── tests/
    ├── e2e/              # Playwright browser end-to-end regression suites
    ├── fixtures/         # Versioned save fixtures (v1, Day 10, Day 29, Endless)
    ├── helpers/          # Headless balance strategies (poor, average, good, optimized)
    ├── integration/      # In-memory D1, fuzzing, and cloud save tests
    └── unit/             # Fast Vitest unit tests
```
