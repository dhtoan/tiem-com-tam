# Tiệm Cơm Tấm / Cơm Tấm Sài Gòn — Product & Systems Design

**Status:** Approved design  
**Date:** 2026-09-28  
**Target repository:** https://github.com/dhtoan/tiem-com-tam  
**Primary references:** `dhtoan/tiem-mi-cay`, `dhtoan/banhmi`, and the approved historical design in `dhtoan/com-tam`.

## 1. Product vision

Build a production-oriented Vietnamese restaurant-management web game centered on **Joy**, who borrows money from her husband to open a small **Cơm Tấm Sài Gòn** stall. She has **30 days** to prove the business can work and repay the agreed debt milestones.

If Joy succeeds, she wins the family bet and becomes the recognized owner/operator of the shop. If she does not fully repay the debt, the story still continues: her husband gains more financial control in the post-campaign mode rather than the game deleting progress or ending in a hard failure.

**JD**, Joy's child who is on summer break, helps around the shop and develops from an inexperienced helper into a meaningful support character. JD has no explicit age in the game and is only assigned safe tasks.

The intended tone is:

- deep enough to feel like a real management game;
- warm, humorous, recognizably Vietnamese;
- family sitcom rather than family conflict;
- fail-forward rather than punitive;
- story-heavy without becoming a visual novel.

## 2. Core creative pillars

1. **Food first.** The grill, broken rice, toppings, plating, customers and service remain the visual and mechanical center.
2. **A living neighborhood.** Market changes, regular customers, theft, guards, community trust and neighborhood incidents interact.
3. **A family business story.** Joy, JD and Joy's husband grow through the campaign.
4. **Decisions have memory.** Choices alter later events, not just immediate meters.
5. **No random punishment.** The Living Stall Director considers player stress, cooldowns and state relevance before selecting dynamic events.
6. **Failure creates a new problem to solve.** Most mistakes do not cause an immediate Game Over.
7. **Replayable 30-day campaign.** Different system priorities and choices produce different event chains and endings.

## 3. Difficulty and debt contract

Difficulty scales the entire simulation, not only the debt.

| Difficulty | Starting debt | Day 10 | Day 20 | Day 30 |
| --- | ---: | ---: | ---: | ---: |
| Easy | 15,000,000đ | 3,000,000đ | 4,500,000đ | 7,500,000đ |
| Normal | 30,000,000đ | 6,000,000đ | 9,000,000đ | 15,000,000đ |
| Hard | 50,000,000đ | 10,000,000đ | 15,000,000đ | 25,000,000đ |

The Day 10/20/30 numbers are additional required installments, not cumulative targets.

Initial tuning targets:

| Variable | Easy | Normal | Hard |
| --- | ---: | ---: | ---: |
| Working cash Day 1 | 1.5M | 1.2M | 1.0M |
| Customer patience | 130% | 100% | 80% |
| Market volatility | 65% | 100% | 135% |
| Theft pressure | 60% | 100% | 140% |
| Bookkeeping pressure | 70% | 100% | 125% |
| Spoilage pressure | 80% | 100% | 120% |
| Tip rate | 115% | 100% | 95% |
| Large-order opportunity | 90% | 100% | 125% |

Missing the Day 10 or Day 20 installment does **not** cause Game Over. The husband can impose tighter KPIs, reserve requirements or new operating constraints. Day 30 determines the campaign ending.

The shop has two visible money pools:

- **Shop Cash** — operating money for stock, staff and upgrades.
- **Debt Reserve** — money deliberately set aside for the next installment.

Debt Reserve may be withdrawn with confirmation; it is not a hard lock.

## 4. Main cast

### Joy

Joy is the player-facing owner/operator: entrepreneurial, practical, funny, sometimes stubborn, and increasingly confident as the campaign progresses.

Arc:

`I can make this work` → `this is harder than it looked` → `I can manage people, money and risk` → `I am the owner of a real business`.

### JD

JD is the summer helper. No specific age is stated.

JD may safely:

- run light service tasks;
- help at the cashier;
- assist with non-dangerous prep;
- watch the camera;
- help customers;
- fetch or deliver light items;
- report suspicious behavior.

JD does **not** physically confront thieves or perform dangerous hot-grill actions.

JD grows through five specializations:

- Shop Helper
- Runner / Service
- Cashier
- Awareness
- Good Kid / Family Support

The implementation may map these to localized labels, but the functional roles remain distinct.

### Joy's husband

He is not a villain. He is:

- lender;
- friendly rival in the 30-day bet;
- financial skeptic;
- KPI-setter;
- occasional market forecaster;
- eventual helper if the relationship improves.

His arc is:

`Skeptical → Curious → Respectful → Supportive`.

When the relationship is strong, a key visual payoff occurs around Day 25: instead of standing outside the counter with crossed arms, he enters the shop and helps while wearing an apron.

## 5. Campaign structure

The campaign is authored for **30 days**, followed by procedural Day 31+ Endless Mode.

### Day 1–10 — Opening the shop

