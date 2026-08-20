import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopValueProps } from "@/components/shop/ShopValueProps";
import { ShopPromo } from "@/components/shop/ShopPromo";
import { ShopTrending } from "@/components/shop/ShopTrending";
import { ShopNewsletter } from "@/components/shop/ShopNewsletter";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { Product, fetchProducts } from "@/lib/products";

export default async function ShopPage() {
  let products: Product[] = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF]">
      {/* 1. Minimal Header */}
      <ShopHeader />

      {/* 2. Value Props Strip */}
      <ShopValueProps />
      
      {/* 4. Promotional Banner */}
      <ShopPromo />
      
      {/* 5. Trending Products */}
      <ShopTrending products={products} />

      {/* 6. All Products Grid */}
      <section id="all-products" className="py-16 md:py-24 bg-[#F8F6EF]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1C1C1A] tracking-tight mb-4">
              All Products
            </h2>
            <p className="text-[#5A5A55] max-w-2xl mx-auto">
              Discover our complete collection of meticulously crafted canvas bags and accessories.
            </p>
          </div>

          {products.length > 0 ? (
            <ShopProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-[#1C1C1A]/10 bg-white p-8 text-center text-[#5A5A55]">
              Products are temporarily unavailable. Please check that the backend database is connected.
            </div>
          )}
        </div>
      </section>

      {/* 7. Newsletter & Footer */}
      <ShopNewsletter />
    </main>
  );
}
