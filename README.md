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
| `ADMIN_PASSWORD`  | No       | Admin password. Defaults to `admin` if unset.           |
| `SESSION_SECRET`  | No       | Secret used to sign the admin session cookie.           |
| `SQLITE_PATH`     | No       | Override the SQLite file path. Defaults to `data/soba.db`. |

### Admin access

Log in at `/admin` with the value of `ADMIN_PASSWORD` (default `admin`).

## Build

```bash
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it in Vercel and add the `ADMIN_PASSWORD` (and optionally
   `SESSION_SECRET`) environment variable in **Project Settings → Environment
   Variables**.
3. Deploy.

**Note on SQLite on Vercel**: Vercel's filesystem is read-only and ephemeral,
so the database is stored under `/tmp` on Vercel and **resets between
invocations**. SQLite here is intended for local development and demos only.
For a persistent production store, replace the data layer in `src/lib/db.ts`
with a hosted database (e.g. Supabase/Postgres).

## Project structure

```
src/
  app/            # App Router pages (storefront + admin + API routes)
  components/     # Client components (box configurator, product card, etc.)
  data/           # Demo product, shipping, box, and address data
  lib/            # DB access, auth, pricing helpers
```

## Data model (SQLite)

- `products` — product master (seeded from `src/data/products.ts`)
- `seasonal_box_templates` — seasonal box template (seeded)
- `orders` — order header (order number, address, totals, status)
- `order_items` — order lines (snapshot of name, price, weight at order time)
