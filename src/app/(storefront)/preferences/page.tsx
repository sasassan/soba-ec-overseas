import { products, preferenceTags } from "@/data/products";
import { PreferenceFinder } from "@/components/preference-finder";

export const metadata = {
  title: "Find by Preference",
  description: "Filter our noodles by taste and texture.",
};

export default function PreferencesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-3xl text-cream">Find by Preference</h1>
        <p className="mt-2 text-cream-dim">
          Filter the range by flavor and texture to find your perfect noodle.
        </p>
      </header>
      <PreferenceFinder products={products} tags={preferenceTags} />
    </div>
  );
}
