import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getOrderItems } from "@/lib/db";
import { formatUsd } from "@/lib/pricing";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

interface AggregatedItem {
  productCode: string;
  nameEn: string;
  quantity: number;
  unitPriceUsd: number;
  unitWeightGrams: number;
}

export default async function PackingSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = getOrder(orderId);
  if (!order) notFound();
  const items = getOrderItems(orderId);

  const aggregated = new Map<string, AggregatedItem>();
  for (const item of items) {
    const existing = aggregated.get(item.product_code);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      aggregated.set(item.product_code, {
        productCode: item.product_code,
        nameEn: item.product_name_en,
        quantity: item.quantity,
        unitPriceUsd: item.unit_price_usd,
        unitWeightGrams: item.weight_grams,
      });
    }
  }
  const aggregatedItems = Array.from(aggregated.values());

  return (
    <div className="bg-ink min-h-screen">
      <div className="no-print mx-auto max-w-3xl px-4 py-6 flex items-center justify-between">
        <Link href={`/admin/orders/${order.id}/packing`} className="text-sm text-gold hover:underline">
          &larr; 箱詰め画面へ戻る
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10">
        <div className="print-plain rounded-lg border border-ink-line bg-ink-card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl text-cream">
                箱詰め指示書
              </h1>
              <p className="text-sm text-cream-dim">Packing Instruction</p>
            </div>
            <div className="text-right">
              <p className="text-cream font-medium">{order.order_number}</p>
              <p className="text-sm text-cream-dim">{order.created_at}</p>
            </div>
          </div>

          <p className="mt-4 rounded border border-ink-line px-4 py-2 text-sm text-cream-dim">
            ※ この指示書は社内用です。公式の送り状ではありません。
          </p>

          <section className="mt-6">
            <h2 className="font-serif text-lg text-cream">Ship To</h2>
            <p className="mt-2 text-cream-dim leading-relaxed">
              {order.customer_name}
              <br />
              {order.address_line1}
              {order.address_line2 && <>, {order.address_line2}</>}
              <br />
              {order.city}, {order.state} {order.postal_code}
              <br />
              {order.country}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="font-serif text-lg text-cream">
              Contents (for customs declaration)
            </h2>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-cream-dim">
                  <th className="py-2 pr-4 font-medium">Item</th>
                  <th className="py-2 pr-4 font-medium">Code</th>
                  <th className="py-2 pr-4 font-medium">Qty</th>
                  <th className="py-2 pr-4 font-medium">Weight</th>
                  <th className="py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-line">
                {aggregatedItems.map((item) => (
                  <tr key={item.productCode} className="text-cream">
                    <td className="py-2 pr-4">{item.nameEn}</td>
                    <td className="py-2 pr-4 text-cream-dim">
                      {item.productCode}
                    </td>
                    <td className="py-2 pr-4">{item.quantity}</td>
                    <td className="py-2 pr-4">
                      {item.unitWeightGrams * item.quantity}g
                    </td>
                    <td className="py-2">
                      {formatUsd(item.unitPriceUsd * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6 flex justify-end">
            <dl className="w-56 text-sm">
              <div className="flex justify-between py-1">
                <dt className="text-cream-dim">Subtotal</dt>
                <dd className="text-cream">{formatUsd(order.subtotal_usd)}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-cream-dim">Shipping</dt>
                <dd className="text-cream">{formatUsd(order.shipping_usd)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-line py-1">
                <dt className="text-cream font-medium">Total</dt>
                <dd className="text-cream font-medium">
                  {formatUsd(order.total_usd)}
                </dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-cream-dim">Total weight</dt>
                <dd className="text-cream">{order.total_weight_grams}g</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
