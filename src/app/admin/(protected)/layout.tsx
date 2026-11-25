import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-ink-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/orders"
              className="font-serif text-lg text-cream"
            >
              管理画面
            </Link>
            <nav className="flex items-center gap-4 text-sm text-cream-dim">
              <Link href="/admin/orders" className="hover:text-gold transition-colors">
                注文一覧
              </Link>
              <Link href="/" className="hover:text-gold transition-colors">
                購入サイト
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-cream-dim hover:text-gold transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">{children}</main>
    </div>
  );
}
