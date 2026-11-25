"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import type { BoxSlot } from "@/data/seasonal-box";
import type { ShippingConfig } from "@/data/shipping-config";
import type { CustomerAddress } from "@/data/sample-address";
import {
  computeBoxWeight,
  computeContentWeight,
  computeSubtotal,
  formatUsd,
  getShippingCost,
  isOverWeightLimit,
} from "@/lib/pricing";

interface Props {
  noodles: Product[];
  tsuyu: Product[];
  slots: BoxSlot[];
  config: ShippingConfig;
  sampleAddress: CustomerAddress;
}

export function SeasonalBoxConfigurator({
  noodles,
  tsuyu,
  slots,
  config,
  sampleAddress,
}: Props) {
  const router = useRouter();
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(slots.map((s) => [s.id, s.defaultProductCode]))
  );
  const [customer, setCustomer] = useState<CustomerAddress>(sampleAddress);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optionsFor = (slot: BoxSlot) =>
    slot.category === "noodle" ? noodles : tsuyu;

  const allProducts = useMemo(() => [...noodles, ...tsuyu], [noodles, tsuyu]);

  const items = slots
    .map((slot) => {
      const code = selection[slot.id];
      const product = allProducts.find((p) => p.code === code);
      if (!product) return null;
      return {
        code: product.code,
        nameEn: product.nameEn,
        nameJa: product.nameJa,
        unitPriceUsd: product.priceUsd,
        quantity: 1,
        weightGrams: product.weightGrams,
      };
    })
    .filter(Boolean) as {
    code: string;
    nameEn: string;
    nameJa: string;
    unitPriceUsd: number;
    quantity: number;
    weightGrams: number;
  }[];

  const contentWeight = computeContentWeight(items);
  const boxWeight = computeBoxWeight(contentWeight);
  const subtotal = computeSubtotal(items);
  const shipping = getShippingCost(boxWeight);
  const total = subtotal + shipping;
  const overLimit = isOverWeightLimit(contentWeight);

  function handleChange(slotId: string, code: string) {
    setSelection((prev) => ({ ...prev, [slotId]: code }));
  }

  function handleCustomerChange(field: keyof CustomerAddress, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ code: i.code, quantity: i.quantity })),
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place the order.");
        return;
      }
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-2xl text-cream">Build Your Box</h2>
        <div className="mt-6 space-y-5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-lg border border-ink-line bg-ink-card p-5"
            >
              <label className="block text-sm text-gold uppercase tracking-wider">
                {slot.label} · {slot.labelJa}
              </label>
              <select
                value={selection[slot.id]}
                onChange={(e) => handleChange(slot.id, e.target.value)}
                className="mt-3 w-full rounded border border-ink-line bg-ink-soft px-3 py-2 text-cream focus:border-gold-soft focus:outline-none"
              >
                {optionsFor(slot).map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.nameEn} ({product.netQuantity}) —{" "}
                    {formatUsd(product.priceUsd)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-cream">Summary</h2>
        <div className="mt-6 rounded-lg border border-ink-line bg-ink-card p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-cream-dim">Content weight</dt>
              <dd className="text-cream">{contentWeight}g</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-dim">
                Packaging weight (configurable)
              </dt>
              <dd className="text-cream">{config.packagingWeightGrams}g</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-dim">Total box weight</dt>
              <dd className="text-cream">{boxWeight}g</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-dim">Subtotal</dt>
              <dd className="text-cream">{formatUsd(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-dim">Shipping</dt>
              <dd className="text-cream">{formatUsd(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink-line pt-3 text-base">
              <dt className="text-cream font-medium">Total</dt>
              <dd className="text-gold font-medium">{formatUsd(total)}</dd>
            </div>
          </dl>

          {overLimit && (
            <div className="mt-5 rounded border border-lacquer bg-lacquer/10 px-4 py-3 text-sm text-cream">
              Warning: this selection exceeds the {config.weightLimitGrams}g
              content weight limit. Consider a lighter combination.
            </div>
          )}
        </div>

        <div className="mt-8 rounded-lg border border-ink-line bg-ink-card p-6">
          <h3 className="font-serif text-xl text-cream">Shipping Details</h3>
          <div className="mt-4 grid gap-3">
            <Field
              label="Name"
              value={customer.name}
              onChange={(v) => handleCustomerChange("name", v)}
            />
            <Field
              label="Email"
              value={customer.email}
              onChange={(v) => handleCustomerChange("email", v)}
            />
            <Field
              label="Address line 1"
              value={customer.addressLine1}
              onChange={(v) => handleCustomerChange("addressLine1", v)}
            />
            <Field
              label="Address line 2"
              value={customer.addressLine2}
              onChange={(v) => handleCustomerChange("addressLine2", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="City"
                value={customer.city}
                onChange={(v) => handleCustomerChange("city", v)}
              />
              <Field
                label="State"
                value={customer.state}
                onChange={(v) => handleCustomerChange("state", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Postal code"
                value={customer.postalCode}
                onChange={(v) => handleCustomerChange("postalCode", v)}
              />
              <Field
                label="Country"
                value={customer.country}
                onChange={(v) => handleCustomerChange("country", v)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded border border-lacquer bg-lacquer/10 px-4 py-2 text-sm text-cream">
              {error}
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="mt-6 w-full rounded border border-gold bg-gold/10 px-4 py-3 text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place Test Order"}
          </button>
          <p className="mt-3 text-xs text-cream-dim/70">
            Demo only — this creates a test order with the sample address above.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-cream-dim">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-ink-line bg-ink-soft px-3 py-2 text-cream focus:border-gold-soft focus:outline-none"
      />
    </label>
  );
}
