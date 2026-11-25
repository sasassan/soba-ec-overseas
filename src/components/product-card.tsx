import Link from "next/link";
import type { Product } from "@/data/products";
import { formatUsd } from "@/lib/pricing";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-lg border border-ink-line bg-ink-card p-6 hover:border-gold-soft transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gold uppercase tracking-widest">
            {product.category === "noodle" ? "Dried Noodle" : "Tsuyu Broth"}
          </p>
          <h3 className="mt-2 font-serif text-xl text-cream group-hover:text-gold transition-colors">
            {product.nameEn}
          </h3>
          <p className="text-sm text-cream-dim">{product.nameJa}</p>
        </div>
        <span className="shrink-0 text-cream font-medium">
          {formatUsd(product.priceUsd)}
        </span>
      </div>
      <p className="mt-4 text-sm text-cream-dim leading-relaxed flex-1">
        {product.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-ink-line px-2.5 py-0.5 text-xs text-cream-dim"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
