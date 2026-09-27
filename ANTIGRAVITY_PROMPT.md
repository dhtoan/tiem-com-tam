# Google Antigravity — Execute the approved Tiệm Cơm Tấm implementation

## Objective

Implement the complete production-ready **Tiệm Cơm Tấm / Cơm Tấm Sài Gòn** game in:

`https://github.com/dhtoan/tiem-com-tam`

The product/design spec and implementation plans are already approved. Treat them as the source of truth. Do not redesign the product unless an implementation blocker proves a spec conflict.

## Read first — required

Before editing code, read these files in the target repository in this order:

1. `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`
2. `docs/superpowers/plans/2026-09-28-00-tiem-com-tam-master-roadmap.md`
3. `docs/superpowers/plans/2026-09-28-01-foundation-day1-vertical-slice.md`
4. `docs/superpowers/plans/2026-09-28-02-economy-management-systems.md`
5. `docs/superpowers/plans/2026-09-28-03-security-neighborhood-incident-systems.md`
6. `docs/superpowers/plans/2026-09-28-04-living-stall-director-campaign-endings.md`
7. `docs/superpowers/plans/2026-09-28-05-cloud-online-pwa.md`
8. `docs/superpowers/plans/2026-09-28-06-content-media-localization-audio.md`
9. `docs/superpowers/plans/2026-09-28-07-balance-qa-release.md`

Also inspect these repositories as **read-only references** before implementation:

- `https://github.com/dhtoan/tiem-mi-cay`
- `https://github.com/dhtoan/banhmi`
- `https://github.com/dhtoan/com-tam`

Use their proven patterns where helpful, especially Cloudflare/D1, save, auth, game organization, cooking, PWA and tests. Do **not** edit those three reference repositories.

## Execution mode

Execute the approved plans sequentially:

`01 → 02 → 03 → 04 → 05 → 06 → 07`

Continue autonomously through the plans without asking for confirmation between ordinary tasks.

If the Superpowers execution skills are available, use **subagent-driven-development** as the preferred execution mode; otherwise execute the same plans natively task-by-task. Follow TDD: failing test → minimal implementation → passing test → review → commit.

Do not skip plan exit gates.

## Repository rules

- Work only in `dhtoan/tiem-com-tam`.
- Preserve all approved spec/plan files.
- Inspect the current repository state before modifying files.
- Never blindly overwrite existing implementation that appeared after the plan was written; reconcile it with the approved design.
- Never force-push.
- Commit frequently using the commit intent in each plan.
- Push completed, verified commits to the target repository.
- Do not commit secrets, `.env`, credentials, API tokens, `node_modules`, temporary generated junk or unbounded test artifacts.

## Authorized actions

You are authorized to:

- create and edit project source code;
- add the dependencies already required by the approved stack/plans;
- create local D1 migrations and run them locally;
- create all required original game media/assets if your environment provides media-generation capability;
- run local builds, tests, linters, typechecks, browser checks, local Worker/D1 and simulations;
- create/update documentation;
- commit and push verified work to the target GitHub repository.

You do **not** need confirmation for normal plan-defined edits.

## Approval boundary

Stop and report before:

- live/remote Cloudflare deployment;
- creating or changing production Cloudflare resources;
- using production secrets/credentials;
- destructive deletion of user data;
- adding a new runtime dependency not justified by the approved plans;
- materially changing the approved product scope;
- any irreversible external action other than the already-authorized GitHub commits/pushes.

Local D1 migrations and local Worker testing are authorized.

## Non-negotiable architecture

- TypeScript + Phaser 3 + vanilla DOM/CSS + Vite.
- No React.
- Cloudflare Workers + D1 for networked features.
- Story Mode is local-first and must remain playable offline after initial successful load.
- Phaser owns stall/game interaction; DOM/CSS owns management UI.
- Pure domain systems own simulation.
- Living Stall Director selects events but does not directly mutate economy/inventory.
- Seeded deterministic randomness; do not scatter `Math.random()`.
- One blocking overlay at a time through a single OverlayManager.
- Versioned save schema with migrations.
- Cloud saves use optimistic revisions and 409 conflicts.
- VI is default; EN is complete.
- Mobile uses station focus anchors rather than shrinking the full desktop stall.

## Product locks

The game is about Joy borrowing money from her husband to open a Cơm Tấm Sài Gòn stall and having 30 days to prove the business can work.

Keep all approved story/system decisions, including:

- Easy/Normal/Hard debt = 15M / 30M / 50M.
- Debt milestones on Days 10, 20 and 30.
- JD summer-helper progression with only safe tasks.
- Husband as lender/friendly rival/supporter, not villain.
- Market, Books/Tax, Security/Theft, Guards, Neighborhood/Police, Family/Debt.
- Living Stall Director with stress/event budgets and anti-repeat logic.
- 30 authored days.
- 12 major campaign decisions.
- Six deterministic endings.
- Day 31+ Endless Mode from every ending.
- Fail-forward behavior instead of ordinary mid-campaign Game Over.

