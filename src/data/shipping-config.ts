// Shipping configuration for boxes shipped from Japan to the United States.
//
// Rates are based on Japan Post "International AIR PACKET" (国際エアパケット),
// formerly "International ePacket Light" (国際eパケットライト), Zone 4 (US),
// as published on the official Japan Post site. The original JPY rates include
// the 370 JPY international acceptance-record fee (国際特定記録料).
//
// JPY amounts are converted to USD at an assumed rate of 150 JPY/USD. Both the
// exchange rate and every product weight are provisional and must be re-checked
// before going live.

export interface ShippingRate {
  /** Upper bound of the band, in grams (inclusive). */
  upToGrams: number;
  costUsd: number;
}

export interface ShippingMethod {
  id: string;
  nameEn: string;
  nameJa: string;
  /** Official rate schedule page. */
  referenceUrl: string;
  /** Date the rates were looked up (ISO yyyy-mm-dd). */
  confirmedDate: string;
  note: string;
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
  method: ShippingMethod;
  /** Assumed JPY->USD exchange rate used to convert the official rates. */
  exchangeRateJpyPerUsd: number;
  exchangeRateNote: string;
  /** True while rates/weights are estimates rather than final values. */
  provisional: boolean;
  /** Shipping cost table, keyed by total box weight (content + packaging). */
  shippingRates: ShippingRate[];
}

export const shippingConfig: ShippingConfig = {
  packagingWeightGrams: 120,
  weightLimitGrams: 2200,
  method: {
    id: "jp-air-packet-us",
    nameEn: "Japan Post International AIR PACKET (formerly ePacket Light)",
    nameJa: "日本郵便 国際エアパケット（旧・国際eパケットライト）",
    referenceUrl:
      "https://www.post.japanpost.jp/service/send/oversea/list/delivery/airpacket.html",
    confirmedDate: "2026-11-25",
    note:
      "Zone 4 (United States). Rates include the 370 JPY acceptance-record fee. " +
      "Weight bands are 100g steps from 100g up to 2,000g.",
  },
  exchangeRateJpyPerUsd: 150,
  exchangeRateNote:
    "Assumed 150 JPY/USD for the demo. Use a live FX rate before go-live.",
  provisional: true,
  shippingRates: [
    { upToGrams: 100, costUsd: 8.0 },
    { upToGrams: 200, costUsd: 9.4 },
    { upToGrams: 300, costUsd: 10.8 },
    { upToGrams: 400, costUsd: 12.2 },
    { upToGrams: 500, costUsd: 13.6 },
    { upToGrams: 600, costUsd: 15.0 },
    { upToGrams: 700, costUsd: 16.4 },
    { upToGrams: 800, costUsd: 17.8 },
    { upToGrams: 900, costUsd: 19.2 },
    { upToGrams: 1000, costUsd: 20.6 },
    { upToGrams: 1100, costUsd: 22.0 },
    { upToGrams: 1200, costUsd: 23.4 },
    { upToGrams: 1300, costUsd: 24.8 },
    { upToGrams: 1400, costUsd: 26.2 },
    { upToGrams: 1500, costUsd: 27.6 },
    { upToGrams: 1600, costUsd: 29.0 },
    { upToGrams: 1700, costUsd: 30.4 },
    { upToGrams: 1800, costUsd: 31.8 },
    { upToGrams: 1900, costUsd: 33.2 },
    { upToGrams: 2000, costUsd: 34.6 },
  ],
};
