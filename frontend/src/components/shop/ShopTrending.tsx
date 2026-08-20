import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/products";

export function ShopTrending({ products = [] }: { products?: Product[] }) {
  // Use the first 4 products as "Trending"
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
                
                {/* Sale / Custom Badge */}
                {product.isCustomizable ? (
                  <div className="absolute top-3 left-3 bg-[#757D5C] px-2 py-1 rounded-[4px] z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Custom
                    </span>
                  </div>
                ) : null}
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
                  {/* Mock original price for reference style */}
                  <span className="text-sm text-[#8C867C] line-through">
                    ₹{(product.price * 1.2).toFixed(2)}
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
  );
}
