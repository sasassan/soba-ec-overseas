import Link from "next/link";
import { listOrders } from "@/lib/db";
import { formatUsd } from "@/lib/pricing";
import { ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from "@/lib/status-labels";
import { updateOrderStatus } from "@/app/admin/order-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "注文一覧",
};

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-cream">注文一覧</h1>
        <p className="text-sm text-cream-dim">{orders.length} 件</p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border border-ink-line bg-ink-card p-10 text-center text-cream-dim">
          まだ注文がありません。購入サイトの「季節のおすすめ箱」からテスト注文を作成してください。
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-line text-left text-cream-dim">
                <th className="py-3 pr-4 font-medium">注文番号</th>
                <th className="py-3 pr-4 font-medium">日時</th>
                <th className="py-3 pr-4 font-medium">宛先</th>
                <th className="py-3 pr-4 font-medium">合計</th>
                <th className="py-3 pr-4 font-medium">ステータス</th>
                <th className="py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line">
              {orders.map((order) => (
                <tr key={order.id} className="text-cream">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}/packing`}
                      className="text-gold hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-cream-dim">
                    {order.created_at}
                  </td>
                  <td className="py-3 pr-4 text-cream-dim">
                    {order.customer_name}
                    <span className="block text-xs text-cream-dim/70">
                      {order.city}, {order.country}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{formatUsd(order.total_usd)}</td>
                  <td className="py-3 pr-4">
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded border border-ink-line bg-ink-soft px-2 py-1 text-cream focus:border-gold-soft focus:outline-none"
                      >
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {ORDER_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded border border-ink-line px-2 py-1 text-xs text-cream-dim hover:border-gold-soft transition-colors"
                      >
                        更新
                      </button>
                    </form>
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/orders/${order.id}/packing`}
                      className="text-gold hover:underline"
                    >
                      箱詰め
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
