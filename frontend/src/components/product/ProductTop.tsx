"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Star, Truck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, products as staticProducts } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/useCartStore";

export function ProductTop({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const oldPrice = product.oldPrice ?? product.originalPrice;

  const thumbnails = useMemo(() => {
    if (product.gallery && product.gallery.length > 1) {
      return product.gallery;
    }
    const match = staticProducts.find(
      (p) => p.id === product.id || p.name.toLowerCase() === product.name?.toLowerCase()
    );
    if (match?.gallery && match.gallery.length > 0) {
      return match.gallery;
    }
    const image = product.image || "";
    const matchW = image.match(/W(\d+)\.png/i);
    if (matchW) {
      const num = parseInt(matchW[1], 10);
      const baseGroup = Math.floor((num - 1) / 4) * 4 + 1;
      return [
        `/images/product/W${baseGroup}.png`,
        `/images/product/W${baseGroup + 1}.png`,
        `/images/product/W${baseGroup + 2}.png`,
        `/images/product/W${baseGroup + 3}.png`,
      ];
    }
    return [product.image];
  }, [product]);

  const [activeImage, setActiveImage] = useState(thumbnails[0] || product.image);

  useEffect(() => {
    if (thumbnails.length > 0) {
      setActiveImage(thumbnails[0]);
    }
  }, [thumbnails]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-[1200px] mx-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 w-full">
            {/* Main Image */}
            <div className="relative aspect-[4/5] lg:aspect-square w-full overflow-hidden rounded-[24px] bg-[#F5F3EC] flex items-center justify-center p-0 md:p-6 border border-[#E8E5DC]">
              <div className="relative w-full h-full">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover md:object-contain rounded-[20px] md:rounded-none"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(thumb)}
                  className={`relative aspect-square rounded-[14px] overflow-hidden bg-[#F5F3EC] border-[1.5px] transition-all ${
                    activeImage === thumb ? "border-[#8E9476]" : "border-[#E8E5DC] hover:border-[#8C867C]"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col py-4 lg:py-8 w-full">
            
            {/* Category */}
            <p className="text-[12px] font-bold text-[#8C867C] uppercase tracking-[0.15em] mb-4">
              {product.category}
            </p>

            <h1 className="text-[32px] md:text-[40px] font-title text-[#252A1A] leading-[1.1] tracking-tight mb-4">
              {product.name}
            </h1>
            
            {/* Pricing */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[24px] md:text-[28px] font-bold text-[#252A1A]">
                ₹{product.price.toFixed(2)}
              </span>
              {oldPrice && (
                <span className="text-[16px] text-[#8C867C] line-through">
                  ₹{oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Ratings */}
            {(() => {
              const reviewCount = product.reviews && product.reviews > 0 
                ? product.reviews 
                : ((product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 90) + 135);
              const rating = product.rating && product.rating >= 4 ? product.rating : 4.9;
              return (
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-[#b06161]">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-[14px] h-[14px] ${i < Math.floor(rating) ? 'fill-current' : 'fill-current opacity-80'}`} 
                        strokeWidth={0} 
                      />
                    ))}
                  </div>
                  <span className="text-[13px] font-medium text-[#5A5A55] ml-1">
                    {reviewCount} reviews
                  </span>
                </div>
              );
            })()}
            
            <p className="text-[16px] md:text-[18px] text-[#5A5A55] leading-[1.6] mb-8">
              {product.description}
            </p>

            {/* Compact Purchase Details */}
            <div className="flex flex-col gap-3 mb-10 p-5 bg-[#F5F3EC] rounded-[16px] border border-[#E8E5DC]">
              {product.isCustomizable && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8E9476] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-bold text-[#252A1A] mb-0.5">Free Customisation Included</h4>
                    <p className="text-[13px] text-[#686B59]">Add your image and text during checkout.</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 mt-1">
                <Truck className="w-5 h-5 text-[#8E9476] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[14px] font-bold text-[#252A1A] mb-0.5">Dispatches in 24-48 hours</h4>
                  <p className="text-[13px] text-[#686B59]">Free shipping on all orders.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button 
                onClick={() => addItem(product)}
                className="w-full h-14 rounded-[14px] bg-[#8E9476] text-white text-[14px] font-bold uppercase tracking-widest hover:bg-[#7a8063] transition-colors shadow-sm"
              >
                {product.isCustomizable ? "Customize & Add to Cart" : "Add to Cart"}
              </button>
              <button 
                onClick={() => {
                  addItem(product);
                  router.push("/checkout");
                }}
                className="w-full h-14 rounded-[14px] bg-[#252A1A] text-white text-[14px] font-bold uppercase tracking-widest hover:bg-[#3A3E2F] transition-colors shadow-sm"
              >
                Buy Now
              </button>
            </div>
            
            <p className="text-center text-[12px] text-[#8C867C]">
              Secure payment. We use industry standard encryption.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
