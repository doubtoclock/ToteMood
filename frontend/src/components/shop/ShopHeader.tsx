import React from "react";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function ShopHeader() {
  return (
    <section className="relative pt-6 pb-4 md:pt-10 md:pb-6 overflow-hidden flex flex-col items-center text-center px-4 md:px-6">
      <AmbientGlow 
        color="bg-[#C4C9B3]" 
        opacity={0.15} 
        position="top-[0%] left-[50%] -translate-x-1/2" 
        width="w-[80vw] md:w-[50vw]"
        height="h-[50vw] md:h-[30vw]"
        shape="organic1" 
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1C1C1A] tracking-tight mb-3 md:mb-4 whitespace-nowrap sm:whitespace-normal md:whitespace-nowrap">
          Super Customisable Tote Bags
        </h1>
        <p className="text-base md:text-lg text-[#5A5A55] leading-relaxed max-w-2xl mx-auto">
          Add your photos, words, emojis, and everything that makes it uniquely yours
        </p>
      </div>
    </section>
  );
}
