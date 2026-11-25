"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export function PreferenceFinder({
  products,
  tags,
}: {
  products: Product[];
  tags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? products.filter((p) => p.tags.includes(activeTag))
    : products;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeTag === null
              ? "border-gold bg-gold/10 text-gold"
              : "border-ink-line text-cream-dim hover:border-gold-soft"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeTag === tag
                ? "border-gold bg-gold/10 text-gold"
                : "border-ink-line text-cream-dim hover:border-gold-soft"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="mb-6 text-cream-dim">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {activeTag ? ` matching “${activeTag}”` : ""}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </div>
  );
}
