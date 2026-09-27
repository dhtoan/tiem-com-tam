# Economy + Management Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Day 1 vertical slice into a deterministic management simulation with money, inventory, market, debt, upgrades, books, JD, family and reputation.

**Architecture:** Domain rules remain pure and independently testable. Financial effects flow through a single transaction ledger; market generation is seeded; debt reserve is separate from operating cash; UI consumes selectors rather than duplicating formulas.

**Tech Stack:** Existing Plan 01 stack.

**Spec:** `docs/superpowers/specs/2026-09-28-tiem-com-tam-story-systems-design.md`

## Global Constraints

- All tunable monetary values live in centralized balance data.
- No system may create NaN/negative stock/invalid metric ranges.
- Missing Day 10/20 debt milestones are fail-forward.
- Hard must add opportunity as well as pressure.
- JD is not unlimited free labor; stamina/mood matter.
- Bookkeeping uses actual-vs-recorded values and remains gameified.

## Review Focus

1. Double-click purchases must not duplicate transactions.
2. Debt Reserve withdrawal cannot make reserve negative.
3. Market generation for equal seed/day/difficulty must be identical.
4. Spoilage cannot reduce stock below zero.
5. JD stamina at zero must reduce effectiveness without breaking the day.

---

### Task 1: Implement the authoritative transaction ledger and books base

**Files:**
- Create: `src/client/systems/economy/transactions.ts`
- Create: `src/client/systems/books/ledger.ts`
- Create: `src/shared/types/economy.ts`
- Test: `tests/unit/economy-ledger.test.ts`

**Interfaces:**
- `applyTransaction(economy: EconomyState, books: BooksState, tx: Transaction): { economy: EconomyState; books: BooksState }`
- `Transaction` has stable `id`, `kind`, `amount`, `day`, `actualAmount`, `recordedAmount`, and optional metadata.
- Duplicate transaction IDs are idempotent.

- [ ] Write failing tests for revenue, ingredient cost, guard wage, upgrade, operating cost, and duplicate ID idempotency.
- [ ] Run `npm test -- tests/unit/economy-ledger.test.ts`; expect FAIL.
- [ ] Implement the transaction/ledger functions with integer đồng values only.
- [ ] Re-run the test; expect PASS.
- [ ] Commit: `feat: add authoritative economy ledger`.

### Task 2: Implement inventory, purchasing, freshness and spoilage

**Files:**
- Create: `src/shared/types/inventory.ts`
- Create: `src/client/systems/inventory/inventory.ts`
- Create: `src/client/data/ingredients.ts`
- Test: `tests/unit/inventory.test.ts`

**Interfaces:**
- `purchaseStock(input: PurchaseStockInput): PurchaseStockResult`
- `consumeStock(state: InventoryState, ingredientId: string, quantity: number): InventoryState`
- `advanceFreshness(state: InventoryState, dayCount: number): InventoryState`
- Freshness buckets: `fresh | okay | use-soon | spoiled`.

- [ ] Write failing tests for purchase, consumption, insufficient stock rejection, freshness progression, and spoilage floor at zero.
- [ ] Verify failure.
- [ ] Implement using batches so old stock can spoil before fresh stock.
- [ ] Verify PASS.
- [ ] Commit: `feat: add inventory freshness and spoilage`.

### Task 3: Implement deterministic market and suppliers

**Files:**
- Create: `src/shared/types/market.ts`
- Create: `src/client/systems/market/market.ts`
- Create: `src/client/data/suppliers.ts`
- Create: `src/client/data/marketBalance.ts`
- Test: `tests/unit/market.test.ts`

**Interfaces:**
- `generateMarket(input: { day: number; difficulty: Difficulty; runSeed: string; previous?: MarketSnapshot }): MarketSnapshot`
- `quoteSupplier(snapshot: MarketSnapshot, supplierId: string, ingredientId: string): SupplierQuote`
- `applySupplierContract(...): SupplierQuote`.

- [ ] Write failing deterministic-seed tests plus price floor/ceiling and contract-protection tests.
- [ ] Verify failure.
- [ ] Implement supplier archetypes wholesale/regular/premium and difficulty volatility multipliers from the spec.
- [ ] Verify PASS.
- [ ] Commit: `feat: add deterministic market and suppliers`.

### Task 4: Implement Debt Reserve and milestone settlement

**Files:**
- Create: `src/shared/types/debt.ts`
- Create: `src/client/systems/debt/debt.ts`
- Create: `src/client/data/difficultyBalance.ts`
- Test: `tests/unit/debt.test.ts`

