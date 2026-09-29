# Tiệm Cơm Tấm — Cơm Tấm Sài Gòn

> A narrative management culinary simulation game set in a bustling alleyway of Sài Gòn.

---

## 🍛 Overview & Narrative

**Tiệm Cơm Tấm** puts you in the shoes of **Joy**, a resilient entrepreneur taking over a family broken rice stall with a 30-day deadline to clear a 30,000,000đ debt. Alongside your dedicated robotic assistive helper **JD** and navigating the realistic skepticism of your husband, you balance fast-paced grill cooking, ingredient markets, ledger accounting, neighborhood trust, and unexpected street incidents across 30 story-rich days.

### Core Pillars
- **Local-First Story Mode:** 100% playable offline with zero runtime server dependency. Every mechanic, story event, cutscene, and ending is self-contained in the browser.
- **Deep Economy & Bookkeeping:** Dynamic market prices, perishable batch inventory, daily debt installments, and market inspector audits.
- **Living Stall Director:** Dynamic event orchestration with stress budgets, mutex groups, cooldowns, and branching choices.
- **6 Canonical Campaign Endings:** Perfect Synergy, Family Harmony, JD Independence, Neighborhood Pillar, Financial Compromise, and Comeback Stall.
- **Endless Mode & Cloud Services:** Post-campaign infinite progression, daily seeded challenges, revisioned cloud saves, and global speedrun leaderboards via Cloudflare Workers & D1.

---

## 🛠️ Tech Stack

- **Frontend Core:** TypeScript Strict Mode (`noUncheckedIndexedAccess`, `noImplicitOverride`)
- **Game Engine & UI:** [Phaser 3](https://phaser.io/) + Semantic Accessible DOM UI Overlay System
- **Build System:** [Vite 6](https://vitejs.dev/) + Service Worker PWA Offline Shell
- **Testing Suites:** [Vitest](https://vitest.dev/) (Unit, Integration, Simulation, Fuzz) + [Playwright](https://playwright.dev/) (Desktop & Mobile E2E, Accessibility, Zero-Error Gates)
- **Edge Backend:** [Cloudflare Workers](https://workers.cloudflare.com/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite at the edge)

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js 22+ (tested on Node 22 and Node 24)
- npm 10+

### Installation
```bash
# Clone the repository
git clone https://github.com/dhtoan/tiem-com-tam.git
cd tiem-com-tam

# Install exact locked dependencies
npm ci
```

### Running Locally
```bash
# Start Vite development server (http://localhost:5173)
npm run dev

# Build production bundle to /dist
npm run build
```

---

## 🧪 Testing, Quality & Balance Gates

### Complete Verification Suite
```bash
# 1. Typecheck (Client & Edge Worker)
npm run typecheck

# 2. ESLint
npm run lint

# 3. Vitest Unit & Integration Suite
npm run test:run

# 4. Production Asset Integrity Validation (0 404s, 0 empty files)
npm run validate:assets

# 5. Full Content Catalog Validation (23 ingredients, 25 recipes, 10 archetypes, i18n parity)
npm run validate:content

# 6. Apply Local SQLite / D1 Migrations
npm run db:local

# 7. Headless Campaign Balance Simulation (1,000+ runs)
npm run simulate:campaign -- --runs 1000 --difficulty normal

# 8. Director Invariant Fuzz Harness (25,000+ randomized states)
npm run fuzz:director -- --runs 25000

# 9. Playwright End-to-End Regression Suite (Desktop & Mobile)
npm run test:e2e
```

---

## 📚 Content Catalog

- **23 Ingredients:** Gạo tấm, sườn heo, chả trứng, bì heo, trứng gà, tóp mỡ, nước mắm, hành lá, đồ chua, dưa leo, cà chua, sườn cây, ba rọi, ốp la lòng đào, tàu hủ ky tôm, và gia vị truyền thống.
- **25 Balanced Recipes:** Cơm Tấm Sườn Bì Chả, Sườn Cây Nướng Muối Ớt, Tàu Hủ Ky Tôm Thịt, Cơm Tấm Đại Vương Đặc Biệt, Cơm Tấm Đêm Bình Dân, v.v.
- **10 Customer Archetypes:** Công nhân, Dân văn phòng, Sinh viên, Hàng xóm, Khách quen, Shipper, Người lớn tuổi, Thực khách sành ăn, Khách du lịch, Gia đình nhỏ.
- **Bilingual Localization:** 100% key parity between Vietnamese (`vi`) and English (`en`).
- **Bounded Audio:** 5 audio mixer buses (`master`, `music`, `ambience`, `sfx`, `ui`) with singular dynamic meat sizzle loop and visibility auto-mute.

---

## 📖 Documentation Links

- [System Architecture Overview](docs/architecture/overview.md)
- [Cloudflare Deployment & D1 Setup Guide](docs/deployment/cloudflare.md)
- [Performance Baseline & Resource SLAs](docs/qa/performance-baseline.md)
- [Audio & Asset Credits](CREDITS.md)

---

## 📄 License

Proprietary © 2026 Aunomay Game Studio. All rights reserved.
