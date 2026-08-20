"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopValueProps } from "@/components/shop/ShopValueProps";
import { ShopPromo } from "@/components/shop/ShopPromo";
import { ShopNewsletter } from "@/components/shop/ShopNewsletter";
import { useProducts } from "@/lib/useProducts";
import { useCartStore } from "@/lib/store/useCartStore";

export default function ShopPage() {
  const { products, loading, error } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      {/* 1. Quiet Brand Intro */}
      <ShopHeader />

      {/* 2. Strong Collection Promo */}
      <div className="py-12 md:py-16">
        <ShopPromo />
      </div>

      {/* 3. Clean Product Discovery */}
      <section id="all-products" className="py-20 md:py-32 bg-[#FAF9F8]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <h2 className="text-[36px] md:text-[48px] font-title text-[#252A1A] mb-4">
              The Collection
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#5A5A55] max-w-[500px] mx-auto leading-[1.6]">
              Discover our complete range of meticulously crafted canvas bags and accessories, designed for real life.
            </p>
            {loading && (
              <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-[#8C867C]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Refreshing latest products
              </p>
            )}
            {error && (
              <p className="mt-4 text-[13px] text-[#8C867C]">
                Could not load the live catalog. Please refresh once the backend is running.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col transition-all"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#F5F3EC] mb-5 border border-[#E8E5DC]">
                  <Link href={`/shop/${product.id}`} className="absolute inset-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </Link>
                  
                  {/* Customization Badge */}
                  {product.isCustomizable && (
                    <div className="absolute top-4 left-4 bg-[#F5F3EC] px-3 py-1.5 rounded-[6px] shadow-sm z-10 border border-[#E8E5DC]/50">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#252A1A]">
                        Custom
                      </span>
                    </div>
                  )}

                  {/* Cart Icon Hover */}
                  <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => addItem(product)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-sm flex items-center justify-center opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 text-[#252A1A] hover:bg-[#252A1A] hover:text-white"
                  >
                    <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Product Info */}
                <Link href={`/shop/${product.id}`} className="flex flex-col flex-grow px-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[16px] font-medium text-[#252A1A] leading-snug line-clamp-2 h-[44px]">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[15px] font-bold text-[#252A1A]">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[13px] text-[#8C867C] line-through">
                        ₹{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-auto">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-[#D94F3C]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[12px] h-[12px] fill-current" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-[12px] text-[#8C867C]">({product.reviews})</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust/Reassurance */}
      <ShopValueProps />

      {/* 5. Newsletter */}
      <ShopNewsletter />
    </main>
  );
}
