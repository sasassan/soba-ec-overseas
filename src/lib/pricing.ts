// Pure pricing helpers shared between server and client components.

import { shippingConfig } from "@/data/shipping-config";

export interface PricedItem {
  code: string;
  nameEn: string;
  nameJa: string;
  unitPriceUsd: number;
  quantity: number;
  weightGrams: number;
}

export function computeContentWeight(
  items: { weightGrams: number; quantity: number }[]
): number {
  return items.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
}

export function computeSubtotal(
  items: { unitPriceUsd: number; quantity: number }[]
): number {
  return items.reduce((sum, i) => sum + i.unitPriceUsd * i.quantity, 0);
}

/** Total box weight = content weight + packaging weight. */
export function computeBoxWeight(contentWeightGrams: number): number {
  return contentWeightGrams + shippingConfig.packagingWeightGrams;
}

export function getShippingCost(boxWeightGrams: number): number {
  for (const rate of shippingConfig.shippingRates) {
    if (boxWeightGrams <= rate.upToGrams) return rate.costUsd;
  }
  const last = shippingConfig.shippingRates[shippingConfig.shippingRates.length - 1];
  return last.costUsd;
}

export function isOverWeightLimit(contentWeightGrams: number): boolean {
  return contentWeightGrams > shippingConfig.weightLimitGrams;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
