// Seasonal box template (demo). The box has 3 noodle slots and 1 tsuyu slot.
// Each slot can be swapped for any product of the same category.

import type { ProductCategory } from "./products";

export interface BoxSlot {
  id: string;
  label: string;
  labelJa: string;
  category: ProductCategory;
  defaultProductCode: string;
}

export interface SeasonalBoxTemplate {
  id: string;
  nameEn: string;
  nameJa: string;
  tagline: string;
  description: string;
  slots: BoxSlot[];
}

export const seasonalBoxTemplate: SeasonalBoxTemplate = {
  id: "seasonal-box-v1",
  nameEn: "Seasonal Soba Box",
  nameJa: "季節の蕎麦箱",
  tagline: "A curated box of three noodles and one tsuyu.",
  description:
    "Build your own box from our noodle and broth selection. Swap any slot for your favorites — repeat picks are welcome.",
  slots: [
    {
      id: "noodle-1",
      label: "Noodle 1",
      labelJa: "乾麺 1",
      category: "noodle",
      defaultProductCode: "JW-001",
    },
    {
      id: "noodle-2",
      label: "Noodle 2",
      labelJa: "乾麺 2",
      category: "noodle",
      defaultProductCode: "HW-002",
    },
    {
      id: "noodle-3",
      label: "Noodle 3",
      labelJa: "乾麺 3",
      category: "noodle",
      defaultProductCode: "CH-003",
    },
    {
      id: "tsuyu-1",
      label: "Tsuyu",
      labelJa: "つゆ",
      category: "tsuyu",
      defaultProductCode: "TS-001",
    },
  ],
};
