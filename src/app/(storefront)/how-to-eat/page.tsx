import Link from "next/link";
import { products } from "@/data/products";

export const metadata = {
  title: "How to Eat Soba",
  description: "Boiling, chilling, and serving guides for every product.",
};

export default function HowToEatIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-3xl text-cream">How to Eat Soba</h1>
        <p className="mt-2 text-cream-dim">
          Each product has its own page — handy for a QR code on the packaging.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.code}
            href={`/how-to-eat/${product.slug}`}
            className="group rounded-lg border border-ink-line bg-ink-card p-6 hover:border-gold-soft transition-colors"
          >
            <p className="text-xs text-gold uppercase tracking-widest">
              {product.code}
            </p>
            <h2 className="mt-2 font-serif text-xl text-cream group-hover:text-gold transition-colors">
              {product.nameEn}
            </h2>
            <p className="mt-1 text-sm text-cream-dim">{product.nameJa}</p>
            <p className="mt-3 text-sm text-gold">View guide &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
