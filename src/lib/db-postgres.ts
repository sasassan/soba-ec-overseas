import "server-only";

import { Pool } from "pg";
import { products } from "@/data/products";
import { seasonalBoxTemplates } from "@/data/seasonal-box";
import type {
  CreateOrderInput,
  DbDriver,
  OrderItemRow,
  OrderRow,
  OrderStatus,
} from "./db-types";

// Keep in sync with schema.sql at the repository root.
const SCHEMA_SQL = `
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
`;

let pool: Pool | null = null;
let schemaPromise: Promise<void> | null = null;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set but the Postgres driver was selected."
    );
  }

  const ssl =
    process.env.DATABASE_SSL === "true" ||
    /\?(.*&)?sslmode=require/i.test(connectionString);

  pool = new Pool({
    connectionString,
    ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  return pool;
}

function mapOrderRow(row: Record<string, unknown>): OrderRow {
  return {
    id: Number(row.id),
    order_number: String(row.order_number),
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    address_line1: String(row.address_line1),
    address_line2: String(row.address_line2 ?? ""),
    city: String(row.city),
    state: String(row.state),
    postal_code: String(row.postal_code),
    country: String(row.country),
    subtotal_usd: Number(row.subtotal_usd),
    shipping_usd: Number(row.shipping_usd),
    total_usd: Number(row.total_usd),
    total_weight_grams: Number(row.total_weight_grams),
    status: row.status as OrderStatus,
    created_at: String(row.created_at),
  };
}

function mapOrderItemRow(row: Record<string, unknown>): OrderItemRow {
  return {
    id: Number(row.id),
    order_id: Number(row.order_id),
    product_code: String(row.product_code),
    product_name_en: String(row.product_name_en),
    product_name_ja: String(row.product_name_ja),
    unit_price_usd: Number(row.unit_price_usd),
    quantity: Number(row.quantity),
    weight_grams: Number(row.weight_grams),
  };
}

async function ensureSchema(): Promise<void> {
  if (schemaPromise) return schemaPromise;
  schemaPromise = (async () => {
    const client = await getPool().connect();
    try {
      await client.query(SCHEMA_SQL);

      for (const p of products) {
        await client.query(
          `INSERT INTO products
            (code, slug, name_en, name_ja, category, net_quantity, weight_grams, price_usd)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (code) DO NOTHING`,
          [
            p.code,
            p.slug,
            p.nameEn,
            p.nameJa,
            p.category,
            p.netQuantity,
            p.weightGrams,
            p.priceUsd,
          ]
        );
      }

      for (const template of seasonalBoxTemplates) {
        await client.query(
          `INSERT INTO seasonal_box_templates (id, name_en, name_ja, slots_json)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
          [
            template.id,
            template.nameEn,
            template.nameJa,
            JSON.stringify(template.slots),
          ]
        );
      }
    } finally {
      client.release();
    }
  })();
  return schemaPromise;
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SOBA-${date}-${rand}`;
}

const ORDER_SELECT = `
  SELECT
    id,
    order_number,
    customer_name,
    customer_email,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    subtotal_usd,
    shipping_usd,
    total_usd,
    total_weight_grams,
    status,
    to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at
  FROM orders
`;

export const postgresDriver: DbDriver = {
  async createOrder(input: CreateOrderInput) {
    await ensureSchema();
    const orderNumber = generateOrderNumber();
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `INSERT INTO orders
          (order_number, customer_name, customer_email, address_line1, address_line2,
           city, state, postal_code, country, subtotal_usd, shipping_usd, total_usd,
           total_weight_grams, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'unpacked')
         RETURNING id`,
        [
          orderNumber,
          input.customer.name,
          input.customer.email,
          input.customer.addressLine1,
          input.customer.addressLine2,
          input.customer.city,
          input.customer.state,
          input.customer.postalCode,
          input.customer.country,
          input.subtotalUsd,
          input.shippingUsd,
          input.totalUsd,
          input.totalWeightGrams,
        ]
      );
      const orderId = Number(orderResult.rows[0].id);

      for (const item of input.items) {
        await client.query(
          `INSERT INTO order_items
            (order_id, product_code, product_name_en, product_name_ja, unit_price_usd, quantity, weight_grams)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            orderId,
            item.productCode,
            item.productNameEn,
            item.productNameJa,
            item.unitPriceUsd,
            item.quantity,
            item.weightGrams,
          ]
        );
      }

      await client.query("COMMIT");
      return { id: orderId, orderNumber };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async listOrders() {
    await ensureSchema();
    const result = await getPool().query(`${ORDER_SELECT} ORDER BY id DESC`);
    return result.rows.map(mapOrderRow);
  },

  async getOrder(id: number) {
    await ensureSchema();
    const result = await getPool().query(`${ORDER_SELECT} WHERE id = $1`, [id]);
    return result.rows[0] ? mapOrderRow(result.rows[0]) : undefined;
  },

  async getOrderItems(orderId: number) {
    await ensureSchema();
    const result = await getPool().query(
      `SELECT
        id, order_id, product_code, product_name_en, product_name_ja,
        unit_price_usd, quantity, weight_grams
       FROM order_items
       WHERE order_id = $1
       ORDER BY id ASC`,
      [orderId]
    );
    return result.rows.map(mapOrderItemRow);
  },

  async updateOrderStatus(id: number, status: OrderStatus) {
    await ensureSchema();
    await getPool().query(`UPDATE orders SET status = $1 WHERE id = $2`, [
      status,
      id,
    ]);
  },
};
