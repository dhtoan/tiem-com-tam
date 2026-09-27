# Google Antigravity Prompt — Tiệm Cơm Tấm

## Objective
Build a production-ready Vietnamese web game **“Tiệm Cơm Tấm / Cơm Tấm Sài Gòn”** and push the completed code to:

- Target repo: https://github.com/dhtoan/tiem-com-tam
- Target branch: `main`

The target repository is currently empty, but always inspect it first. If files appear before you start, preserve and extend them; do not destructively overwrite existing work.

You are explicitly authorized to commit and push changes to **dhtoan/tiem-com-tam** after verification. Do **not** modify the reference repositories. Do not deploy to a live Cloudflare account unless separately authorized; prepare the project so deployment is ready.

## Source material to inspect before coding

### Primary code references
1. https://github.com/dhtoan/tiem-mi-cay
   - Reuse architectural patterns, not branding/assets.
   - Study Cloudflare Workers + D1, account/auth, revisioned cloud save, same-origin API/static serving, leaderboard/challenge endpoints, PWA/offline behavior, build/deploy scripts, security headers, smoke tests, CI and one-click Cloudflare deployment.

2. https://github.com/dhtoan/banhmi
   - Study the cozy Vietnamese food-game loop and UX patterns.
   - Reuse concepts such as ingredient stock, recipes, customer queue/orders, day progression, restock/unlock economy, local save, recipe/help UI, sound/music lifecycle and PWA behavior.
   - Do not copy its copyrighted visual identity or third-party assets blindly.

### Historical Cơm Tấm requirements
3. https://github.com/dhtoan/com-tam
   - Treat this as the historical approved product/spec source from previous work, especially `docs/superpowers/specs/` and `docs/superpowers/plans/`.
   - Preserve the approved scope: TypeScript + Phaser 3 + DOM/CSS, Vite, no React, Cloudflare Workers + D1, PWA/offline local play, bilingual Vietnamese/English, 30 authored campaign days + Day 31+ procedural, about 25 recipes, 23 ingredients, 10 customer archetypes, charcoal grilling, inventory/economy/upgrades/achievements, local + cloud save, Endless/Daily modes and leaderboards.
   - You may selectively port user-owned implementation ideas/code where useful, but do not simply duplicate the old repo. Rebuild the target deliberately, improve the UI and visual composition, and keep the new repo coherent.

## Hard visual reference

Use the attached screenshot as the primary composition reference. Create an **original** game scene with the same information hierarchy and overall stall layout, not a pixel-for-pixel copy of third-party artwork.

Desktop target: landscape 16:9, approximately 1152×648 / 1280×720, no page scroll during gameplay.

### Layout lock
- Background: cozy hand-painted / illustrated Saigon sidewalk cơm tấm stall, warm daylight, red plastic tables/stools, greenery and neighborhood street ambience.
- Top-left: cream rounded panel with sun/weather icon, **“Ngày 1”**, clock around **12:44**, plus a pink horizontal day/progress bar.
- Top-right: three compact controls:
  - cash chip with green-money icon and value similar to **135.000**
  - star/reputation chip similar to **25**
  - gear/settings button
- Left side:
  - freestanding menu sign titled **“CƠM TẤM”**
  - visible example pricing such as Sườn nướng 25K, Bì chả 20K, Thịt nướng 22K, Trứng 5K, Ốp la 5K
  - charcoal grill below/next to it with sizzling glazed pork chops, glowing coals, tongs, sauce pot and subtle smoke/heat animation
- Center:
  - large glass food display case as the focal interaction area
  - upper row: **Sườn nướng 25.000, Thịt nướng 22.000, Bì heo 5.000, Chả trứng 5.000**
  - lower row: **Trứng ốp la 5.000, Chả lụa 5.000, Đồ chua 3.000, Mỡ hành 2.000, Dưa leo 2.000, Cà chua 2.000**
  - each tray looks abundant, appetizing and clearly distinct; labels stay legible
- Right side:
  - stack of plates, chopsticks/utensils, condiments
  - large rice pot full of broken rice with label **“Cơm tấm 3.000”**
- Bottom foreground:
  - serving counter spanning the screen
  - plate assembly area with a floral plate
  - cutting board with cooked pork
  - small bowl of scallion oil
  - red/pink cleaning towel
  - the player’s currently assembled plate is always easy to see
- Overall tone: charming, tactile, Vietnamese, cozy, premium casual mobile/web game; rounded cream UI cards with brown outline and subtle shadow.

Do not use emoji as final in-game food art. Emoji are allowed only as temporary development fallbacks and must be replaced before completion.