| Day | Story beat | System focus |
| --- | --- | --- |
| 1 | Joy opens the shop with borrowed money; husband defines the 30-day bet; JD asks to help. | Tutorial, difficulty, debt |
| 2 | JD's first real work day. | JD skill system |
| 3 | First recurring neighborhood customer. | Loyalty |
| 4 | Pork price rises. | Market |
| 5 | Husband asks where the profit is. | Books + family |
| 6 | JD notices suspicious behavior. | Security introduction |
| 7 | Weekend/lunch rush stresses the queue. | Patience + reputation |
| 8 | JD asks to own a role for a shift. | Assignment |
| 9 | Market warning creates stock-vs-debt decision. | Inventory strategy |
| 10 | **20% debt milestone.** | Debt milestone 1 |

### Day 11–20 — The neighborhood notices the shop

| Day | Story beat | System focus |
| --- | --- | --- |
| 11 | Neighborhood authority/community helper visits as a customer. | Neighborhood Trust |
| 12 | A customer reports a missing item. | Incident chain |
| 13 | Joy considers a guard vs security equipment. | Security upgrades |
| 14 | JD has a difficult day; player decides whether to rest JD. | Stamina + family |
| 15 | Husband acknowledges progress and creates a 5-day KPI. | Midpoint challenge |
| 16 | Nearby competitor discounts aggressively. | Pricing + demand |
| 17 | State-driven major operational event. | Director showcase |
| 18 | Gameified tax/bookkeeping inspection. | Books/tax |
| 19 | Husband argues for cash reserves over expansion. | Finance decision |
| 20 | **30% debt milestone.** | Debt milestone 2 |

### Day 21–30 — Final pressure

| Day | Story beat | System focus |
| --- | --- | --- |
| 21 | Local awareness spikes demand. | Demand |
| 22 | JD can unlock first high-level specialization. | JD progression |
| 23 | Advanced security incident. | Security climax |
| 24 | Large catering/group order opportunity. | Risk/reward |
| 25 | Husband may physically help during rush. | Family payoff |
| 26 | Late-campaign market shock. | Market climax |
| 27 | Final bookkeeping readiness check. | Books climax |
| 28 | Large neighborhood/security incident. | Community climax |
| 29 | Joy counts what remains and chooses final-day strategy. | Final planning |
| 30 | Longer final service day, final payment and ending. | Finale |

Day 30 should be roughly **1.5×** a normal day and must reflect the value of upgrades and relationships built across the run.

## 6. Day loop

The canonical day state machine is:

`Morning → Market → Prep → Story → Opening → Service → Closing → Books → Family → Summary → Save`

A day should not be represented by scattered booleans when an explicit phase enum/state machine can prevent invalid combinations.

Typical timing target:

- Day 1: 10–12 minutes
- Normal day: 7–10 minutes
- Major story day: 10–12 minutes
- Day 30: 12–15 minutes

Expected first campaign: roughly **4–6 hours**.

## 7. Core restaurant gameplay

The core loop must be genuinely playable:

1. Check market and stock.
2. Restock, select supplier and make upgrade decisions.
3. Assign JD.
4. Open the stall.
5. Receive customers and tickets.
6. Grill proteins.
7. Assemble plates.
8. Serve and score quality.
9. Handle dynamic incidents.
10. Close the day.
11. Review books and debt reserve.
12. Resolve story/family beat.
13. Save.

### Grill state

Proteins use explicit cooking states such as:

`Raw → Cooking A → Ready to Flip → Cooking B → Perfect → Overcooked → Burnt`

Cooking state records heat, elapsed time, flip count and quality.

Upgrades modify values such as:

- perfect window;
- cooking speed;
- burn rate;

rather than scattering `if upgrade` checks across the codebase.

### Plate model

Plating is data-driven before being visual.

A served plate can include:

- rice;
- proteins;
- sides;
- toppings;
- extras;
- cook quality.

The validator compares requested vs served plate and returns:

- accuracy;
- cook quality;
- speed;
- presentation.

## 8. Food content

The full campaign target remains approximately:

- **25 recipes**
- **23 ingredients**
- **10 gameplay customer archetypes**

Day 1 includes core cơm tấm combinations:

- cơm sườn
- cơm thịt nướng
- cơm sườn bì
- cơm sườn chả
- cơm sườn trứng
- cơm sườn bì chả
- cơm sườn bì chả trứng
- cơm đặc biệt

Base menu language is grounded in the visual reference:

- Sườn nướng 25.000
- Thịt nướng 22.000
- Bì 5.000
- Chả trứng 5.000
- Trứng ốp la 5.000
- Chả lụa 5.000
- Đồ chua 3.000
- Mỡ hành 2.000
- Dưa leo 2.000
- Cà chua 2.000
- Cơm tấm 3.000

These are ingredient/menu building-block values. Initial complete-dish tuning is roughly:

| Dish | Initial target |
| --- | ---: |
| Cơm sườn | 35K |
| Cơm thịt nướng | 32K |
| Cơm sườn bì | 40K |
| Cơm sườn chả | 40K |
| Cơm sườn trứng | 40K |
| Cơm sườn bì chả | 45K |
| Cơm sườn bì chả trứng | 50K |
| Cơm đặc biệt | 52–58K |

