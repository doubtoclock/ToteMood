"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopCategories } from "@/components/shop/ShopCategories";
import { ShopSkeleton } from "@/components/shop/ShopSkeleton";
import { ShopNewsletter } from "@/components/shop/ShopNewsletter";
import { CustomerStories } from "@/components/home/CustomerStories";
import { useProducts } from "@/lib/useProducts";
import { useCartStore } from "@/lib/store/useCartStore";
import { offerSignInIfSignedOut } from "@/lib/store/useSignInPrompt";

export default function ShopPage() {
  const [page, setPage] = useState(1);
  const { products, loading, error, pagination, refetch } = useProducts({ page, pageSize: 6 });
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

      <ShopCategories />

      {/* 2. Product Discovery */}
      <section id="all-products" className="pt-0 pb-16 md:pt-2 md:pb-24 bg-[#FAF9F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {loading ? (
            <ShopSkeleton />
          ) : error && products.length === 0 ? (
            <div className="rounded-[24px] border border-[#E8E5DC] bg-white px-6 py-16 text-center">
              <h2 className="font-heading text-3xl text-[#1C1C1A]">Our tote collection is loading</h2>
              <p className="mx-auto mt-3 max-w-md text-[#5A5A55]">We couldn&apos;t reach the collection just now. Please try again.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-7 rounded-full bg-[#757D5C] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#5C6348]"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 md:gap-10">
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
                  


                  {/* Cart Icon Hover */}
                  <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => {
                      addItem(product);
                      offerSignInIfSignedOut();
                    }}
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm flex items-center justify-center opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 text-[#252A1A] hover:bg-[#252A1A] hover:text-white"
                  >
                    <ShoppingCart className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Product Info */}
                <Link href={`/shop/${product.id}`} className="flex flex-col flex-grow px-1">
                  <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2 min-h-[40px] sm:min-h-[48px]">
                    <h3 className="text-[13px] sm:text-[16px] font-bold font-sans text-[#1C1C1A] leading-snug break-words">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-[13px] sm:text-[15px] font-bold text-[#252A1A]">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[11px] sm:text-[13px] text-[#8C867C] line-through">
                        ₹{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-auto">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="flex text-[#b06161]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] fill-current" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-[12px] text-[#8C867C]">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <nav aria-label="Product pages" className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-full border border-[#1C1C1A]/20 px-5 py-2.5 text-sm font-bold text-[#252A1A] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <span className="text-sm text-[#5A5A55]">Page {pagination.page} of {pagination.totalPages}</span>
                <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-full bg-[#252A1A] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </nav>
            )}
            </>
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
