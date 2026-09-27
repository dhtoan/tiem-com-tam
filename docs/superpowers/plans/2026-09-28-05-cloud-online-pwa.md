# Cloud + Online + PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add secure optional accounts, revisioned cloud saves, Daily/Endless leaderboards and offline-safe PWA behavior without making Story Mode depend on the network.

**Architecture:** A modular Cloudflare Worker handles `/api/v1/*` before static assets. D1 stores accounts, sessions, cloud snapshots and online run metadata. Client API wrappers always fail softly for Story Mode; service-worker caching owns offline shell/core assets.

**Tech Stack:** Cloudflare Workers + D1, Wrangler 4.x, WebCrypto, existing Vite/TypeScript/Playwright stack.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- HttpOnly SameSite=Lax session cookie; Secure on HTTPS.
- Never store raw session tokens in D1.
- Cloud save stale writes return 409.
- Story Mode opens and runs when every API request fails.
- Daily Challenge uses shared seed + server-issued run token.
- No production deploy without separate owner authorization.

## Review Focus

1. Invalid/expired session never exposes another user's save.
2. Device B stale save cannot overwrite Device A newer revision.
3. Daily finish token cannot be replayed.
4. Offline launch ignores auth/leaderboard failure and loads local save.
5. Service-worker update cannot force reload mid-service.

---

### Task 1: Create modular Worker router and security middleware

**Files:**
- Create: `src/worker/index.ts`
- Create: `src/worker/router.ts`
- Create: `src/worker/types.ts`
- Create: `src/worker/middleware/security.ts`
- Create: `src/worker/routes/health.ts`
- Create: `wrangler.toml`
- Test: `tests/unit/worker-router.test.ts`

**Interfaces:**
- `handleApi(request: Request, env: Env): Promise<Response>`.
- `GET /api/v1/health` returns JSON status.
- Non-API paths fall through to `env.ASSETS.fetch(request)`.

- [ ] Write failing router/security-header tests.
- [ ] Verify failure.
- [ ] Implement routing, JSON errors, body-size guard, basic origin checks, CSP/nosniff/referrer/permissions headers.
- [ ] Verify PASS.
- [ ] Commit: `feat: add modular cloudflare worker router`.

### Task 2: Create D1 migration and repository helpers

**Files:**
- Create: `migrations/0001_init.sql`
- Create: `src/worker/db/accounts.ts`
- Create: `src/worker/db/saves.ts`
- Create: `src/worker/db/runs.ts`
- Test: `tests/integration/d1-schema.test.ts`

**Interfaces:**
- Tables: accounts, sessions, cloud_saves, daily_challenges, daily_runs, endless_runs, leaderboard_entries, run_tokens, rate_limits.

- [ ] Write failing schema test against local D1-compatible test setup/fixtures.
- [ ] Implement migration with indexes/constraints for unique account email, session token hash, cloud save user, run token nonce.
- [ ] Run `npm run db:local` and schema tests.
- [ ] Commit: `feat: add d1 game data schema`.

### Task 3: Implement auth and session cookies

**Files:**
- Create: `src/worker/auth/passwords.ts`
- Create: `src/worker/auth/sessions.ts`
- Create: `src/worker/routes/auth.ts`
- Create: `src/client/api/auth.ts`
- Test: `tests/integration/auth.test.ts`

**Interfaces:**
- Routes: POST register/login/logout, GET me.
- Password hashing uses WebCrypto-compatible PBKDF2-SHA256 with per-password salt.
- D1 stores hash of session token.

- [ ] Write failing tests for register/login/me/logout, bad password, expired session, and no raw token in DB.
- [ ] Implement.
- [ ] Verify PASS.
- [ ] Commit: `feat: add secure account sessions`.

### Task 4: Implement revisioned cloud save and conflict UI

**Files:**
- Create: `src/worker/routes/save.ts`
- Create: `src/client/api/save.ts`
- Create: `src/client/ui/account/SaveConflictDialog.ts`
- Test: `tests/integration/cloud-save.test.ts`
- Test: `tests/e2e/cloud-conflict.spec.ts`