All balance values belong in centralized configuration and remain tunable through simulation.

## 9. Living Stall Director

The **Living Stall Director** is the central narrative/event orchestration layer.

It reads system state and decides which eligible authored or dynamic event should occur. It does **not** directly mutate economy, inventory or reputation.

Flow:

`Read State → Find Eligible Events → Score → Select → Dispatch Consequences`

Consequences are executed through the responsible domain systems.

### Event categories

- Story
- Operational
- Market
- Neighborhood
- Family
- Rare

### Event definition

Events support fields equivalent to:

- id
- category
- type
- priority
- day range
- conditions
- blocked conditions
- cooldown
- max per campaign
- slow-time mode
- decision timeout
- choices
- consequences
- follow-up events

### Daily event budget

Target:

- 1 Major Story Event
- 0–1 Major Operational Event
- 1–3 Minor Events
- 0–2 Ambient Events
- 0–1 Rare Event

Rare events are not guaranteed.

### Stress budget

The Director measures player stress using factors such as:

- waiting customers;
- active cooking items;
- unresolved tickets;
- JD stamina;
- running event load;
- stock pressure;
- imminent patience failures.

Initial rule:

- low stress → major operational event allowed;
- medium stress → minor events only;
- high stress → do not add new major pressure.

The Director must never spawn events purely because RNG says so when the player is already overloaded.

### Anti-repeat

Track:

- last triggered day;
- trigger count;
- choice history;
- result history.

Recently used events receive a repetition penalty. Completed chains can become permanently ineligible.

### Seeded randomness

Do not scatter `Math.random()`.

Each run has a `runSeed`. Random selection derives deterministic sub-seeds from values such as:

`runSeed + day + namespace`.

This supports replay, testing, debugging and Daily Challenge fairness.

## 10. Choice and consequence model

The campaign contains approximately **12 major decisions**, plus smaller daily choices.

Major decisions include:

1. Day 4 pricing response.
2. Day 6 suspicious person response.
3. Day 9 stock vs debt reserve.
4. Day 10 missed-payment response.
5. Day 13 guard vs camera.
6. Day 14 rest JD vs continue.
7. Day 16 competitor response.
8. Day 19 husband reserve plan vs reinvestment.
9. Day 20 debt handling.
10. Day 24 large order decision.
11. Day 26 market-shock response.
12. Day 29 final-day strategy.

Consequences can be:

- immediate;
- delayed;
- systemic;
- narrative.

Choices should not be presented as obvious `+5 / -5` optimization. The UI may show qualitative feedback such as “Husband seems more confident” while detailed statistics live in management screens.

## 11. Slow Time and event accessibility

Event interruption uses a hybrid model:

- large cutscene → full pause;
- important live event → roughly 25–35% game speed;
- minor event → no pause, lightweight notification.

Accessibility settings include:

- Standard Slow Time
- Extra Slow Time
- Auto Pause for Events
- No Timed Decisions

A player using No Timed Decisions must still be able to finish the complete campaign.

## 12. JD system

JD state includes:

- XP
- specialization progress
- stamina
- mood
- TrustWithJoy
- assigned role

JD gains experience primarily from the day's main assignment.

Repeated reassignment or overwork reduces efficiency and can affect mood/family state.

High-level JD abilities can open contextual event choices, such as:

- inspecting camera;
- spotting suspicious behavior early;
- improving cashier throughput;
- helping community interactions.

JD is a strategic resource but not unlimited free labor.

## 13. Market system

Each morning shows a **Bản tin Chợ Sáng / Morning Market Brief** containing:

- ingredient price changes;
- short trend forecast;
- demand modifiers;
- weather or local event context when relevant.

Ingredients have values equivalent to:

- base price;
- current price;
- volatility;
- shelf life;
- supplier quality.

Supplier archetypes:

- wholesale market — cheap, volatile;
- regular supplier — medium, stable;
- premium supplier — expensive, better quality/reputation.

Player actions:

- buy normally;
- buy extra;
- reduce stock;
- change supplier;
- sign supply agreement;
- emergency purchase;
- adjust menu/prices.

Inventory freshness is grouped into readable states such as:

- Fresh
- Okay
- Use Soon
- Spoiled

The game must prevent the “buy infinite stock when cheap” strategy through shelf life and working capital.

## 14. Books and gameified tax system

This is **not** a simulation of current Vietnamese law.

The game uses familiar concepts such as:

- revenue;
- costs;
- receipts;
- records;
- inspections;
- operating paperwork;

but avoids real legal sections, exact statutory fines or live tax advice.

The main metric is **Book Accuracy (0–100)**.

Transactions include:

- purchases;
- revenue;
- guard wages;
- upgrades;
- debt reserve transfer;
- operating costs.

Story incidents can create an actual-vs-recorded discrepancy.

Upgrade path can include:

- notebook;
- calculator/cash register;
- POS;
- digital bookkeeping;
- bookkeeping help.

