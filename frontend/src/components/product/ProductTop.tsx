"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Star, Truck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, products as staticProducts } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/useCartStore";

const WHATSAPP_URL = "https://wa.me/919890842755?text=Hi%20Totemood!%20I%27d%20like%20a%20free%20sample%20preview%20please.";

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
      {/* WhatsApp Sample Preview Banner */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mb-8 -mt-2"
      >
        <div
          style={{ backgroundColor: "#202517", color: "#F7F5EC" }}
          className="w-full py-3.5 px-4 rounded-[14px] relative z-20 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-medium tracking-wide">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366] shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-[#F2EFE4]">
              Get a free sample preview on WhatsApp.{" "}
              <span className="text-[#25D366] font-bold underline underline-offset-4 decoration-[#25D366]">
                WhatsApp us on +91 98908 42755
              </span>
            </span>
          </div>
        </div>
      </a>

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
                    loading={index === 0 ? "eager" : "lazy"}
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
