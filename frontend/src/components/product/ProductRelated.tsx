import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/data/products";

export function ProductRelated({ currentProductId, products }: { currentProductId: string; products: Product[] }) {
  // Get 3-4 related products (excluding current one)
  const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-sans font-bold text-[#1C1C1A] uppercase tracking-wider">
            Related Products
          </h2>
          <div className="hidden md:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center text-[#1C1C1A] hover:bg-[#F8F6EF] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center text-[#1C1C1A] hover:bg-[#F8F6EF] transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {relatedProducts.map((product: Product, index: number) => (
            <Link 
              href={`/shop/${product.id}`} 
              key={product.id}
              className="group flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#EAECE3] mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="lazy"
                  className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col px-1">
                <h3 className="text-[13px] sm:text-base font-bold text-[#1C1C1A] leading-tight font-sans mb-1 line-clamp-1">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                  <div className="flex text-[#F5C518]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#5A5A55] ml-1">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[13px] sm:text-base font-bold text-[#1C1C1A]">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[10px] sm:text-xs text-[#8C867C] line-through">
                      ₹{product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