A recurring fictional administrative/tax NPC behaves professionally and can react to clean or messy books. Humor comes from shop operations and the family, not corruption or bribery.

## 15. Security, theft and guards

Security is a connected system rather than random money loss.

Theft incident progression:

`Appear → Observe → Target → Attempt → Escape`

Possible fictional behavior types:

- opportunistic small theft;
- pickpocketing;
- cash-targeting;
- fake-customer behavior;
- returning repeat offender.

No thief archetype may be based on ethnicity, class, profession or another protected/social stereotype.

Detection combines factors such as:

`JD Awareness + Guard Detection + Camera + Lighting + Neighborhood Trust`.

### Guard roster

At least three distinct guard NPCs:

- **Chú Tám** — friendly, affordable, moderate detection.
- **Anh Hùng** — fast, intimidating, lower customer comfort.
- **Cô Lan** — highly reliable and observant, expensive.

Guard stats:

- Detection
- Speed
- Intimidation
- Customer Care
- Reliability
- Stamina

Guards may be hired by shift. Strong intimidation can trade security for customer comfort.

## 16. Police and Neighborhood Trust

Police/community-order content is gameified rather than legally exact.

A recurring neighborhood officer/community safety NPC can appear for:

- missing property;
- disturbances;
- security follow-up;
- checking camera evidence;
- local traffic/order incidents.

Main metric:

**Neighborhood Trust (0–100)**

Trust rises through:

- clean operation;
- good incident handling;
- customer care;
- helping the neighborhood;
- cooperation during problems.

Trust can produce benefits such as:

- early warning about suspicious behavior;
- stronger repeat customer traffic;
- neighbors helping with small problems;
- extra community events.

Trust does not eliminate risk entirely.

## 17. Family and debt system

Two main relationship metrics:

- **Family Trust**
- **Husband Confidence**

The husband is not just a debt collector. Event archetypes include:

- finance;
- market prediction;
- challenge;
- help;
- comedy;
- relationship payoff.

Some of his market predictions may be wrong. The story should allow Joy to be right, the husband to be right, both to be wrong, and JD to comment humorously.

## 18. Fail-forward model

Most problems create consequences rather than ending the campaign.

Examples:

- low cash → supplier credit / reduced menu;
- theft → lost cash or stock + higher security pressure;
- bookkeeping problem → time cost, gameified penalty, Trust impact;
- customer leaves → Reputation loss;
- burnt food → ingredient loss and combo reset;
- missed installment → tighter husband conditions.

Only Day 30 resolves the major campaign outcome.

## 19. Endings

The campaign resolves to one of six endings. Conditions are configurable, but resolution order is deterministic.

### Priority order

1. **Bà Chủ Cơm Tấm Sài Gòn** — Perfect
2. **Quán Của Cả Nhà** — Family hidden ending
3. **JD — Trợ Thủ Mùa Hè** — JD hidden ending
4. **Quán Ruột Của Cả Khu Phố** — Neighborhood ending
5. **Chồng Giữ Két** — incomplete debt but viable shop
6. **Làm Lại Cho Đàng Hoàng** — comeback ending

Initial target thresholds use normalized 0–100 system metrics and 0–5 Reputation, with final numbers tuned through simulation rather than hardcoded throughout the codebase.

### Perfect

Requires:

- 100% debt paid;
- very high Reputation;
- strong Neighborhood Trust;
- clean books;
- good security;
- healthy JD development;
- strong family/husband confidence;
- meaningful customer loyalty.

### Family

Requires:

- 100% debt paid;
- exceptional Family Trust;
- exceptional Husband Confidence;
- strong JD relationship;
- key family-first decision flags.

Endless unlock: husband becomes a usable finance/logistics manager.

### JD

Requires:

- 100% debt paid;
- very high JD specialization and TrustWithJoy;
- no persistent overwork pattern;
- JD-specific story chain completed.

Endless unlock: JD specialization level 2 systems.

### Neighborhood

Can override the standard finance ending when the shop is extremely strong socially and economically viable, even if a very small debt balance remains.

Requires:

- roughly 90%+ debt completion;
- exceptional Neighborhood Trust;
- exceptional Reputation;
- strong loyalty/customer community state.

Endless unlock: premium neighborhood/community event pool.

### Husband Finance

Requires:

- debt not fully paid;
- shop remains economically viable;
- Reputation not collapsed.

Endless modifier: husband controls major budget decisions until the player earns back Financial Freedom.

### Comeback

Used when debt is far behind and several business-health metrics are poor.

The shop is reduced rather than deleted. Day 31 begins a comeback mode retaining selected progress.

## 20. Endless Mode

Every ending supports **Continue → Endless**.

Endless replaces fixed campaign story beats with:

- event pools;
- seasonal arcs;
- expansion milestones;
- procedural market conditions.

Ending-specific state injects permanent modifiers or unlocks.

## 21. Replay and campaign journal

Each day records meaningful moments in **Nhật ký 30 ngày / 30-Day Journal**.

Examples:

- first debt milestone;
- JD spotting a suspicious customer;
- Joy resting JD;
- successful book inspection;
- repeat thief resolved;
- husband first helping in the stall.

