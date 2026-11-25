import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { products } from "@/data/products";
import { seasonalBoxTemplate } from "@/data/seasonal-box";

export type OrderStatus = "unpacked" | "packed" | "shipped";

export interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal_usd: number;
  shipping_usd: number;
  total_usd: number;
  total_weight_grams: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_code: string;
  product_name_en: string;
  product_name_ja: string;
  unit_price_usd: number;
  quantity: number;
  weight_grams: number;
}

let db: Database.Database | null = null;

function resolveDbPath(): string {
  if (process.env.SQLITE_PATH) return process.env.SQLITE_PATH;
  // Vercel's filesystem is ephemeral and read-only outside /tmp.
  if (process.env.VERCEL === "1") return "/tmp/soba.db";
  return path.join(process.cwd(), "data", "soba.db");
}

function migrate(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      code TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name_en TEXT NOT NULL,
      name_ja TEXT NOT NULL,
      category TEXT NOT NULL,
      net_quantity TEXT NOT NULL,
      weight_grams INTEGER NOT NULL,
      price_usd REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seasonal_box_templates (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_ja TEXT NOT NULL,
      slots_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL,
      subtotal_usd REAL NOT NULL,
      shipping_usd REAL NOT NULL,
      total_usd REAL NOT NULL,
      total_weight_grams INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'unpacked',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_code TEXT NOT NULL,
      product_name_en TEXT NOT NULL,
      product_name_ja TEXT NOT NULL,
      unit_price_usd REAL NOT NULL,
      quantity INTEGER NOT NULL,
      weight_grams INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
}

function seed(database: Database.Database): void {
  const insertProduct = database.prepare(`
    INSERT OR IGNORE INTO products
      (code, slug, name_en, name_ja, category, net_quantity, weight_grams, price_usd)
    VALUES
      (@code, @slug, @nameEn, @nameJa, @category, @netQuantity, @weightGrams, @priceUsd)
  `);
  const insertMany = database.transaction(() => {
    for (const p of products) {
      insertProduct.run({
        code: p.code,
        slug: p.slug,
        nameEn: p.nameEn,
        nameJa: p.nameJa,
        category: p.category,
        netQuantity: p.netQuantity,
        weightGrams: p.weightGrams,
        priceUsd: p.priceUsd,
      });
    }
  });
  insertMany();

  database
    .prepare(
      `INSERT OR IGNORE INTO seasonal_box_templates (id, name_en, name_ja, slots_json)
       VALUES (@id, @nameEn, @nameJa, @slotsJson)`
    )
    .run({
      id: seasonalBoxTemplate.id,
      nameEn: seasonalBoxTemplate.nameEn,
      nameJa: seasonalBoxTemplate.nameJa,
      slotsJson: JSON.stringify(seasonalBoxTemplate.slots),
    });
}

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = resolveDbPath();
  try {
    if (dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    db = new Database(dbPath);
  } catch (error) {
    // Fall back to in-memory so the app still runs on read-only filesystems.
    console.error("Could not open SQLite file, falling back to :memory:", error);
    db = new Database(":memory:");
  }

  db.pragma("journal_mode = WAL");
  migrate(db);
  seed(db);
  return db;
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SOBA-${date}-${rand}`;
}

export interface CreateOrderItemInput {
  productCode: string;
  productNameEn: string;
  productNameJa: string;
  unitPriceUsd: number;
  quantity: number;
  weightGrams: number;
}

export interface CreateOrderInput {
  customer: {
    name: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CreateOrderItemInput[];
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  totalWeightGrams: number;
}

export function createOrder(input: CreateOrderInput): { id: number; orderNumber: string } {
  const database = getDb();
  const orderNumber = generateOrderNumber();

  const create = database.transaction(() => {
    const info = database
      .prepare(
        `INSERT INTO orders
          (order_number, customer_name, customer_email, address_line1, address_line2,
           city, state, postal_code, country, subtotal_usd, shipping_usd, total_usd,
           total_weight_grams, status)
         VALUES
          (@orderNumber, @name, @email, @line1, @line2, @city, @state, @postal,
           @country, @subtotal, @shipping, @total, @weight, 'unpacked')`
      )
      .run({
        orderNumber,
        name: input.customer.name,
        email: input.customer.email,
        line1: input.customer.addressLine1,
        line2: input.customer.addressLine2,
        city: input.customer.city,
        state: input.customer.state,
        postal: input.customer.postalCode,
        country: input.customer.country,
        subtotal: input.subtotalUsd,
        shipping: input.shippingUsd,
        total: input.totalUsd,
        weight: input.totalWeightGrams,
      });

    const orderId = Number(info.lastInsertRowid);
    const insertItem = database.prepare(
      `INSERT INTO order_items
        (order_id, product_code, product_name_en, product_name_ja, unit_price_usd, quantity, weight_grams)
       VALUES
        (@orderId, @code, @nameEn, @nameJa, @price, @quantity, @weight)`
    );
    for (const item of input.items) {
      insertItem.run({
        orderId,
        code: item.productCode,
        nameEn: item.productNameEn,
        nameJa: item.productNameJa,
        price: item.unitPriceUsd,
        quantity: item.quantity,
        weight: item.weightGrams,
      });
    }
    return orderId;
  });

  const orderId = create();
  return { id: orderId, orderNumber };
}

export function listOrders(): OrderRow[] {
  const database = getDb();
  return database
    .prepare(
      `SELECT * FROM orders ORDER BY id DESC`
    )
    .all() as OrderRow[];
}

export function getOrder(id: number): OrderRow | undefined {
  const database = getDb();
  return database.prepare(`SELECT * FROM orders WHERE id = ?`).get(id) as
    | OrderRow
    | undefined;
}

export function getOrderItems(orderId: number): OrderItemRow[] {
  const database = getDb();
  return database
    .prepare(`SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC`)
    .all(orderId) as OrderItemRow[];
}

export function updateOrderStatus(id: number, status: OrderStatus): void {
  const database = getDb();
  database.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, id);
}
