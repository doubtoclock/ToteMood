"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Truck } from "lucide-react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopSkeleton } from "@/components/shop/ShopSkeleton";
import { ShopNewsletter } from "@/components/shop/ShopNewsletter";
import { CustomerStories } from "@/components/home/CustomerStories";
import { useProducts } from "@/lib/useProducts";
import { useCartStore } from "@/lib/store/useCartStore";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      {/* Free Delivery Announcement Banner */}
      <div 
        style={{ backgroundColor: "#202517", color: "#F7F5EC" }}
        className="w-full py-3.5 px-4 border-b border-black/20 relative z-20 shadow-sm"
      >
        <div className="container mx-auto flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-medium tracking-wide">
          <Truck className="w-4 h-4 text-[#D8E494] shrink-0" />
          <span className="text-[#F2EFE4]">
            Enjoy{" "}
            <span className="text-[#D8E494] font-bold underline underline-offset-4 decoration-[#D8E494]">
              Free Delivery to All Customers
            </span>{" "}
            on every single order!
          </span>
        </div>
      </div>

      {/* 1. Quiet Brand Intro */}
      <ShopHeader />

      {/* 2. Product Discovery */}
      <section id="all-products" className="pt-0 pb-16 md:pt-2 md:pb-24 bg-[#FAF9F8]">
        <div className="container mx-auto px-6 lg:px-12">
          {loading ? (
            <ShopSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group flex flex-col transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#F5F3EC] mb-5 border border-[#E8E5DC]">
                  <Link href={`/shop/${product.id}`} className="absolute inset-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      loading="lazy"
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
                      <div className="flex text-[#b06161]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[12px] h-[12px] fill-current" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-[12px] text-[#8C867C]">
                        ({product.reviews && product.reviews > 0 ? product.reviews : 142})
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>



      {/* 3. Trust Highlights */}
      <ShopNewsletter />

      {/* 4. Customer Reviews */}
      <CustomerStories />
    </main>
  );
}