At Day 30, the ending montage is generated from actual run history.

The campaign menu initially shows six hidden ending silhouettes. Discovered endings enter an **Album 30 Ngày**.

## 22. UX/UI design

### Main desktop composition

Desktop is locked to the reference hierarchy:

- **Left:** charcoal grill + menu board
- **Center:** large glass food display
- **Right:** rice pot + utensils/condiments
- **Bottom foreground:** plating/service counter

The whole stall should be understandable at a glance in landscape.

### HUD

Top-left:

- day;
- clock;
- day/service progress.

Top-center/right:

- Shop Cash;
- Debt Reserve;
- Reputation;
- settings.

Compact management indicators can include:

- Neighborhood Trust;
- Security;
- Book Accuracy;
- Family;
- JD.

Food and service interaction remain visually dominant.

### Morning Brief

Four information blocks:

- market;
- forecast;
- objective;
- family/messages.

The player sees enough information to make a strategic decision before opening.

### Dialogue

Dialogue overlays the live stall rather than becoming a full-screen visual novel.

- short turns;
- 2–3 responses;
- contextual choices;
- no raw numeric optimization hints.

### Market Board

Shows:

- current price;
- price direction;
- short trend forecast;
- stock-duration preview;
- supplier and purchase actions.

### Debt screen

Title: **KÈO 30 NGÀY**

Displays:

- original debt;
- paid amount;
- remaining amount;
- milestones;
- husband comment;
- Husband Confidence.

### JD panel

Shows:

- level;
- stamina;
- mood;
- specialization;
- today's role.

### End-of-day summary

Shows:

- revenue;
- expenses;
- profit;
- changes in key system metrics;
- JD XP;
- important events;
- Continue button.

## 23. Mobile UX

Mobile does not shrink the entire desktop stall.

It uses focus anchors:

`Grill ↔ Display ↔ Plating ↔ Customers`

The user can change station through swipe or bottom navigation.

Events in another area generate a tappable alert that focuses the relevant station.

Management panels become nearly full-screen bottom sheets.

Requirements:

- no horizontal browser scroll;
- comfortable touch targets;
- close/back behavior always available;
- same underlying simulation as desktop.

## 24. Overlay safety

All blocking overlays are managed by a single **OverlayManager**.

It owns:

- dialogs;
- sheets;
- event overlays;
- settings;
- confirmations.

Rules:

- one blocking overlay at a time;
- visible close action where appropriate;
- Escape support on desktop;
- correct backdrop rules;
- focus trap for DOM dialogs;
- restore focus on close;
- no arbitrary extreme z-index values;
- closing an overlay always restores game interaction.

This exists specifically to prevent stuck-popup regressions.

## 25. Economy targets

The economy should regularly force decisions such as:

- camera vs debt reserve;
- stock up vs spoilage;
- guard vs JD camera duty;
- accept large order vs overload;
- buy POS vs save for installment.

### Target profit envelope

Approximate potential for a well-played run before major discretionary upgrades:

| Segment | Easy | Normal | Hard |
| --- | ---: | ---: | ---: |
| Days 1–10 | 4.5M | 8M | 12.5M |
| Days 11–20 | 7.5M | 13M | 20M |
| Days 21–30 | 11M | 19M | 30M |
| Total | 23M | 40M | 62.5M |

These are balance targets, not guaranteed payouts.

Hard creates more risk **and** more high-value opportunities so the 50M target remains achievable by strong play.

### Ticket model

One customer interaction can represent multiple meals.

Typical order forms:

- individual 1–2 meals;
- friend group 2–4;
- office 5–12;
- delivery batch 3–8;
- catering 20–100 through a specialized challenge.

This prevents the game from requiring 150 separate NPC interactions per day.

### Upgrades

Initial price targets:

- better grill rack ~650K;
- grill Lv.2 ~1.2M;
- larger rice cooker ~850K;
- prep table ~700K;
- safe lock ~250K;
- security lighting ~350K;
- camera Lv.1 ~600K;
- camera Lv.2 +1M;
- camera Lv.3 +1.6M;
- cash register ~450K;
- POS ~900K;
- digital bookkeeping ~1.4M;
- inventory system ~1.6M;
- catering setup ~2M.

Guard shift examples:

- Chú Tám ~160K
- Anh Hùng ~280K
- Cô Lan ~380K

All economy values must live in centralized balance data.

## 26. Production architecture

Required stack:

- TypeScript
- Phaser 3
- DOM/CSS
- Vite
- Cloudflare Workers
- Cloudflare D1
- PWA
- Vitest
- Playwright
- no React

Recommended structure:

