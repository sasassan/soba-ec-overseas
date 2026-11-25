"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus as setStatus } from "@/lib/db";
import type { OrderStatus } from "@/lib/db";

const VALID_STATUSES: OrderStatus[] = ["unpacked", "packed", "shipped"];

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const orderId = Number(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatus;

  if (!Number.isInteger(orderId) || !VALID_STATUSES.includes(status)) {
    return;
  }

  setStatus(orderId, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}/packing`);
}