**Interfaces:**
- GET `/api/v1/save`.
- PUT `/api/v1/save` requires `expectedRevision`.
- Success returns new monotonic revision.
- Stale revision returns HTTP 409 with current cloud metadata.

- [ ] Write failing two-device conflict test.
- [ ] Implement repository/route/client wrapper.
- [ ] Add E2E dialog choices: use cloud, keep device version, inspect metadata.
- [ ] Verify PASS.
- [ ] Commit: `feat: add revisioned cloud saves`.

### Task 5: Implement Daily Challenge and signed run tokens

**Files:**
- Create: `src/worker/routes/daily.ts`
- Create: `src/worker/auth/runTokens.ts`
- Create: `src/client/api/daily.ts`
- Test: `tests/integration/daily-challenge.test.ts`

**Interfaces:**
- GET `/api/v1/daily`.
- POST `/api/v1/daily/start`.
- POST `/api/v1/daily/finish`.
- Token binds challenge ID, seed, issued/expiry, nonce.

- [ ] Write failing tests for same-date shared seed, expired token, wrong challenge, replayed finish, invalid score shape.
- [ ] Implement token signing/verification and single-use nonce.
- [ ] Verify PASS.
- [ ] Commit: `feat: add daily challenge validation`.

### Task 6: Implement Endless run endpoints and leaderboards

**Files:**
- Create: `src/worker/routes/endless.ts`
- Create: `src/worker/routes/leaderboards.ts`
- Create: `src/client/api/leaderboards.ts`
- Test: `tests/integration/leaderboards.test.ts`

**Interfaces:**
- GET campaign/endless/daily/reputation leaderboards.
- POST endless start/finish.
- Sorting/pagination is deterministic.

- [ ] Write failing tests for validation, pagination, tie ordering, negative/NaN-like payload rejection, and duplicate finish.
- [ ] Implement.
- [ ] Verify PASS.
- [ ] Commit: `feat: add online run leaderboards`.

### Task 7: Make client API failures non-blocking

**Files:**
- Create: `src/client/api/http.ts`
- Create: `src/client/api/networkStatus.ts`
- Modify: `src/client/main.ts`
- Test: `tests/unit/api-offline.test.ts`
- Test: `tests/e2e/offline-story.spec.ts`

**Interfaces:**
- `apiRequest<T>(input, init): Promise<ApiResult<T>>` returns typed success/failure rather than throwing into app bootstrap.
- Local Story bootstrap never waits indefinitely for auth.

- [ ] Write failing tests where all fetches reject.
- [ ] Implement soft-failure wrapper and offline indicator.
- [ ] Add E2E: load once online → save → disable network → reopen → Story continues.
- [ ] Verify PASS.
- [ ] Commit: `feat: keep story mode local first`.

### Task 8: Implement PWA install/cache/update flow

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `src/client/pwa/register.ts`
- Create: `public/sw.js`
- Create: `src/client/ui/pwa/UpdatePrompt.ts`
- Test: `tests/e2e/pwa.spec.ts`

**Interfaces:**
- Cache app shell + core Day 1/stall bundle after first load.
- New worker update prompts rather than forcing reload during active service.

- [ ] Write failing browser tests for manifest, registration, offline app shell, and deferred update prompt.
- [ ] Implement cache versioning and safe activation.
- [ ] Verify PASS.
- [ ] Commit: `feat: add offline pwa lifecycle`.

### Task 9: Run local Worker/D1 end-to-end gate

**Files:**
- Create: `tests/e2e/account-online.spec.ts`
- Modify: `package.json` scripts if needed.

- [ ] Write/complete E2E covering register → cloud save → conflict → daily start/finish → leaderboard.
- [ ] Run `npm run db:local`, local Worker, and E2E.
- [ ] Fix only failures required by the test.
- [ ] Run full typecheck/lint/test/build/e2e gate.
- [ ] Commit: `test: verify cloud online and pwa flows`.