## Technical architecture — required
- **TypeScript**
- **Phaser 3** for the live game scene, animations, input and game-state presentation
- **DOM/CSS** for menus, settings, account, modal sheets, accessibility and responsive overlays
- **Vite**
- **No React**
- **Cloudflare Workers + D1**
- Same-origin frontend + API
- PWA manifest + service worker
- Guest/local save must work offline
- Logged-in revisioned cloud save
- Vitest + Playwright or equivalent local automated tests
- GitHub Actions CI
- Node 20+ compatible
- All runtime assets local to the repo; no fragile third-party hotlinks

Keep systems modular. Avoid a single huge HTML/JS file.

Suggested structure:
```
src/
  game/
    scenes/
    systems/
    data/
    ui/
    audio/
    assets/
  client/
  worker/
public/
  assets/
  audio/
  icons/
migrations/
tests/
docs/
scripts/
```

## Core game loop
Implement an actually playable loop, not a static mockup:

1. **Prep / restock**
   - inspect stock, buy ingredients, unlock items/upgrades
2. **Open stall**
   - customers arrive with visible patience
   - order appears clearly in Vietnamese or English based on selected language
3. **Cook**
   - raw pork/grilled meat goes to charcoal grill
   - cooking state progresses through raw → cooking → perfect → overcooked → burnt
   - player must flip/remove at the right time
4. **Plate**
   - add broken rice
   - add requested protein and sides/toppings
   - support click/tap and drag interactions
5. **Serve**
   - validate order accuracy, doneness and speed
   - show concise feedback, stars/tip/combo
6. **Day close**
   - revenue, ingredient cost, rent/expenses, rating, goals and unlock progress
7. **Next day**
   - difficulty and recipe complexity increase gradually

The player should understand Day 1 without reading a long tutorial. Use contextual coach marks and small prompts.

## Content requirements
Preserve the approved historical scope from `dhtoan/com-tam`:
- 30 hand-authored campaign days
- procedural Day 31+
- ~25 recipes
- 23 ingredients
- 10 customer archetypes
- Vietnamese + English
- achievements
- upgrades
- inventory
- rating/reputation
- combos
- daily objectives
- unlock progression

At minimum, Day 1 must use the screenshot ingredients and common cơm tấm combinations such as:
- cơm sườn
- cơm thịt nướng
- cơm sườn bì
- cơm sườn chả
- cơm sườn bì chả
- optional trứng ốp la
- đồ chua, mỡ hành, dưa leo, cà chua

Use the existing approved spec in `dhtoan/com-tam` as the canonical source for the full catalog rather than inventing conflicting values.

## Customer and order UX
- queue can hold multiple customers
- each ticket shows portrait/avatar, requested plate, patience and modifiers
- customer personalities affect patience/tips/order complexity
- clear visual distinction between active order and waiting orders
- serving the wrong dish gives understandable feedback but does not soft-lock the game
- no modal/popup may trap the user; every modal must have a visible close action, Escape support on desktop, and safe backdrop handling

## Economy
- use Vietnamese đồng formatting, e.g. `25.000đ`
- revenue, ingredient cost, rent/operating cost and upgrades must be balanced so progression feels meaningful
- no impossible Day 1 state
- prevent negative stock
- restocking and unlocks must persist
- data/config should be centralized, not scattered magic numbers

## Backend and account features
Follow the robust patterns from `tiem-mi-cay`:
- register/login/logout/me
- PBKDF2-SHA256 or an equally appropriate WebCrypto password-hashing approach supported by Workers
- HttpOnly session cookie, SameSite=Lax, Secure on HTTPS
- server stores session-token hash, not plaintext token
- local guest save
- cloud save with monotonically increasing revision
- return conflict instead of silently overwriting a newer save
- health endpoint
- Endless mode API
- Daily Challenge seeded by date
- four leaderboard views/endpoints
- replay-resistant short-lived run/challenge token where appropriate
- D1 migrations
- request/body size validation
- same-origin checks for sensitive writes
- sensible rate/quota guards

Do not claim anti-cheat is perfect. Keep authoritative server validation around online score submissions where feasible.

## PWA and offline
- installable PWA
- service worker with reliable cache versioning
- the core single-player game must load and play offline after first successful load
- network-only online/account features must fail gracefully
- asset caching must not produce permanent stale code
- no 404s for declared preload assets

## Art/media requirements
Create a coherent original asset set for the target game:
- stall/background scene
- food display case and trays
- rice pot, plates, chopsticks, grill, tongs, sauce, towel, cutting board
- all food ingredients and plated variants
- raw/cooking/perfect/overcooked/burnt meat states
- 10 customer portraits/archetypes with mood variants
- UI icons
- PWA icons
- small VFX: smoke, heat shimmer, sparkle/perfect, coin/tip, star, wrong-order feedback
- sound effects for click, ingredient place, grill sizzle, flip, correct serve, wrong serve, money, star, day start/end
- calm Vietnamese street-food ambience / music only if licensing is clear

