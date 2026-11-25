import "server-only";

import { sqliteDriver } from "./db-sqlite";
import { postgresDriver } from "./db-postgres";
import type {
  CreateOrderInput,
  DbDriver,
  OrderItemRow,
  OrderRow,
  OrderStatus,
} from "./db-types";

export type {
  CreateOrderInput,
  CreateOrderItemInput,
  OrderItemRow,
  OrderRow,
  OrderStatus,
} from "./db-types";

let driver: DbDriver | null = null;

function getDb(): DbDriver {
  if (driver) return driver;
  // PostgreSQL is used when DATABASE_URL is configured; otherwise fall back to
  // the local SQLite file (development / demo).
  driver = process.env.DATABASE_URL ? postgresDriver : sqliteDriver;
  return driver;
}

export function createOrder(
  input: CreateOrderInput
): Promise<{ id: number; orderNumber: string }> {
  return getDb().createOrder(input);
}

export function listOrders(): Promise<OrderRow[]> {
  return getDb().listOrders();
}

export function getOrder(id: number): Promise<OrderRow | undefined> {
  return getDb().getOrder(id);
}

export function getOrderItems(orderId: number): Promise<OrderItemRow[]> {
  return getDb().getOrderItems(orderId);
}

export function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<void> {
  return getDb().updateOrderStatus(id, status);
}
