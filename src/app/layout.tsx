import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Soba House — Artisan Japanese Buckwheat Noodles",
    template: "%s — Soba House",
  },
  description:
    "Premium Japanese soba noodles and tsuyu broth. Demo storefront — no real payments or shipments. Ships to the United States.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
