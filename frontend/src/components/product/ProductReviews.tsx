import Image from "next/image";
import { Star } from "lucide-react";

export function ProductReviews({ productId }: { productId?: string }) {
  // Deterministically pick 4 unique review images (1-27) based on productId
  let indices = [2, 8, 14, 23]; // Default
  if (productId) {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = (hash << 5) - hash + productId.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    
    const uniqueIndices = new Set<number>();
    let multiplier = 1;
    while (uniqueIndices.size < 4) {
      const idx = ((seed * multiplier) % 27) + 1;
      uniqueIndices.add(idx);
      multiplier += 3;
    }
    indices = Array.from(uniqueIndices);
  }

  const reviewImages = indices.map((idx) => `/review/${idx}.png`);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-title text-[#252A1A] tracking-tight mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex text-[#b06161]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[16px] h-[16px] fill-current" strokeWidth={0} />
                ))}
              </div>
              <span className="text-[14px] font-bold text-[#252A1A]">4.9 / 5</span>
              <span className="text-[14px] text-[#8C867C]">(128 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {reviewImages.map((src, idx) => (
            <div 
              key={idx} 
              className="relative w-full rounded-[20px] overflow-hidden border border-[#E8E5DC] shadow-sm bg-[#FAF9F8]"
            >
              <Image 
                src={src} 
                alt={`Customer review ${idx + 1}`} 
                width={400}
                height={600}
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