**Interfaces:**
- `transferToDebtReserve(state: GameState, amount: number): GameState`
- `withdrawDebtReserve(state: GameState, amount: number): GameState`
- `getDebtMilestone(difficulty: Difficulty, day: 10 | 20 | 30): number`
- `settleDebtMilestone(state: GameState, day: 10 | 20 | 30): DebtSettlementResult`.

- [ ] Write failing tests for Easy/Normal/Hard exact debt/installment values, full payment, partial payment, zero reserve, and invalid withdrawal.
- [ ] Verify failure.
- [ ] Implement exact spec values and a structured `shortfall` result rather than Game Over.
- [ ] Verify PASS.
- [ ] Commit: `feat: add debt reserve and milestones`.

### Task 5: Add pricing, tips, daily costs, difficulty modifiers and modifiers registry

**Files:**
- Create: `src/client/systems/economy/pricing.ts`
- Create: `src/client/systems/economy/dailyCosts.ts`
- Create: `src/client/systems/progression/modifiers.ts`
- Create: `src/client/data/upgrades.ts`
- Test: `tests/unit/pricing-modifiers.test.ts`

**Interfaces:**
- `quoteDishPrice(recipeId: string, pricingState: PricingState): number`
- `calculateTip(input: TipInput): number`
- `calculateDailyOperatingCost(input: DailyCostInput): number`
- `collectModifiers(state: GameState, key: ModifierKey): number`.

- [ ] Write failing tests for ±5/10% pricing, difficulty tip multiplier, fixed operating-cost range, and upgrade modifier composition.
- [ ] Verify failure.
- [ ] Implement centralized balance tables; do not hardcode numbers in UI/renderers.
- [ ] Verify PASS.
- [ ] Commit: `feat: add pricing and upgrade modifiers`.

### Task 6: Implement JD progression and daily assignment

**Files:**
- Create: `src/shared/types/jd.ts`
- Create: `src/client/systems/jd/jd.ts`
- Create: `src/client/ui/jd/JDPanel.ts`
- Test: `tests/unit/jd.test.ts`
- Test: `tests/e2e/jd-panel.spec.ts`

**Interfaces:**
- `assignJD(state: JDState, role: JDRole): JDState`
- `awardJDXp(state: JDState, role: JDRole, amount: number): JDState`
- `applyJDWork(state: JDState, effort: number): JDState`
- `restJD(state: JDState): JDState`.

- [ ] Write failing tests for assignment, XP, specialization thresholds, stamina clamp 0–100, mood effect, and zero-stamina effectiveness.
- [ ] Verify failure.
- [ ] Implement safe roles only: cashier, service/runner, camera/awareness, shop-helper/prep-safe, family-support.
- [ ] Add JD panel browser test for assignment and responsive close.
- [ ] Verify and commit: `feat: add JD progression and assignment`.

### Task 7: Implement family, husband confidence, reputation and loyalty metrics

**Files:**
- Create: `src/shared/types/relationships.ts`
- Create: `src/client/systems/family/family.ts`
- Create: `src/client/systems/reputation/reputation.ts`
- Create: `src/client/systems/customers/loyalty.ts`
- Test: `tests/unit/relationships.test.ts`

**Interfaces:**
- `adjustFamilyTrust(value: number, delta: number): number`
- `adjustHusbandConfidence(value: number, delta: number): number`
- `adjustReputation(value: number, delta: number): number`
- `recordCustomerOutcome(loyalty: LoyaltyState, customerKey: string, outcome: ServeOutcome): LoyaltyState`.

- [ ] Write failing range/clamp and repeat-customer tests.
- [ ] Verify failure.
- [ ] Implement metric boundaries and loyalty progression.
- [ ] Verify PASS.
- [ ] Commit: `feat: add family reputation and loyalty metrics`.

### Task 8: Integrate management systems into Morning Brief and Day Summary

**Files:**
- Create: `src/client/ui/market/MarketBoard.ts`
- Create: `src/client/ui/debt/DebtPanel.ts`
- Create: `src/client/ui/books/BooksPanel.ts`
- Modify: `src/client/ui/morning/MorningBrief.ts`
- Modify: `src/client/ui/daySummary/DaySummary.ts`
- Test: `tests/e2e/management-loop.spec.ts`

**Interfaces:**
- UI reads selectors; it does not recompute debt/market/book formulas.

- [ ] Write failing E2E: Morning Brief displays deterministic market, purchase updates stock/cash/books, Debt transfer updates both pools, JD assignment persists, Day Summary shows revenue/cost/profit.
- [ ] Verify failure.
- [ ] Wire pure systems through store actions and selectors.
- [ ] Run `npm run typecheck && npm run test:run && npm run test:e2e -- tests/e2e/management-loop.spec.ts`; expect PASS.
- [ ] Commit: `feat: integrate management simulation into day loop`.
