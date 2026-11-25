// Demo shipping configuration. All values are placeholder/demo values.

export interface ShippingRate {
  /** Upper bound of the band, in grams (inclusive). */
  upToGrams: number;
  costUsd: number;
}

export interface ShippingConfig {
  /** Weight of the empty box and packing materials, in grams. */
  packagingWeightGrams: number;
  /**
   * Maximum recommended CONTENT weight (sum of selected product weights) in
   * grams. The configurator shows a warning when the selection exceeds this.
   * This is a soft, demo limit that can be changed here.
   */
  weightLimitGrams: number;
  /** Shipping cost table, keyed by total box weight (content + packaging). */
  shippingRates: ShippingRate[];
}

export const shippingConfig: ShippingConfig = {
  packagingWeightGrams: 120,
  weightLimitGrams: 1200,
  shippingRates: [
    { upToGrams: 1100, costUsd: 34 },
    { upToGrams: 1200, costUsd: 44 },
    { upToGrams: 1450, costUsd: 54 },
    { upToGrams: 5000, costUsd: 72 },
  ],
};
