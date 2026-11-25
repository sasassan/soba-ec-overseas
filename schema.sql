-- Soba House — PostgreSQL schema for Vercel/Supabase persistence.
--
-- The application applies this same schema automatically on first run
-- (see src/lib/db-postgres.ts, which embeds an identical DDL). This file is
-- provided for manual initialization via the Supabase SQL editor, `psql`, or
-- any other migration tool:
--
--   psql "$DATABASE_URL" -f schema.sql
--
-- Keep this file and the embedded DDL in src/lib/db-postgres.ts in sync.

CREATE TABLE IF NOT EXISTS products (
  code TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  category TEXT NOT NULL,
  net_quantity TEXT NOT NULL,
  weight_grams INTEGER NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS seasonal_box_templates (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  slots_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  subtotal_usd NUMERIC(10,2) NOT NULL,
  shipping_usd NUMERIC(10,2) NOT NULL,
  total_usd NUMERIC(10,2) NOT NULL,
  total_weight_grams INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpacked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_code TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  product_name_ja TEXT NOT NULL,
  unit_price_usd NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  weight_grams INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
