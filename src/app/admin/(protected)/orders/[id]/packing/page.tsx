import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getOrderItems } from "@/lib/db";
import { formatUsd } from "@/lib/pricing";
import { ORDER_STATUS_LABELS } from "@/lib/status-labels";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = Number.isInteger(Number(id)) ? getOrder(Number(id)) : undefined;
  return { title: order ? `箱詰め ${order.order_number}` : "箱詰め" };
}

interface AggregatedItem {
  productCode: string;
  nameEn: string;
  nameJa: string;
  quantity: number;
  unitPriceUsd: number;
  unitWeightGrams: number;
}

export default async function PackingPage({
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
        nameJa: item.product_name_ja,
        quantity: item.quantity,
        unitPriceUsd: item.unit_price_usd,
        unitWeightGrams: item.weight_grams,
      });
    }
  }
  const aggregatedItems = Array.from(aggregated.values());

  return (
    <div>
      <nav className="text-sm text-cream-dim mb-6 no-print">
        <Link href="/admin/orders" className="hover:text-gold">
          &larr; 注文一覧
        </Link>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-cream">{order.order_number}</h1>
          <p className="mt-1 text-sm text-cream-dim">
            作成日時: {order.created_at} · ステータス:{" "}
            {ORDER_STATUS_LABELS[order.status]}
          </p>
        </div>
        <Link
          href={`/admin/orders/${order.id}/packing-slip`}
          target="_blank"
          className="no-print shrink-0 rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
        >
          印刷用指示書
        </Link>
      </div>

      <section className="mt-8 rounded-lg border border-ink-line bg-ink-card p-6">
        <h2 className="font-serif text-lg text-cream">宛先</h2>
        <p className="mt-3 text-cream-dim leading-relaxed">
          {order.customer_name}
          <br />
          {order.address_line1}
          {order.address_line2 && <>, {order.address_line2}</>}
          <br />
          {order.city}, {order.state} {order.postal_code}
          <br />
          {order.country}
          <br />
          {order.customer_email}
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-ink-line bg-ink-card p-6">
        <h2 className="font-serif text-lg text-cream">商品一覧</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-line text-left text-cream-dim">
              <th className="py-2 pr-4 font-medium">商品</th>
              <th className="py-2 pr-4 font-medium">商品コード</th>
              <th className="py-2 pr-4 font-medium">個数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {aggregatedItems.map((item) => (
              <tr key={item.productCode} className="text-cream">
                <td className="py-2 pr-4">
                  {item.nameJa}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                  <span className="block text-xs text-cream-dim">
                    {item.nameEn}
                  </span>
                </td>
                <td className="py-2 pr-4 text-cream-dim">{item.productCode}</td>
                <td className="py-2 pr-4">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 rounded-lg border border-ink-line bg-ink-card p-6">
        <h2 className="font-serif text-lg text-cream">発送準備情報（通関申告用）</h2>
        <p className="mt-2 text-sm text-cream-dim">
          内容品リスト（英語名・数量・重量・価格）
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-line text-left text-cream-dim">
              <th className="py-2 pr-4 font-medium">Item</th>
              <th className="py-2 pr-4 font-medium">Qty</th>
              <th className="py-2 pr-4 font-medium">Weight</th>
              <th className="py-2 pr-4 font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {aggregatedItems.map((item) => (
              <tr key={item.productCode} className="text-cream">
                <td className="py-2 pr-4">{item.nameEn}</td>
                <td className="py-2 pr-4">{item.quantity}</td>
                <td className="py-2 pr-4">
                  {item.unitWeightGrams * item.quantity}g
                </td>
                <td className="py-2 pr-4">
                  {formatUsd(item.unitPriceUsd * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-cream-dim">
          合計重量（箱込み）: {order.total_weight_grams}g · 合計金額:{" "}
          {formatUsd(order.total_usd)}
        </div>
      </section>
    </div>
  );
}