```text
src/
  client/
    game/
      scenes/
      entities/
      interactions/
    systems/
      economy/
      debt/
      market/
      jd/
      customers/
      cooking/
      inventory/
      security/
      books/
      neighborhood/
      family/
      reputation/
      progression/
    director/
      LivingStallDirector.ts
      EventSelector.ts
      StressBudget.ts
      EventBudget.ts
      ConsequenceEngine.ts
      EndingResolver.ts
    campaign/
    data/
    state/
    ui/
    audio/
    i18n/
    api/
    pwa/
  shared/
    types/
    schemas/
    constants/
    seededRandom.ts
  worker/
    index.ts
    router.ts
    middleware/
    auth/
    save/
    leaderboard/
    daily/
    endless/
public/
  assets/
  audio/
  icons/
migrations/
tests/
  unit/
  integration/
  e2e/
  fixtures/
scripts/
docs/
```

Avoid monolithic multi-thousand-line files. A file approaching roughly 400–600 lines because it owns multiple responsibilities should trigger a boundary review.

## 27. State architecture

Use one authoritative `GameState` split into domains:

- meta;
- campaign;
- economy;
- debt;
- market;
- inventory;
- customers;
- cooking;
- JD;
- security;
- books;
- neighborhood;
- family;
- reputation;
- director;
- journal;
- settings.

Systems mutate their own domain through explicit actions/services.

The Director never directly changes money or inventory.

## 28. Phaser vs DOM responsibilities

### Phaser

- stall scene;
- grill;
- food;
- drag/drop;
- plate;
- customers;
- animations;
- camera;
- visual effects;
- station interaction.

### DOM/CSS

- HUD;
- dialogue;
- market;
- debt;
- JD;
- books;
- account;
- settings;
- accessibility;
- ending;
- menus.

## 29. Local-first save

Story Mode must work without an account.

Local save supports:

- autosave at safe phase boundaries;
- resume mid-day;
- day-start checkpoint;
- save schema versioning;
- migration functions between schema versions.

Closing the browser or losing network must not destroy Story Mode.

## 30. Cloud save

Logged-in players can sync a local run.

Cloud save uses monotonic revision numbers.

If Device A writes revision 8 after loading 7, Device B attempting to write based on 7 receives a conflict rather than silently overwriting.

Conflict UI offers explicit resolution choices.

## 31. Authentication

Follow the proven Cloudflare patterns from `tiem-mi-cay`:

- WebCrypto-compatible password hashing;
- per-password salt;
- random session tokens;
- database stores session-token hash, not raw token;
- HttpOnly cookie;
- SameSite=Lax;
- Secure under HTTPS;
- expiration;
- no auth token in localStorage.

## 32. Server API

Namespace:

`/api/v1/`

Target routes include:

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me

### Save
- GET /save
- PUT /save

### Leaderboards
- GET /leaderboards/campaign
- GET /leaderboards/endless
- GET /leaderboards/daily
- GET /leaderboards/reputation

### Daily
- GET /daily
- POST /daily/start
- POST /daily/finish

### Endless
- POST /endless/start
- POST /endless/finish

### Health
- GET /health

The normal Story Mode must not require constant server requests.

## 33. D1 data

Core backend tables:

- accounts
- sessions
- cloud_saves
- daily_challenges
- daily_runs
- endless_runs
- leaderboard_entries
- run_tokens
- rate_limits

Do not stream every gameplay interaction to D1.

## 34. Daily Challenge and online validation

Daily Challenge uses a shared date-based seed and can define:

- market;
- customer pattern;
- event modifiers;
- difficulty.

Start endpoints issue short-lived run tokens containing appropriate challenge metadata.

Finish endpoints validate token, seed/context, score shape and replay rules.

This is not perfect anti-cheat, but the server should not blindly accept arbitrary client scores.

## 35. PWA and offline

The PWA caches the application shell and enough assets to play the core Story Mode offline after a successful initial load.

Prefer bundle/lazy-cache groups:

- boot;
- Day 1/stall core;
- characters;
- dynamic event content.

Do not force the user to download the entire campaign before seeing the start screen.

Update logic must avoid mixed old/new HTML, JavaScript and asset versions.

## 36. Art direction

Primary visual style:

**Original hand-painted Vietnamese cozy realism + premium casual management-game UI.**

Characteristics:

- warm natural daylight;
- tactile food;
- painterly but readable surfaces;
- softly stylized human proportions;
- cream/brown UI;
- red stools;
- warm wood;
- greenery/street atmosphere;
- no pixel-art;
- no photorealistic clone of the supplied reference.

The supplied image is a **composition reference**, not a tracing target.

## 37. Character art

### Joy

Signature:

- Vietnamese adult woman;
- practical tied hair;
- warm floral/orange-yellow clothing;
- shop apron.

Expression set includes:

- neutral;
- smile;
- focused;
- worried;
- annoyed;
- shocked;
- proud;
- tired;
- laughing;
- determined.

### JD

Signature:

- blue cap;
- casual clothing;
- small apron/badge;
- energetic posture.

Expression set includes:

- happy;
- confused;
- focused;
- tired;
- proud;
- mistake;
- surprised;
- suspicious;
- excited;
- embarrassed.

Progression can add a “Trợ thủ mùa hè” badge without changing identity.

### Husband

Signature:

- practical casual outfit;
- finance/logistics props when appropriate;
- never visually villainous.

Expressions include:

- skeptical;
- counting;
- smirk;
- surprised;
- concerned;
- helping;
- respectful;
- defeated-in-bet.

