import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getOrderItems } from "@/lib/db";
import { formatUsd } from "@/lib/pricing";
import { DEMO_NOTICE } from "@/lib/store-labels";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();
  const items = await getOrderItems(orderId);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="rounded-lg border border-ink-line bg-ink-card p-8">
        <p className="text-xs text-gold uppercase tracking-widest">
          Order confirmed
        </p>
        <h1 className="mt-3 font-serif text-3xl text-cream">
          {order.order_number}
        </h1>
        <p className="mt-2 text-cream-dim">
          Thank you — this is a test order for the demo. {DEMO_NOTICE}.
        </p>

        <div className="mt-8 border-t border-ink-line pt-6">
          <h2 className="font-serif text-xl text-cream">Items</h2>
          <ul className="mt-4 divide-y divide-ink-line">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between py-3">
                <div>
                  <p className="text-cream">
                    {item.product_name_en}
                    {item.quantity > 1 && ` ×${item.quantity}`}
                  </p>
                  <p className="text-sm text-cream-dim">
                    {item.product_name_ja} · {item.product_code}
                  </p>
                </div>
                <span className="text-cream">
                  {formatUsd(item.unit_price_usd * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-6 space-y-2 border-t border-ink-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-cream-dim">Subtotal</dt>
            <dd className="text-cream">{formatUsd(order.subtotal_usd)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Shipping</dt>
            <dd className="text-cream">{formatUsd(order.shipping_usd)}</dd>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-ink-line">
            <dt className="text-cream font-medium">Total</dt>
            <dd className="text-gold font-medium">{formatUsd(order.total_usd)}</dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-ink-line pt-6 text-sm text-cream-dim">
          <p className="font-medium text-cream">Shipping to</p>
          <p className="mt-2">
            {order.customer_name}
            <br />
            {order.address_line1}
            {order.address_line2 && <>, {order.address_line2}</>}
            <br />
            {order.city}, {order.state} {order.postal_code}
            <br />
            {order.country}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/seasonal-box"
            className="rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
          >
            Build another box
          </Link>
        </div>
      </div>
    </div>
  );
}
