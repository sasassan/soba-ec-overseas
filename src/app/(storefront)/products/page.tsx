import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Products",
  description: "Our full range of dried soba noodles and tsuyu broth.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-3xl text-cream">All Products</h1>
        <p className="mt-2 text-cream-dim">
          Six dried noodles and two tsuyu, each with its own aroma and texture.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </div>
  );
}