## 38. Other NPC art

Administrative/tax and police/community-order characters are fictionalized game NPCs and must not copy exact real-world agency insignia or imply legal accuracy.

At least three visually distinct guards are required.

Customer system supports roughly 10 gameplay archetypes and around 24–32 appearance variants.

Customer mood states include:

- happy;
- neutral;
- waiting;
- impatient;
- angry;
- delighted.

## 39. Environment art

The stall is layered rather than baked into one static image.

Layers include:

- far street;
- buildings/trees;
- seating;
- customer zone;
- stall structure;
- food display;
- interactive stations;
- foreground counter;
- VFX;
- HUD.

Visual upgrades such as cameras, POS, grill level, rice cooker and signage should appear physically in the stall.

## 40. Food art

Food is the highest-priority asset category.

Sườn and other grilled proteins require visually distinct cooking states rather than simple tinting.

Display trays support visible stock states:

- full;
- medium;
- low;
- empty.

Plate ingredients use a shared perspective and coordinate system so layered dishes remain attractive.

Do not bake dynamic prices or labels into generated food art.

## 41. Media consistency

AI-generated art must use a common style reference/prefix and locked reference sheets for Joy, JD and husband.

All plate toppings must share the same perspective.

Reject inconsistent asset generations rather than stretching/scaling them into place.

No production gameplay asset may contain:

- AI-garbled dynamic text;
- watermark;
- placeholder emoji;
- accidental baked background;
- inconsistent character identity.

## 42. Audio

Audio buses:

- Master
- Music
- Ambience
- SFX
- UI

Ambience can include:

- distant street traffic;
- indistinct conversation;
- fan;
- grill;
- plates;
- subtle outdoor atmosphere.

Grill audio uses a controller that mixes sizzle intensity rather than starting a separate endless loop per meat item.

Music direction is cozy Vietnamese-inspired instrumental, original or clearly licensed.

All third-party media requires attribution/license documentation.

## 43. Asset pipeline

Asset references live in a manifest.

Metadata can include:

- id;
- path;
- type;
- dimensions;
- bundle;
- license.

Build validation fails when a declared asset is missing.

This is a hard requirement intended to prevent runtime 404 regressions.

Asset production order:

1. Day 1 vertical slice.
2. Core campaign assets.
3. Story-specific expressions/scenes.
4. Endings and Endless expansion assets.

Do not mass-produce full campaign art before Day 1 visual quality is accepted.

## 44. Responsive visual targets

Primary desktop targets:

- 1152×648
- 1280×720
- 1440×900

Mobile targets include:

- 390×844
- approximately 360px wide

Desktop must show the full stall hierarchy.

Mobile uses camera anchors rather than shrinking the entire stall.

## 45. Accessibility

Required:

- keyboard-accessible DOM controls;
- visible focus;
- ARIA labels;
- non-color-only status indicators;
- reduced motion;
- music/SFX controls;
- Auto Pause;
- Extra Slow Time;
- No Timed Decisions;
- comfortable touch targets.

Vietnamese is the default locale. English covers all user-facing text.

## 46. Security and production boundaries

Worker applies appropriate:

- CSP;
- frame protection;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- input validation;
- body limits;
- auth validation;
- same-origin checks for sensitive writes;
- rate/quota controls.

Do not use fake “anti-view-source” UI tricks as a security claim.

No secrets are committed.

## 47. Debug tooling

Development build can expose a Director/State inspector showing:

- day;
- cash;
- debt;
- market;
- JD;
- security;
- books;
- family;
- stress;
- event budget;
- eligible/blocked events;
- seed.

Debug tools may:

- jump day;
- set state;
- trigger events;
- force ending fixtures;
- dump state.

They must not be present as an exposed production feature.

## 48. Automated validation

### Unit coverage focus

- economy;
- market;
- debt;
- cooking;
- order validation;
- Director;
- event eligibility;
- consequences;
- ending resolver;
- save migration;
- seeded RNG.

### Integration examples

- market spike → ingredient cost → margin → summary;
- theft → guard → security → Neighborhood Trust.

### E2E

Required flows include:

- New Game;
- difficulty selection;
- Day 1 Morning Brief;
- grill;
- flip;
- plating;
- correct serve;
- wrong serve;
- JD;
- Market;
- Debt Reserve;
- end day;
- reload;
- mobile;
- overlays;
- login/cloud save;
- revision conflict.

## 49. Campaign simulation

Run headless 30-day simulations using at least four strategy profiles:

- Poor
- Average
- Good
- Optimized

Balance target:

- Easy: Average usually can complete debt.
- Normal: Good usually can complete debt; Average feels pressure and can recover.
- Hard: Good/Optimized can win; Poor/Average often land in lower endings.

Simulation informs tuning; it does not replace browser playtesting.

## 50. Director fuzz tests

Generate many random state combinations and validate invariants such as:

- no two blocking major events simultaneously;
- no major pressure event at extreme stress;
- cooldowns respected;
- no JD-required event when JD unavailable;
- no guard/camera choice before unlock;
- no future story event early;
- no completed chain restarting improperly.