## Visual locks

Desktop stall hierarchy must remain:

- **left:** charcoal grill;
- **center:** glass food display;
- **right:** rice/utensil station;
- **bottom foreground:** plating/service counter.

Art direction is the approved original **hand-painted Vietnamese cozy realism + premium casual management-game UI**.

The reference composition is guidance, not a request to trace another game.

Do not ship:

- placeholder emoji as production art;
- watermarked media;
- AI-garbled dynamic text baked into art;
- inconsistent Joy/JD/husband identities;
- missing assets;
- runtime asset 404s.

All media goes through the typed asset manifest/validation pipeline.

If direct media generation is unavailable in your environment, do **not** pretend Plan 06 is complete. Complete everything possible, leave a precise asset manifest/generation checklist, and report the media-generation blocker.

## Day 1 gate

Plan 01 must produce a real vertical slice before broad content/media production.

It must support:

`New Game → Difficulty → Intro/Morning Brief → Prep → Service → Grill → Flip → Plate → Serve → Close → Summary → Save/Reload`

Do not mass-produce full campaign art until Day 1 passes its visual and interaction gate.

## Verification discipline

Run the exact checks defined by each plan.

Do not disable tests to obtain a green build.

At the final release gate, run the repository equivalents of:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:run
npm run validate:assets
npm run validate:content
npm run build
npm run db:local
npm run test:e2e
```

Also run the campaign simulation and Director fuzz checks defined in Plan 07.

Use real browser verification for desktop and mobile; passing unit tests alone is insufficient.

Production verification targets include:

- Day 1–30 traversable;
- Day 31 Endless from all six endings;
- approximately 25 recipes;
- 23 ingredients;
- 10 gameplay customer archetypes;
- 12 major decisions;
- six endings;
- no production placeholder media;
- asset 404 count = 0;
- uncaught JS errors = 0;
- unhandled promise rejections = 0;
- no Blocker/Critical/Major known release bugs.

If any check cannot be run because of environment/tool limitations, mark it **NOT RUN** with the exact reason. Never report PASS without evidence.

## Browser/UX regressions to guard explicitly

Verify all of these:

- desktop stall composition;
- mobile station switching at 390×844 and ~360px wide;
- no horizontal page scroll;
- Settings/JD/Market/Debt/Books/Dialogue/Event overlays can always close;
- closing overlays restores game interaction and focus;
- Standard Slow Time, Extra Slow Time, Auto Pause and No Timed Decisions;
- offline Story Mode after initial load;
- cloud-save revision conflict;
- no blank screen when auth/network requests fail.

## Media/audio rules

For generated media:

- preserve locked character identities;
- use the shared style bible/prefix;
- maintain plate perspective;
- generate distinct cooking states rather than simple tint swaps;
- keep dynamic text rendered by the game, not baked into art;
- record licensing for any non-original third-party media;
- use audio buses/controllers and avoid unbounded loop instances.

## Progress and stop conditions

After each plan:

1. run its exit-gate verification;
2. fix failures within scope;
3. commit and push verified work;
4. record a concise milestone status.

Continue to the next plan automatically when the gate passes.

Stop early only when:

- a required external credential/action falls outside authorization;
- a required tool/capability is genuinely unavailable and prevents further meaningful work;
- the approved spec contains an irreconcilable technical contradiction;
- repeated verification failure remains after a bounded debugging effort.

When blocked, preserve all verified work, push it, and report the exact blocker plus the next owner action.

## Final deliverable

Do not say “complete” merely because code exists.

Completion means the approved Definition of Done and release gates are evidenced.

At the end, update/create:

- `README.md`
- `docs/architecture/overview.md`
- `docs/deployment/cloudflare.md`
- `docs/qa/release-verification.md`
- `docs/qa/known-issues.md`

Final response must be concise and include:

```text
Repo:
Final commit:

Plan 01: PASS / PARTIAL / BLOCKED
Plan 02: PASS / PARTIAL / BLOCKED
Plan 03: PASS / PARTIAL / BLOCKED
Plan 04: PASS / PARTIAL / BLOCKED
Plan 05: PASS / PARTIAL / BLOCKED
Plan 06: PASS / PARTIAL / BLOCKED
Plan 07: PASS / PARTIAL / BLOCKED

Build:
Typecheck:
Lint:
Unit/Integration:
E2E:
Campaign 30/30:
Content:
Desktop QA:
Mobile QA:
Console errors:
Asset 404s:
D1 local:
Production Cloudflare deploy: NOT RUN unless separately authorized

Known issues:
Owner actions required:
```

Do not provide hidden chain-of-thought. Report only concise implementation decisions, changed files, evidence, failures and remaining risks.

Start now by reading the spec and master roadmap, inspecting the current target repository and reference repositories, then execute Plan 01.
