// Seasonal box templates (demo). Each box has 3 noodle slots and 1 tsuyu slot.
// Every slot can be swapped for any product of the same category. The `servings`
// field controls how many single-serving units of that slot go into the box
// (for tsuyu it is the number of bottles/bags, which is 1).

import type { ProductCategory } from "./products";

export interface BoxSlot {
  id: string;
  label: string;
  labelJa: string;
  category: ProductCategory;
  defaultProductCode: string;
  /** Number of servings (units) of this product packed into the box. */
  servings: number;
}

export interface SeasonalBoxTemplate {
  id: string;
  nameEn: string;
  nameJa: string;
  tagline: string;
  description: string;
  /** Short note describing the portion size, e.g. "1 serving per noodle". */
  servingsNote: string;
  slots: BoxSlot[];
}

export const seasonalBoxTemplates: SeasonalBoxTemplate[] = [
  {
    id: "tasting-box",
    nameEn: "Tasting Box",
    nameJa: "テイスティング箱",
    tagline: "3 noodles × 1 serving, plus a small tsuyu.",
    description:
      "One serving of each of three noodles and a small concentrated tsuyu — a compact introduction to the range.",
    servingsNote: "1 serving (1袋) per noodle · serves 1",
    slots: [
      {
        id: "noodle-1",
        label: "Noodle 1",
        labelJa: "乾麺 1",
        category: "noodle",
        defaultProductCode: "JW-001",
        servings: 1,
      },
      {
        id: "noodle-2",
        label: "Noodle 2",
        labelJa: "乾麺 2",
        category: "noodle",
        defaultProductCode: "HW-002",
        servings: 1,
      },
      {
        id: "noodle-3",
        label: "Noodle 3",
        labelJa: "乾麺 3",
        category: "noodle",
        defaultProductCode: "CH-003",
        servings: 1,
      },
      {
        id: "tsuyu-1",
        label: "Tsuyu (small)",
        labelJa: "つゆ（小）",
        category: "tsuyu",
        defaultProductCode: "TS-001",
        servings: 1,
      },
    ],
  },
  {
    id: "sharing-box",
    nameEn: "Sharing Box",
    nameJa: "シェアリング箱",
    tagline: "3 noodles × 2 servings, plus a large tsuyu.",
    description:
      "Two servings of each of three noodles and a large ready-to-use tsuyu — enough to share or to stock the pantry.",
    servingsNote: "2 servings (2袋) per noodle · serves 2",
    slots: [
      {
        id: "noodle-1",
        label: "Noodle 1",
        labelJa: "乾麺 1",
        category: "noodle",
        defaultProductCode: "JW-001",
        servings: 2,
      },
      {
        id: "noodle-2",
        label: "Noodle 2",
        labelJa: "乾麺 2",
        category: "noodle",
        defaultProductCode: "HW-002",
        servings: 2,
      },
      {
        id: "noodle-3",
        label: "Noodle 3",
        labelJa: "乾麺 3",
        category: "noodle",
        defaultProductCode: "CH-003",
        servings: 2,
      },
      {
        id: "tsuyu-1",
        label: "Tsuyu (large)",
        labelJa: "つゆ（大）",
        category: "tsuyu",
        defaultProductCode: "TS-002",
        servings: 1,
      },
    ],
  },
];

