// Demo product catalog. All names, prices, weights, and shipping data below are
// placeholder/demo values only and are not real commercial data.

export type ProductCategory = "noodle" | "tsuyu";

export interface HowToEat {
  boil: string[];
  cold: string[];
  hot: string[];
}

export interface Product {
  code: string;
  slug: string;
  nameEn: string;
  nameJa: string;
  category: ProductCategory;
  shortDescription: string;
  flavorAndTexture: string;
  netQuantity: string;
  weightGrams: number;
  /**
   * Net grams of one serving (1食分). For noodles this is the dried weight of
   * a single portion; for tsuyu it is the amount used for one bowl.
   */
  servingSize: number;
  /**
   * Shipped weight in grams of one boxed unit (container included). For
   * noodles this is one single-serving pouch; for tsuyu it is one bottle/bag.
   * Provisional (estimated, not yet weighed on a scale).
   */
  packagingWeight: number;
  packagingWeightProvisional: boolean;
  ingredients: string;
  allergens: string[];
  glutenFree: boolean;
  boilTimeMinutes: number | null;
  servingCold: string;
  servingHot: string;
  recommendedTsuyu: string;
  priceUsd: number;
  tags: string[];
  howToEat: HowToEat;
}

function noodleSteps(boilMinutes: string): HowToEat {
  return {
    boil: [
      "Bring a large pot of water to a rolling boil (about 2L per 100g of noodles).",
      `Add the noodles, scattering them so they don't clump, and boil for ${boilMinutes}, stirring gently.`,
      "Drain immediately and rinse well under cold running water to stop cooking and remove surface starch.",
    ],
    cold: [
      "Chill the rinsed noodles in ice water, then drain thoroughly.",
      "Serve on a bamboo mat or chilled plate (zaru style) with sliced scallion, nori, and wasabi on the side.",
      "Dip each mouthful into chilled tsuyu just before eating.",
    ],
    hot: [
      "Prepare a hot broth by diluting the tsuyu with hot water (see the tsuyu label for the ratio).",
      "Add the cooked noodles to the hot broth just before serving.",
      "Garnish with sliced scallion, kamaboko, or your favorite toppings.",
    ],
  };
}

const tsuyuSteps: HowToEat = {
  boil: [],
  cold: [
    "For cold soba (zaru), dilute the concentrated tsuyu with cold water (see the label for the ratio).",
    "Chill the diluted tsuyu before serving alongside the noodles.",
  ],
  hot: [
    "For hot soba, dilute the tsuyu with hot water (typically 1:2 to 1:3, or per the label) to make the broth.",
    "Warm gently without boiling to preserve the aroma of the dashi.",
  ],
};

