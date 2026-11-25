# Soba House — 蕎麦海外ECサイト (MVP)

An MVP e-commerce storefront for Japanese soba noodles, built with
**Next.js (App Router) + TypeScript + Tailwind CSS**, with a local
**SQLite (better-sqlite3)** database for demo/test orders.

> **Demo only** — all products, prices, weights, and shipping rates are
> placeholder data defined under `src/data/`. This is not a real shop.

## Features

- **English storefront** (`/`) — top page, product list, product detail,
  preference-based filtering, per-product "How to Eat" guides, and a
  configurable **Seasonal Box** (3 noodles + 1 tsuyu) with real-time
  weight / shipping / total calculation.
- **Test ordering** — "Place Test Order" pre-fills a sample US address and
  saves the order (with price/name/weight snapshots) to SQLite.
- **Japanese admin** (`/admin`) — password-protected order list, packing
  screen, and a printable packing slip for customs declaration.

## Requirements

- Node.js 20+
- npm

## Local setup

```bash
npm install
cp .env.example .env        # set ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open http://localhost:3000 for the storefront and
http://localhost:3000/admin for the admin console.

### Environment variables

| Variable          | Required | Description                                             |
| ----------------- | -------- | ------------------------------------------------------- |
| `ADMIN_PASSWORD`  | Yes*     | Admin password. The `/admin` area is disabled until a strong (non-`admin`) password is set. |
| `SESSION_SECRET`  | No       | Secret used to sign the admin session cookie.           |
| `SQLITE_PATH`     | No       | Override the SQLite file path. Defaults to `data/soba.db`. |
| `DATABASE_URL`    | No       | PostgreSQL connection string. When set, the app uses PostgreSQL instead of SQLite. |
| `DATABASE_SSL`    | No       | Set to `true` to force TLS for PostgreSQL (auto-enabled for `sslmode=require` URLs). |

\* `ADMIN_PASSWORD` is required to use the admin console (and recommended for
production). It is intentionally *not* defaulted to a working password — when
unset or left as `admin`, sign-in and admin mutations are disabled.

### Admin access

Log in at `/admin` with the value of `ADMIN_PASSWORD`. The admin area (login,
admin mutations, and previously issued sessions) is disabled until a strong
(non-`admin`) password is configured.

## Build

```bash
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it in Vercel and add the following environment variables in
   **Project Settings → Environment Variables**:
   - `ADMIN_PASSWORD` — a strong, non-default password (required for `/admin`).
   - `SESSION_SECRET` — a long random string (recommended).
   - `DATABASE_URL` — a hosted PostgreSQL connection string (e.g. Supabase,
     Neon, or Vercel Postgres).
   - `DATABASE_SSL=true` — if your provider requires TLS (or append
     `?sslmode=require` to `DATABASE_URL`).
3. Deploy.

## Database

The app supports two interchangeable storage backends, selected automatically
by `src/lib/db.ts`:

- **SQLite** (default) — used when `DATABASE_URL` is unset. Intended for local
  development and demos only.
- **PostgreSQL** — used when `DATABASE_URL` is set. This is the persistent
  production backend (recommended for Vercel).

### Initializing PostgreSQL

The application applies the schema automatically on first run (see
`src/lib/db-postgres.ts`, which embeds the same DDL as `schema.sql` and also
seeds the `products` and `seasonal_box_templates` tables). You can also
initialize the schema manually:

```bash
# Option 1: run the migration file directly against your Postgres database
psql "$DATABASE_URL" -f schema.sql

# Option 2: via the Supabase SQL editor — paste the contents of schema.sql
```

Keep `schema.sql` and the embedded DDL in `src/lib/db-postgres.ts` in sync when
changing the schema.

### Supabase setup (manual)

The Supabase CLI is available via `npx supabase`, but creating a project
programmatically requires a personal access token (`SUPABASE_ACCESS_TOKEN`) or
an interactive `supabase login`. If neither is available, set up Supabase
manually:

1. Create an account and a new project at <https://supabase.com>. Name it
   `soba-ec-overseas` and pick a region close to your customers.
2. (Recommended) In **SQL Editor → New query**, paste the contents of
   `schema.sql` and click **Run**. This creates the `products`,
   `seasonal_box_templates`, `orders`, and `order_items` tables. This step is
   optional because the app applies the same DDL automatically on first run,
   but it gives you a clean, verified baseline.
3. Copy the connection string: **Project Settings → Database → Connection
   string**. Use the **URI** (or the **Session pooler** URI for serverless
   environments such as Vercel).
4. In Vercel **Project Settings → Environment Variables**, set:
   - `DATABASE_URL` — the connection string from step 3.
   - `DATABASE_SSL=true` — Supabase requires TLS. (Alternatively append
     `?sslmode=require` to `DATABASE_URL`.)

> **Note on this deployment:** the live project uses a **Neon** PostgreSQL
> database provisioned through the Vercel Marketplace (`vercel install neon`)
> because no Supabase access token was available in this environment. The app
> is provider-agnostic — any PostgreSQL `DATABASE_URL` works — so the Supabase
> steps above are the manual alternative and are fully interchangeable.

## Project structure

```
src/
  app/            # App Router pages (storefront + admin + API routes)
  components/     # Client components (box configurator, product card, etc.)
  data/           # Demo product, shipping, box, and address data
  lib/            # DB access, auth, pricing helpers
```

## Data model

The schema is identical for SQLite and PostgreSQL (see `schema.sql` for the
PostgreSQL DDL; `src/lib/db-sqlite.ts` has the SQLite equivalent).

- `products` — product master (seeded from `src/data/products.ts`)
- `seasonal_box_templates` — seasonal box template (seeded)
- `orders` — order header (order number, address, totals, status)
- `order_items` — order lines (snapshot of name, price, weight at order time)