Use Antigravity’s available asset-generation capabilities when present. If direct image generation is unavailable, create polished original SVG/Canvas/programmatic assets locally so the game is still complete and no runtime placeholder is missing. Do not hotlink external assets. Preserve license/credits for any third-party media you intentionally use.

## Responsive behavior
Desktop:
- show the full stall composition in one view
- preserve the reference layout hierarchy

Mobile:
- portrait-friendly focused camera/layout
- large touch targets
- allow switching/focusing between grill, display case and plating counter without tiny controls
- no horizontal browser scrolling
- maintain the same game state when changing focus/viewport

Tablet should interpolate cleanly.

## Accessibility and UX quality
- keyboard-accessible DOM controls
- visible focus states
- ARIA labels for icon-only buttons
- minimum comfortable touch targets
- text contrast high enough against illustrated background
- respect reduced-motion preference for nonessential animations
- sound/music toggles
- Vietnamese should be the default language; English selectable in settings

## Security / production
Use the safe production ideas from `tiem-mi-cay` without gimmicky “anti-view-source” claims:
- security headers
- CSP appropriate for same-origin assets
- X-Content-Type-Options
- Referrer-Policy
- frame-ancestors / clickjacking protection
- no secrets committed
- no source maps in production unless explicitly needed
- validate API inputs
- do not trust client-submitted score data blindly

## Cloudflare readiness
Prepare:
- `wrangler.toml`
- D1 binding `DB`
- migrations
- `npm run db:local`
- `npm run db:remote`
- `npm run deploy`
- README deployment instructions
- “Deploy to Cloudflare” button/pattern where feasible

Use target naming such as:
- Worker/database: `tiem-com-tam`
- suggested workers.dev hostname: `tiem-com-tam.aunomay.workers.dev`
- optional custom domain documented as `comtam.aunomay.com`

Do not perform a live Cloudflare deployment without separate authorization.

## Testing and visual verification
Before pushing:
1. `npm install`
2. typecheck
3. lint
4. unit tests
5. production build
6. apply local D1 migrations
7. run worker/app locally
8. Playwright/E2E smoke tests for:
   - app loads
   - Day 1 starts
   - ingredient selection works
   - grill timing works
   - plate can be served
   - correct/wrong order paths
   - day can end
   - local save reloads
   - language switch works
   - register/login/logout
   - cloud save write/read/revision conflict
   - leaderboard/daily challenge endpoints
9. Use the Antigravity browser agent to visually inspect:
   - desktop ~1152×648 or 1280×720
   - mobile ~390×844
   - no overlap, clipping, blocked popups or page scroll
   - no broken images/404s
   - no uncaught console errors
10. Compare desktop composition to the provided reference screenshot and iterate until the grill-left / display-center / rice-right / plating-bottom hierarchy is unmistakable.

Do not report success based only on build output; verify the playable flow in a real browser.

## Git workflow
- Inspect target repo before writing.
- Because this target is currently empty, initialize it cleanly on `main`.
- Make logical commits as major milestones complete.
- Never force-push.
- Never rewrite history.
- Do not push failing code.
- Push final verified work to:
  `git@github.com:dhtoan/tiem-com-tam.git`
  or the authenticated HTTPS equivalent.

Reference repos are read-only for this task.

## Execution behavior
Do not stop after producing a plan. Continue autonomously through implementation, asset creation, tests, browser verification, fixes, documentation, commits and push.

You may use multiple Antigravity agents for genuinely independent workstreams such as:
- gameplay/client
- backend/D1
- original art/media
- tests/QA

Keep one primary agent responsible for integration so parallel work does not diverge.

Do not ask for approval for safe local reads, installs of the already-required dependencies, tests, browser checks, commits or the final push to the authorized target repo. Ask only if blocked by missing credentials, a destructive action, an unexpected paid external service, or a live infrastructure deployment.

## Definition of done
The task is complete only when:
- the target repo contains a coherent production-oriented codebase
- the game is genuinely playable from Day 1 through the daily loop
- the screenshot’s stall composition is clearly reflected in the desktop UI
- grill, ingredient case, rice and plating are interactive
- campaign/content systems are present
- local save + account/cloud save are functional
- online modes/leaderboards are wired
- PWA works
- all declared local assets exist
- automated checks pass
- desktop/mobile browser QA passes
- README explains local dev, testing and Cloudflare deployment
- code is committed and pushed to `dhtoan/tiem-com-tam`

## Final report
After the push, return only a concise implementation report containing:
- final commit SHA
- GitHub repo link
- main systems implemented
- assets/media created
- test/build/browser verification results
- any remaining blocker that requires the owner’s action (for example Cloudflare credentials/D1 provisioning)

Do not provide hidden chain-of-thought. Provide only concise evidence and verification results.
