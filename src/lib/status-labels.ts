import type { OrderStatus } from "./db";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  unpacked: "未梱包",
  packed: "梱包済み",
  shipped: "発送済み",
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "unpacked",
  "packed",
  "shipped",
];
