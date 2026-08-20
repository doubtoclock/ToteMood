"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";

export function ShopProductGrid({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => (
        <article
          key={product.id}
          className="group flex flex-col bg-white rounded-[20px] p-4 transition-shadow hover:shadow-lg border border-[#1C1C1A]/5"
        >
          <Link href={`/shop/${product.id}`} className="flex flex-col flex-grow">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#EAECE3] mb-3 sm:mb-5">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {product.isCustomizable && (
                <div className="absolute top-3 left-3 bg-[#757D5C] px-2 py-1 rounded-[4px] z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    Custom
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-grow px-2 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1C1C1A] leading-tight font-sans mb-1 line-clamp-2 sm:line-clamp-1">
                {product.name}
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <span className="text-base sm:text-lg font-bold text-[#1C1C1A]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-[11px] sm:text-sm text-[#8C867C] line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between px-2 pb-2 mt-auto">
            <div className="flex items-center gap-1 min-w-0">
              <div className="flex text-[#F5C518]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-medium text-[#5A5A55] ml-1">({product.reviews})</span>
            </div>

            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => addItem(product)}
              className="w-8 h-8 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white transition-colors shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
