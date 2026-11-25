import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";

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
  return { title: `How to eat ${product.nameEn}` };
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4 text-cream-dim">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-soft text-sm text-gold">
            {i + 1}
          </span>
          <span className="leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function HowToEatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <nav className="text-sm text-cream-dim mb-8">
        <Link href="/how-to-eat" className="hover:text-gold">
          &larr; All guides
        </Link>
      </nav>

      <header className="border-b border-ink-line pb-8">
        <p className="text-xs text-gold uppercase tracking-widest">
          {product.code}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-cream">
          How to Eat {product.nameEn}
        </h1>
        <p className="mt-1 text-cream-dim">{product.nameJa}</p>
        {product.boilTimeMinutes && (
          <p className="mt-4 text-cream">
            Boiling time: about {product.boilTimeMinutes} minutes
          </p>
        )}
      </header>

      {product.howToEat.boil.length > 0 && (
        <section className="py-8 border-b border-ink-line">
          <h2 className="font-serif text-2xl text-cream">Boiling</h2>
          <StepList steps={product.howToEat.boil} />
        </section>
      )}

      <section className="py-8 border-b border-ink-line">
        <h2 className="font-serif text-2xl text-cream">Serving Cold</h2>
        <StepList steps={product.howToEat.cold} />
      </section>

      <section className="py-8">
        <h2 className="font-serif text-2xl text-cream">Serving Hot</h2>
        <StepList steps={product.howToEat.hot} />
      </section>

      <div className="pt-4">
        <Link
          href={`/products/${product.slug}`}
          className="inline-block rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
        >
          View {product.nameEn} details &rarr;
        </Link>
      </div>
    </div>
  );
}
