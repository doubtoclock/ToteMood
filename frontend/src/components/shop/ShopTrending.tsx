"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useProducts } from "@/lib/useProducts";
import { useCartStore } from "@/lib/store/useCartStore";

export function ShopTrending() {
  const { products } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const trendingProducts = products.slice(0, 4);

  return (
    <section id="trending" className="py-16 md:py-24 bg-[#F8F6EF]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1C1A]">Trending Products</h2>
          <Link 
            href="#all-products" 
            className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest text-[#1C1C1A] hover:text-[#757D5C] transition-colors group"
          >
            View all products
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-white rounded-[20px] p-4 transition-shadow hover:shadow-lg border border-[#1C1C1A]/5"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#EAECE3] mb-5">
                <Link href={`/shop/${product.id}`} className="absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </Link>
                
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow px-2 pb-2">
                <Link href={`/shop/${product.id}`} className="text-base font-bold text-[#1C1C1A] leading-tight font-sans mb-1 line-clamp-1 hover:text-[#757D5C] transition-colors">
                  {product.name}
                </Link>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-[#1C1C1A]">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-[#8C867C] line-through">
                      ₹{product.oldPrice.toFixed(2)}
                    </span>
                  )}
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
                  <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => addItem(product)}
                    className="w-8 h-8 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
