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

export interface DbDriver {
  createOrder(
    input: CreateOrderInput
  ): Promise<{ id: number; orderNumber: string }>;
  listOrders(): Promise<OrderRow[]>;
  getOrder(id: number): Promise<OrderRow | undefined>;
  getOrderItems(orderId: number): Promise<OrderItemRow[]>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<void>;
}
