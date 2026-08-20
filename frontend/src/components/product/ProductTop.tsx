"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Shield, Truck, RotateCcw, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { Product } from "@/lib/products";

export function ProductTop({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const originalPrice = product.oldPrice || (product.price * 1.2);
  const savings = originalPrice - product.price;

  const rating = product.rating || 4.8;
  const reviews = product.reviews || 128;

  const thumbnails: string[] = product.gallery || [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const [activeImage, setActiveImage] = useState(thumbnails[0]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4 sticky top-32">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#EAECE3] shadow-sm flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {product.isCustomizable && (
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm z-10">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1A]">
                    Customizable
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(thumb)}
                  className={`relative aspect-square rounded-[16px] overflow-hidden bg-[#EAECE3] border-2 transition-all ${
                    activeImage === thumb ? "border-[#757D5C]" : "border-transparent hover:border-[#1C1C1A]/20"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col pt-2 lg:pt-8">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-serif text-[#1C1C1A] leading-[1.1] mb-2 uppercase tracking-tight">
              {product.name}
            </h1>
            <p className="text-[#5A5A55] text-lg mb-4">{product.category}</p>
            
            {/* Ratings */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-[#F5C518]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-[#1C1C1A]">{rating}</span>
              <span className="text-sm text-[#5A5A55]">{reviews} Reviews</span>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <span className="text-lg text-[#8C867C] line-through block mb-1">
                ₹{originalPrice.toFixed(2)}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-bold text-[#757D5C]">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="bg-[#E6DEC4] text-[#757D5C] px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                  Save ₹{savings.toFixed(0)}
                </span>
              </div>
            </div>
            
            <p className="text-base text-[#5A5A55] leading-relaxed mb-8">
              {product.description} <br/><br/>
              Experience industry-leading canvas durability, premium reinforced stitching, and unparalleled everyday comfort.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              <button 
                onClick={() => addItem(product)}
                className="w-full h-14 md:h-16 rounded-full bg-[#757D5C] text-white font-bold uppercase tracking-[0.1em] hover:bg-[#5C6348] transition-colors duration-300 shadow-md"
              >
                {product.isCustomizable ? "Customize & Add to Cart" : "Add to Cart"}
              </button>
              <button 
                onClick={() => {
                  addItem(product);
                  router.push("/checkout");
                }}
                className="w-full h-14 md:h-16 rounded-full bg-[#1C1C1A] text-white font-bold uppercase tracking-[0.1em] hover:bg-black transition-colors duration-300 shadow-md"
              >
                Buy Now
              </button>
              <p className="text-center text-sm font-medium text-[#1C1C1A] mt-2">
                Free 2-Day Shipping
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-8 border-t border-[#1C1C1A]/10">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#5A5A55]" />
                <span className="text-sm font-medium text-[#1C1C1A]">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#5A5A55]" />
                <span className="text-sm font-medium text-[#1C1C1A]">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#5A5A55]" />
                <span className="text-sm font-medium text-[#1C1C1A]">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#5A5A55]" />
                <span className="text-sm font-medium text-[#1C1C1A]">Lifetime Warranty</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
