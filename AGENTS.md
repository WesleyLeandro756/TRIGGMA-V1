# TRIGGMA-V1

## Cursor Cloud specific instructions

### What this repository is

TRIGGMA is a multi-tenant referral / loyalty / rewards SaaS. This repo contains
a working **full-stack MVP** (web + responsive client app) plus the original
product specs/branding/mockups (`docs/`, `branding/`, `mockups/`, mostly on the
`cursor/triggma-mvp-spec-4348` branch). The MVP is implemented as an npm
workspaces monorepo and is intended to be portable to Lovable's React stack.

### Workspaces

- `server/` — Node + Express + TypeScript API run via `tsx` (no build step).
  Storage is **SQLite via `better-sqlite3`** (file at `server/data/triggma.db`).
  Implements the multi-tenant data model from `docs/modelo-dados-mvp.md`:
  tenants, tenant users (JWT auth), customers, campaigns, referral links,
  leads, conversions, point ledger, rewards, redemptions. Listens on `:4000`.
- `web/` — Vite + React + TypeScript + Tailwind SPA on `:5173`. Routes: `/`
  (landing site), `/login` (company auth), `/app` (company panel:
  dashboard/campaigns/conversions/rewards/customers), `/r/:slug` (public
  referral lead-capture), `/portal` + `/portal/login` (client portal with QR
  code, WhatsApp share, rewards redemption).

### Run / test / build (see `package.json` scripts)

- `npm run dev` — runs **both** server and web concurrently. Use this for dev.
- `npm test` — server end-to-end API test (`server/src/test/e2e.test.ts`).
- `npm run lint` — ESLint on the web app.
- `npm run build` — type-checks and builds the web app (production bundle).

### Non-obvious caveats

- The web dev server proxies `/api/*` to `http://localhost:4000` (see
  `web/vite.config.ts`); the frontend has no hardcoded API base URL.
- The SQLite DB is **auto-created and seeded only when empty** (first run). To
  apply changes to seed data in `server/src/db.ts`, delete `server/data/` and
  restart — editing seed code alone will not re-seed an existing DB. `npm test`
  is unaffected (it uses an isolated temp DB via `TRIGGMA_DB`).
- `server/data/` is git-ignored; never commit the local DB.
- Demo credentials (from the seed): company panel `admin@demo.com` /
  `triggma123`; client portal company `demo` + customer code `JOAO01`.
- `better-sqlite3` installs from a prebuilt binary; no native toolchain needed.
