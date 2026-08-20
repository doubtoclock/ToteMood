import Image from "next/image";
import Link from "next/link";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function ShopHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6EF] pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Background Ambience */}
      <AmbientGlow
        color="bg-[#C4C9B3]"
        opacity={0.2}
        position="top-[-10%] left-[-10%]"
        width="w-[80vw] md:w-[50vw]"
        height="h-[80vw] md:h-[50vw]"
        shape="organic1"
        animationDelay={0}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start pt-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-[#757D5C] mb-6 shadow-sm border border-white/40">
              <span className="w-2 h-2 rounded-full bg-[#757D5C]" />
              New Collection
            </span>
            
            <h1 className="text-5xl md:text-[64px] lg:text-[72px] font-serif text-[#1C1C1A] leading-[1.05] tracking-tight mb-6">
              Elevate Your Everyday with <span className="text-[#757D5C]">Premium Totes</span>
            </h1>
            
            <p className="text-lg text-[#5A5A55] max-w-lg mb-10 leading-relaxed">
              Discover carefully crafted canvas bags designed for quality, durability, and personal expression.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#all-products"
                className="bg-[#757D5C] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#5C6348] transition-colors duration-300 shadow-lg shadow-[#757D5C]/20 flex items-center gap-2 group"
              >
                Shop Now
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#categories"
                className="bg-white text-[#1C1C1A] border border-[#1C1C1A]/10 px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#F8F6EF] transition-colors duration-300 shadow-sm"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Right Images */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Ambient behind images */}
            <AmbientGlow
              color="bg-[#E6DEC4]"
              opacity={0.3}
              position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width="w-[100%]"
              height="h-[100%]"
              shape="organic2"
              animationDelay={2}
            />
            
            <div className="relative w-full max-w-[500px] aspect-[4/5] z-10">
              <Image
                src="/images/product_mockup.png"
                alt="Premium Tote"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-10 right-0 md:-right-10 bg-[#1C1C1A] text-white rounded-full w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">Up to</span>
                <span className="text-2xl md:text-3xl font-serif leading-none mt-1">30%</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80 mt-1">Off</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
