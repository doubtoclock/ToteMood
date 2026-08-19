import React from "react";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function ShopHeader() {
  return (
    <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden flex flex-col items-center text-center px-4 md:px-6">
      <AmbientGlow 
        color="bg-[#C4C9B3]" 
        opacity={0.15} 
        position="top-[0%] left-[50%] -translate-x-1/2" 
        width="w-[80vw] md:w-[50vw]"
        height="h-[50vw] md:h-[30vw]"
        shape="organic1" 
      />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1C1A] tracking-tight mb-4 md:mb-6 uppercase">
          The Collection
        </h1>
        <p className="text-base md:text-lg text-[#5A5A55] leading-relaxed">
          Discover our range of meticulously crafted canvas bags. Designed for your everyday moments, ready to be customized with your unique story.
        </p>
      </div>
    </section>
  );
}
