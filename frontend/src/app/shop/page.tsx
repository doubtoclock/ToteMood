import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopValueProps } from "@/components/shop/ShopValueProps";
import { ShopCategories } from "@/components/shop/ShopCategories";
import { ShopPromo } from "@/components/shop/ShopPromo";
import { ShopTrending } from "@/components/shop/ShopTrending";
import { ShopNewsletter } from "@/components/shop/ShopNewsletter";

export default async function ShopPage() {
  let products = [];
  try {
    const res = await fetch('http://localhost:4000/api/products', { cache: 'no-store' });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (

    <main className="min-h-screen bg-[#F8F6EF]">
      {/* 1. Hero Section */}
      <ShopHero />
      
      {/* 2. Value Props Strip */}
      <ShopValueProps />
      
      {/* 3. Categories */}
      <ShopCategories />
      
      {/* 4. Promotional Banner */}
      <ShopPromo />
      
      {/* 5. Trending Products */}
      <ShopTrending />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <Link 
                href={`/shop/${product.id}`} 
                key={product.id}
                className="group flex flex-col bg-white rounded-[20px] p-4 transition-shadow hover:shadow-lg border border-[#1C1C1A]/5"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#EAECE3] mb-5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Customization Badge */}
                  {product.isCustomizable && (
                    <div className="absolute top-3 left-3 bg-[#757D5C] px-2 py-1 rounded-[4px] z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Custom
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow px-2 pb-2">
                  <h3 className="text-base font-bold text-[#1C1C1A] leading-tight font-sans mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-[#1C1C1A]">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1">
                      <div className="flex text-[#F5C518]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-[#5A5A55] ml-1">({product.reviews})</span>
                    </div>

                    {/* Add to Cart Icon Button */}
                    <button className="w-8 h-8 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter & Footer */}
      <ShopNewsletter />
    </main>
  );
}
