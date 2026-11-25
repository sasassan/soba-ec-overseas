import { getProductByCode } from "@/data/products";

/**
 * Japanese counting unit for a product line. Dried soba is counted in 袋
 * (bags), tsuyu bottles in 本. Used to render e.g. "2袋" when the same noodle
 * is selected in two box slots.
 */
export function unitForCode(code: string): string {
  return getProductByCode(code)?.category === "tsuyu" ? "本" : "袋";
}
