import Link from "next/link";
import { DEMO_NOTICE, SHIPPING_DESTINATION } from "@/lib/store-labels";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/preferences", label: "Find by Preference" },
  { href: "/how-to-eat", label: "How to Eat Soba" },
  { href: "/seasonal-box", label: "Seasonal Box" },
];

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-ink-line bg-gold/10 px-4 py-1.5 text-center text-xs text-cream">
        {DEMO_NOTICE}. {SHIPPING_DESTINATION}.
      </div>
      <header className="border-b border-ink-line bg-ink/90 sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-xl tracking-wide text-cream">
            Soba<span className="text-gold"> House</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-cream-dim">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/seasonal-box"
              className="hidden sm:inline-block rounded border border-gold-soft px-3 py-1.5 text-gold hover:bg-gold/10 transition-colors"
            >
              Order a Box
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-ink-line mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-sm text-cream-dim">
          <p className="font-serif text-lg text-cream">
            Soba<span className="text-gold"> House</span>
          </p>
          <p className="mt-2">
            Artisan Japanese buckwheat noodles. {SHIPPING_DESTINATION}.
          </p>
          <p className="mt-4 text-xs text-cream-dim/70">
            {DEMO_NOTICE}.
          </p>
        </div>
      </footer>
    </>
  );
}
