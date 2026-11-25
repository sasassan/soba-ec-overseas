import { getNoodles, getTsuyu } from "@/data/products";
import { seasonalBoxTemplates } from "@/data/seasonal-box";
import { shippingConfig } from "@/data/shipping-config";
import { sampleAddress } from "@/data/sample-address";
import { SeasonalBoxConfigurator } from "@/components/seasonal-box-configurator";

export const metadata = {
  title: "Seasonal Box",
  description:
    "Choose a Tasting Box (1 serving) or Sharing Box (2 servings) of three noodles and one tsuyu.",
};

export default function SeasonalBoxPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <p className="text-xs text-gold uppercase tracking-widest">
          Curated Gift Box
        </p>
        <h1 className="mt-2 font-serif text-3xl text-cream">
          Seasonal Soba Box
        </h1>
        <p className="mt-1 text-cream-dim">季節の蕎麦箱</p>
        <p className="mt-3 text-cream-dim max-w-2xl">
          Pick a box size, keep the recommended selection, and swap any slot for
          your favorites. Weight, shipping, and total update as you go.
        </p>
      </header>
      <SeasonalBoxConfigurator
        noodles={getNoodles()}
        tsuyu={getTsuyu()}
        templates={seasonalBoxTemplates}
        config={shippingConfig}
        sampleAddress={sampleAddress}
      />
    </div>
  );
}
