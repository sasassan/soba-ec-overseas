import { getNoodles, getTsuyu } from "@/data/products";
import { seasonalBoxTemplate } from "@/data/seasonal-box";
import { shippingConfig } from "@/data/shipping-config";
import { sampleAddress } from "@/data/sample-address";
import { SeasonalBoxConfigurator } from "@/components/seasonal-box-configurator";

export const metadata = {
  title: "Seasonal Box",
  description: "Build a box of three noodles and one tsuyu.",
};

export default function SeasonalBoxPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <p className="text-xs text-gold uppercase tracking-widest">
          Curated Gift Box
        </p>
        <h1 className="mt-2 font-serif text-3xl text-cream">
          {seasonalBoxTemplate.nameEn}
        </h1>
        <p className="mt-1 text-cream-dim">{seasonalBoxTemplate.nameJa}</p>
        <p className="mt-3 text-cream-dim max-w-2xl">
          {seasonalBoxTemplate.description}
        </p>
      </header>
      <SeasonalBoxConfigurator
        noodles={getNoodles()}
        tsuyu={getTsuyu()}
        slots={seasonalBoxTemplate.slots}
        config={shippingConfig}
        sampleAddress={sampleAddress}
      />
    </div>
  );
}
