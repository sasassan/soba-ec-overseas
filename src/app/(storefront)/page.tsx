import Link from "next/link";

const entrances = [
  {
    href: "/preferences",
    title: "Find by Preference",
    description:
      "Browse noodles by taste and texture — from 100% buckwheat to green tea and refined white soba.",
    accent: "100% Buckwheat · Green Tea · Smooth",
  },
  {
    href: "/seasonal-box",
    title: "Seasonal Box",
    description:
      "Build a curated box of three noodles and one tsuyu, with real-time shipping and total.",
    accent: "3 noodles + 1 tsuyu",
  },
  {
    href: "/how-to-eat",
    title: "How to Eat Soba",
    description:
      "Step-by-step boiling, chilling, and serving guides for every noodle in our range.",
    accent: "Boil · Chill · Serve",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 text-center">
        <p className="text-gold text-sm tracking-[0.3em] uppercase">
          Artisan Buckwheat Noodles
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-6xl leading-tight text-cream">
          Handcrafted Soba,
          <br />
          <span className="text-gold">Shipped to Your Door</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-cream-dim">
          A calm, considered selection of Japanese soba noodles and dashi tsuyu —
          chosen for aroma, texture, and the quiet ritual of a perfect bowl.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-6 md:grid-cols-3">
        {entrances.map((entrance) => (
          <Link
            key={entrance.href}
            href={entrance.href}
            className="group rounded-lg border border-ink-line bg-ink-card p-8 hover:border-gold-soft transition-colors"
          >
            <p className="text-xs text-gold uppercase tracking-widest">
              {entrance.accent}
            </p>
            <h2 className="mt-4 font-serif text-2xl text-cream group-hover:text-gold transition-colors">
              {entrance.title}
            </h2>
            <p className="mt-3 text-cream-dim leading-relaxed">
              {entrance.description}
            </p>
            <span className="mt-5 inline-block text-sm text-gold">
              Explore &rarr;
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-4">
        <div className="rounded-lg border border-ink-line bg-ink-soft p-8 text-center">
          <h2 className="font-serif text-2xl text-cream">Our Noodles</h2>
          <p className="mt-3 text-cream-dim">
            Six dried noodles and two tsuyu, each with its own character.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
          >
            View all products
          </Link>
        </div>
      </section>
    </div>
  );
}