export const products: Product[] = [
  {
    code: "JW-001",
    slug: "juwari-soba",
    nameEn: "Juwari Soba",
    nameJa: "十割蕎麦",
    category: "noodle",
    shortDescription: "100% buckwheat noodles with a rustic, earthy character.",
    flavorAndTexture:
      "Made with 100% buckwheat flour and no wheat. Deep, nutty buckwheat aroma with a firm, slightly rustic bite.",
    netQuantity: "200g",
    weightGrams: 220,
    servingSize: 100,
    packagingWeight: 105,
    packagingWeightProvisional: true,
    ingredients: "Buckwheat flour.",
    allergens: ["Buckwheat"],
    glutenFree: true,
    boilTimeMinutes: 5,
    servingCold: "Excellent as chilled zaru soba to fully enjoy the pure buckwheat aroma.",
    servingHot: "Pairs well with a light hot broth; add plenty of scallion.",
    recommendedTsuyu: "Concentrated Tsuyu (TS-001)",
    priceUsd: 8.5,
    tags: ["100% Buckwheat", "Gluten-Free", "Rustic & Nutty"],
    howToEat: noodleSteps("4–5 minutes"),
  },
  {
    code: "HW-002",
    slug: "hachiwari-soba",
    nameEn: "Hachiwari Soba",
    nameJa: "八割蕎麦",
    category: "noodle",
    shortDescription: "80% buckwheat with a touch of wheat for a smooth, easy bite.",
    flavorAndTexture:
      "80% buckwheat blended with 20% wheat for a balanced flavor and a smoother, springier texture that's easy to eat.",
    netQuantity: "250g",
    weightGrams: 275,
    servingSize: 100,
    packagingWeight: 105,
    packagingWeightProvisional: true,
    ingredients: "Buckwheat flour, wheat flour.",
    allergens: ["Buckwheat", "Wheat"],
    glutenFree: false,
    boilTimeMinutes: 5,
    servingCold: "A crowd-pleasing choice for both cold and hot preparations.",
    servingHot: "Holds its texture well in hot broth.",
    recommendedTsuyu: "Ready-to-use Tsuyu (TS-002)",
    priceUsd: 7.8,
    tags: ["Balanced Texture", "Easy to Eat"],
    howToEat: noodleSteps("4–5 minutes"),
  },
  {
    code: "CH-003",
    slug: "cha-soba",
    nameEn: "Cha Soba",
    nameJa: "茶蕎麦",
    category: "noodle",
    shortDescription: "Green tea soba with a fragrant, refreshing finish.",
    flavorAndTexture:
      "Stone-ground green tea (matcha) kneaded into the dough for a delicate tea fragrance and a gentle green hue.",
    netQuantity: "200g",
    weightGrams: 220,
    servingSize: 100,
    packagingWeight: 105,
    packagingWeightProvisional: true,
    ingredients: "Buckwheat flour, wheat flour, green tea powder.",
    allergens: ["Buckwheat", "Wheat"],
    glutenFree: false,
    boilTimeMinutes: 4,
    servingCold: "Best served cold to highlight its refreshing tea aroma.",
    servingHot: "Enjoyable hot with a clear, lightly seasoned broth.",
    recommendedTsuyu: "Concentrated Tsuyu (TS-001)",
    priceUsd: 9.2,
    tags: ["Green Tea Flavor", "Refreshing"],
    howToEat: noodleSteps("3–4 minutes"),
  },
  {
    code: "HG-004",
    slug: "hegi-soba",
    nameEn: "Hegi Soba",
    nameJa: "へぎ蕎麦",
    category: "noodle",
    shortDescription: "Niigata-style soba bound with funori seaweed for a silky texture.",
    flavorAndTexture:
      "Bound with funori seaweed instead of wheat, giving a smooth, slippery texture and a clean buckwheat taste.",
    netQuantity: "200g",
    weightGrams: 225,
    servingSize: 100,
    packagingWeight: 105,
    packagingWeightProvisional: true,
    ingredients: "Buckwheat flour, funori (seaweed).",
    allergens: ["Buckwheat"],
    glutenFree: true,
    boilTimeMinutes: 5,
    servingCold: "The classic way — chilled, with its signature slippery-smooth mouthfeel.",
    servingHot: "Also lovely in a hot broth.",
    recommendedTsuyu: "Concentrated Tsuyu (TS-001)",
    priceUsd: 9.8,
    tags: ["Smooth & Slippery", "Gluten-Free", "Seaweed"],
    howToEat: noodleSteps("4–5 minutes"),
  },
  {
    code: "DT-005",
    slug: "dattan-soba",
    nameEn: "Dattan Soba",
    nameJa: "韃靼蕎麦",
    category: "noodle",
    shortDescription: "Tartary buckwheat noodles, rich in flavor and rutin.",
    flavorAndTexture:
      "Made from tartary buckwheat, prized for its intense nutty flavor and higher rutin content.",
    netQuantity: "180g",
    weightGrams: 200,
    servingSize: 90,
    packagingWeight: 95,
    packagingWeightProvisional: true,
    ingredients: "Tartary buckwheat flour.",
    allergens: ["Buckwheat"],
    glutenFree: true,
    boilTimeMinutes: 4,
    servingCold: "Its bold flavor shines when served cold with a robust tsuyu.",
    servingHot: "Rich and warming in hot broth.",
    recommendedTsuyu: "Concentrated Tsuyu (TS-001)",
    priceUsd: 10.5,
    tags: ["100% Buckwheat", "Rich & Nutty", "Gluten-Free"],
    howToEat: noodleSteps("4 minutes"),
  },
  {
    code: "SR-006",
    slug: "sarashina-soba",
    nameEn: "Sarashina Soba",
    nameJa: "更科蕎麦",
    category: "noodle",
    shortDescription: "Refined white soba with a delicate, light flavor.",
    flavorAndTexture:
      "Made from the refined white core of buckwheat for a pale color, delicate sweetness, and an exceptionally smooth texture.",
    netQuantity: "200g",
    weightGrams: 215,
    servingSize: 100,
    packagingWeight: 105,
    packagingWeightProvisional: true,
    ingredients: "Refined buckwheat flour (white buckwheat).",
    allergens: ["Buckwheat"],
    glutenFree: true,
    boilTimeMinutes: 3,
    servingCold: "The most elegant choice for refined zaru soba.",
    servingHot: "Delicate flavor is best paired with a light, clean broth.",
    recommendedTsuyu: "Ready-to-use Tsuyu (TS-002)",
    priceUsd: 11.0,
    tags: ["Light & Refined", "Smooth Texture"],
    howToEat: noodleSteps("2–3 minutes"),
  },
  {
    code: "TS-001",
    slug: "concentrated-tsuyu",
    nameEn: "Concentrated Tsuyu",
    nameJa: "濃縮つゆ",
    category: "tsuyu",
    shortDescription: "Rich dashi-based dipping broth, concentrated 2:1.",
    flavorAndTexture:
      "A concentrated blend of soy sauce, bonito, and kombu dashi. Dilute to taste for dipping or hot broth.",
    netQuantity: "300ml",
    weightGrams: 330,
    servingSize: 44,
    packagingWeight: 360,
    packagingWeightProvisional: true,
    ingredients:
      "Soy sauce (soy, wheat), mirin, sugar, bonito extract, kombu extract, yeast extract.",
    allergens: ["Soy", "Wheat", "Fish"],
    glutenFree: false,
    boilTimeMinutes: null,
    servingCold: "Dilute 1:1 with cold water for chilled dipping sauce.",
    servingHot: "Dilute 1:2 to 1:3 with hot water for hot broth.",
    recommendedTsuyu: "—",
    priceUsd: 6.5,
    tags: ["Concentrated", "Tsuyu"],
    howToEat: tsuyuSteps,
  },
  {
    code: "TS-002",
    slug: "ready-to-use-tsuyu",
    nameEn: "Ready-to-use Tsuyu",
    nameJa: "ストレートつゆ",
    category: "tsuyu",
    shortDescription: "Ready-to-use dashi broth — just chill or heat.",
    flavorAndTexture:
      "A balanced, ready-to-use soba broth made with soy sauce, bonito, and kombu. No dilution required.",
    netQuantity: "500ml",
    weightGrams: 540,
    servingSize: 165,
    packagingWeight: 580,
    packagingWeightProvisional: true,
    ingredients:
      "Soy sauce (soy, wheat), mirin, sugar, bonito extract, kombu extract, yeast extract.",
    allergens: ["Soy", "Wheat", "Fish"],
    glutenFree: false,
    boilTimeMinutes: null,
    servingCold: "Chill and serve directly as a cold dipping sauce.",
    servingHot: "Gently heat and use directly as hot broth.",
    recommendedTsuyu: "—",
    priceUsd: 7.2,
    tags: ["Ready to Use", "Tsuyu"],
    howToEat: tsuyuSteps,
  },
];

export const preferenceTags: string[] = [
  "100% Buckwheat",
  "Gluten-Free",
  "Green Tea Flavor",
  "Smooth Texture",
  "Light & Refined",
  "Rustic & Nutty",
  "Rich & Nutty",
  "Balanced Texture",
  "Refreshing",
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductByCode(code: string): Product | undefined {
  return products.find((p) => p.code === code);
}

export function getNoodles(): Product[] {
  return products.filter((p) => p.category === "noodle");
}

export function getTsuyu(): Product[] {
  return products.filter((p) => p.category === "tsuyu");
}
