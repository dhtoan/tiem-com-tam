# Cloudflare Workers & D1 Deployment Guide

This document describes how to configure, migrate, and deploy **Tiệm Cơm Tấm** to Cloudflare Workers and Cloudflare D1.

> [!CAUTION]
> **DEPLOYMENT POLICY:** Live production deployment to Cloudflare (`wrangler deploy` / `wrangler d1 migrations apply DB --remote`) is **NOT RUN** without explicit repository owner authorization. All automated and CI tests run strictly against local SQLite emulation (`npm run db:local`).

---

## 1. Cloudflare Architecture Overview

```
                      +---------------------------------------+
                      |   Cloudflare Edge (Workers + D1)      |
                      |   Target Domain: comtam.aunomay.com   |
                      +-------------------+-------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
+-------v-------+                 +-------v-------+                 +-------v-------+
|  Static PWA   |                 |   Edge API    |                 |   Cloudflare  |
|  Assets (/dist|                 | (Auth, Cloud  |                 |  D1 Database  |
|  via ASSETS)  |                 |  Save, Scores)|                 | (SQLite Edge) |
+---------------+                 +---------------+                 +---------------+
```

---

## 2. Configuration Targets

| Component | Target Identifier | Description |
| :--- | :--- | :--- |
| **Worker Service** | `tiem-com-tam` | HTTP REST router handling auth, sync, leaderboards |
| **D1 Database** | `tiem-com-tam-db` | Serverless SQLite database backing edge API |
| **Static Assets** | `./dist` | Vite production bundle served via Worker asset binding |
| **Production Domain** | `comtam.aunomay.com` | Optional custom domain route |

---

## 3. Local Development & Local D1

To test and develop with local D1 database without Cloudflare credentials:

```bash
# 1. Apply schema migrations to local SQLite runner
npm run db:local

# 2. Run local unit & integration tests against local D1
npm run test:run

# 3. Test edge worker routes locally with Wrangler dev
npx wrangler dev
```

The migrations are located in `migrations/` and contain:
- `0001_initial_schema.sql`: Users, sessions, saves, daily challenges, and leaderboard records.

---

## 4. Production Provisioning (Owner Action)

When the repository owner is ready to deploy to live production:

### Step 1: Create Production D1 Database
```bash
npx wrangler d1 create tiem-com-tam-db
```

Output example:
```text
✅ Successfully created DB 'tiem-com-tam-db'!
[[d1_databases]]
binding = "DB"
database_name = "tiem-com-tam-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Update `wrangler.toml`
Replace the local placeholder ID with the generated UUID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "tiem-com-tam-db"
database_id = "REPLACE_WITH_D1_DATABASE_ID"
migrations_dir = "migrations"
```

### Step 3: Apply Remote Database Migrations
```bash
npm run db:remote
```

### Step 4: Configure Production Secrets
Set edge JWT secret and session salts:
```bash
npx wrangler secret put JWT_SECRET
```

### Step 5: Deploy Production Worker & Assets
```bash
npm run build
npx wrangler deploy
```

---

## 5. Verification Checklist

- [x] Local D1 migrations pass cleanly (`npm run db:local`)
- [x] Cloud save conflict resolution tests pass (`tests/e2e/cloud-conflict.spec.ts`)
- [x] Authenticated route integration tests pass (`tests/integration/auth.test.ts`)
- [x] Leaderboard edge endpoints pass (`tests/integration/leaderboards.test.ts`)
- [ ] Live production deploy (*Pending repository owner authorization*)