## 51. Save release gate

Save is a release blocker.

Test:

- Day 1;
- Day 10;
- before a debt milestone;
- Day 29;
- Endless.

Reload must restore:

- money;
- inventory;
- JD;
- Director cooldowns;
- flags;
- choices;
- journal;
- safe gameplay state.

Schema migration fixtures cover old versions.

## 52. Ending release gate

Each ending has a deterministic state fixture.

Resolver tests must also cover states that satisfy more than one ending and confirm the defined priority order.

Every ending must transition successfully to its Endless modifier.

## 53. Offline release gate

Test:

1. Open successfully online.
2. Play and save.
3. Close.
4. Disable network.
5. Reopen.

Expected:

- app loads;
- Story save loads;
- restaurant gameplay works;
- network-only features degrade gracefully.

Failure of `/api/auth/me` must never create a blank Story Mode screen.

## 54. Overlay regression gate

Automated browser tests sequentially open and close:

- Settings
- JD
- Market
- Debt
- Books
- Dialogue
- Event overlay

After each close:

- blocking overlay count is zero;
- game interaction is restored;
- DOM focus is restored appropriately.

## 55. Asset/content release gate

Production target:

- runtime asset 404: **0**
- missing manifest asset: **0**
- missing dialogue key: **0**
- missing authored campaign day: **0**
- broken recipe/ingredient reference: **0**
- production placeholder media: **0**

Build/content validation should catch these before runtime where possible.

## 56. Performance release gate

Targets:

- typical desktop: around 60 FPS;
- common mobile: stable around 30 FPS minimum.

Stress test includes:

- full queue;
- full grill;
- smoke;
- rain;
- security event;
- overlay.

Long-running accelerated tests check memory leaks, duplicated listeners and audio-instance growth.

## 57. Production browser gate

Before a release, browser QA must inspect at minimum:

- desktop Day 1;
- mobile Day 1;
- mid-campaign fixture;
- security event;
- market;
- debt;
- daily summary;
- ending fixture.

Production console target:

- uncaught JS errors: 0
- asset 404s: 0
- unhandled promise rejections: 0

## 58. Required command gate

Before final release push, the implementation must successfully run the repository's equivalents of:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run db:local
npm run test:e2e
```

If an environment limitation prevents a command from running, the final report must state that explicitly rather than claiming a pass.

## 59. CI and Git discipline

CI runs at minimum:

`typecheck → lint → unit/integration → build`

E2E may be a separate required release job.

Do not disable failing tests to obtain a green pipeline.

No force push.

Do not commit:

- secrets;
- .env credentials;
- node_modules;
- temporary junk;
- unbounded screenshot/video output.

## 60. Cloudflare release boundary

The repository must be ready for:

- Worker: `tiem-com-tam`
- D1: `tiem-com-tam`
- optional custom domain: `comtam.aunomay.com`

The project may prepare:

- `wrangler.toml`;
- D1 migrations;
- build/deploy scripts;
- deployment documentation;
- CI.

A live production Cloudflare deployment requires separate authorization and is not implied by code completion.

## 61. Definition of Done

The first production release is complete only when all of the following are true:

- Day 1–30 can be completed.
- Day 31+ Endless starts from every ending.
- The desktop stall clearly shows grill-left, display-center, rice-right, plating-bottom.
- Cooking and plating are interactive.
- 30 authored story days exist.
- JD, Market, Books/Tax, Security/Theft, Guards, Police/Neighborhood and Family/Debt systems function.
- Approximately 25 recipes and 23 ingredients are implemented.
- 10 gameplay customer archetypes exist.
- 12 major decisions are wired.
- 6 endings resolve correctly.
- Local save works.
- Cloud save and revision conflict work.
- Daily/Endless leaderboard flows are wired.
- Story Mode works offline after initial load.
- Vietnamese and English user-facing content are complete.
- No production placeholder emoji/art remains.
- Asset 404 count is zero.
- Blocker/Critical/Major known release bugs are zero.
- Typecheck, lint, tests and production build pass.
- Required desktop/mobile browser QA passes.
- README documents setup, architecture, tests and Cloudflare preparation.

## 62. Antigravity completion contract

Implementation is **not complete merely because code was generated or the build passed**.

Completion requires:

**code + authored content + media + automated verification + real browser QA + production build**.

The final implementation report must state evidence, not hidden reasoning:

- repository;
- final commit;
- build result;
- typecheck;
- lint;
- unit/integration tests;
- E2E;
- 30/30 campaign validation;
- content counts;
- desktop/mobile QA;
- runtime error/404 status;
- D1 local result;
- production deployment status;
- known issues/blockers.

If a required step did not run, report it as not run.

---

## Approved design summary

The game is fundamentally:

> **Joy has 30 days to turn money borrowed from her husband into a real Cơm Tấm Sài Gòn business, while JD spends the summer helping her and the shop survives customers, the market, bookkeeping, security problems and neighborhood life.**

The campaign should feel like a playable Vietnamese family sitcom built on top of a serious restaurant-management simulation.
