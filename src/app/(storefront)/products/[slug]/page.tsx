import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { formatUsd } from "@/lib/pricing";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.nameEn, description: product.shortDescription };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <nav className="text-sm text-cream-dim mb-8">
        <Link href="/products" className="hover:text-gold">
          &larr; All products
        </Link>
      </nav>

      <header className="border-b border-ink-line pb-8">
        <p className="text-xs text-gold uppercase tracking-widest">
          {product.category === "noodle" ? "Dried Noodle" : "Tsuyu Broth"} ·{" "}
          {product.code}
        </p>
        <div className="mt-3 flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-cream">{product.nameEn}</h1>
            <p className="mt-1 text-cream-dim">{product.nameJa}</p>
          </div>
          <span className="text-2xl text-cream shrink-0">
            {formatUsd(product.priceUsd)}
          </span>
        </div>
      </header>

      <section className="py-8 border-b border-ink-line">
        <h2 className="font-serif text-xl text-cream">Flavor &amp; Texture</h2>
        <p className="mt-3 text-cream-dim leading-relaxed">
          {product.flavorAndTexture}
        </p>
      </section>

      <dl className="py-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-gold uppercase tracking-wider">
            Contents
          </dt>
          <dd className="mt-1 text-cream">{product.netQuantity}</dd>
        </div>
        <div>
          <dt className="text-sm text-gold uppercase tracking-wider">
            Weight
          </dt>
          <dd className="mt-1 text-cream">{product.weightGrams}g</dd>
        </div>
        <div>
          <dt className="text-sm text-gold uppercase tracking-wider">
            Boiling Time
          </dt>
          <dd className="mt-1 text-cream">
            {product.boilTimeMinutes
              ? `About ${product.boilTimeMinutes} minutes`
              : "No boiling required"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gold uppercase tracking-wider">
            Recommended Tsuyu
          </dt>
          <dd className="mt-1 text-cream">{product.recommendedTsuyu}</dd>
        </div>
      </dl>

      <section className="py-8 border-b border-ink-line">
        <h2 className="font-serif text-xl text-cream">
          Ingredients &amp; Allergens
        </h2>
        <p className="mt-3 text-cream-dim">{product.ingredients}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.allergens.map((a) => (
            <span
              key={a}
              className="rounded border border-lacquer px-2.5 py-0.5 text-sm text-cream"
            >
              {a}
            </span>
          ))}
          {product.glutenFree && (
            <span className="rounded border border-ink-line px-2.5 py-0.5 text-sm text-cream-dim">
              Gluten-free
            </span>
          )}
        </div>
      </section>

      <section className="py-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-cream">Served Cold</h2>
          <p className="mt-3 text-cream-dim leading-relaxed">
            {product.servingCold}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl text-cream">Served Hot</h2>
          <p className="mt-3 text-cream-dim leading-relaxed">
            {product.servingHot}
          </p>
        </div>
      </section>

      <div className="pt-4">
        <Link
          href={`/how-to-eat/${product.slug}`}
          className="inline-block rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
        >
          How to eat {product.nameEn} &rarr;
        </Link>
      </div>
    </div>
  );
}
