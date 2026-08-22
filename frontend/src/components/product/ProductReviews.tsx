import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export function ProductReviews() {
  // Use all 27 reviews for every product
  const reviewImages = Array.from({ length: 27 }).map((_, i) => `/review/${i + 1}.png`);

  const content = (
    <div className="flex items-center gap-4 sm:gap-6 px-2 sm:px-3">
      {reviewImages.map((src, idx) => (
        <div 
          key={idx} 
          className="relative w-[220px] sm:w-[280px] aspect-[9/16] shrink-0 rounded-[20px] overflow-hidden border border-[#E8E5DC] shadow-sm bg-[#FAF9F8]"
        >
          <Image 
            src={src} 
            alt={`Customer review ${idx + 1}`} 
            fill
            className="object-cover hover:scale-[1.02] transition-transform duration-500" 
            sizes="(max-width: 640px) 220px, 280px"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
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
      </div>

      {/* Horizontal Marquee */}
      <div className="relative w-full flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 120, repeat: Infinity }}
          className="flex w-max"
        >
          {content}
          {content}
        </motion.div>
      </div>
    </section>
  );
}
