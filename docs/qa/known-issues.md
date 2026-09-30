# Known Issues & Operational Notes — Tiệm Cơm Tấm v1.0.0

## Summary
- **Blocker:** 0
- **Critical:** 0
- **Major:** 0
- **Minor / Operational:** 2 (documented below)

---

## Operational Constraints & Non-Blocking Observations

### 1. Cloudflare Production Live Deployment Pending Owner Authorization
- **Severity:** Operational / Information (Not a bug)
- **Description:** Live deployment of the Cloudflare Worker and production D1 database (`npm run db:remote` and `npx wrangler deploy`) has not been executed per project policy requiring explicit repository owner authorization.
- **Verification Status:** 100% verified against local D1 emulation (`npm run db:local`) and local integration test harnesses.
- **Action Required:** Follow `docs/deployment/cloudflare.md` when repository owner is ready to provision production D1 and deploy.

### 2. Vite Chunk Size Warning on Phaser 3 Engine Bundle
- **Severity:** Minor / Optimization Warning
- **Description:** During `npm run build`, Rollup emits a warning that `dist/assets/index-*.js` exceeds 500 kB (minified ~1.58 MB, gzipped ~370 kB) due to bundling the Phaser 3 game engine.
- **Impact:** None on gameplay or offline experience. The PWA Service Worker caches the production bundle on initial load, providing instant offline reloads.
- **Future Recommendation:** Consider dynamic `import('phaser')` code-splitting if bundle size optimization is desired in v1.1.
