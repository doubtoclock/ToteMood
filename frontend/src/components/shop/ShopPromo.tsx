"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ShopPromo() {
  // Simple countdown timer for demonstration
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    mins: 36,
    secs: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="bg-[#F8F6EF] rounded-[24px] overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Content */}
          <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-widest text-[#1C1C1A] mb-6 shadow-sm border border-[#1C1C1A]/10">
              Limited Time Offer
            </span>
            
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1C1A] leading-[1.1] tracking-tight mb-4">
              Summer Collection Is Here
            </h2>
            
            <p className="text-lg text-[#5A5A55] mb-8">
              Get up to 30% off on all customizable totes. Excludes Artist Series.
            </p>
            
            <Link
              href="#trending"
              className="bg-[#1C1C1A] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-black transition-colors duration-300 shadow-md flex items-center gap-2 group"
            >
              Shop the Sale
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Middle Countdown */}
          <div className="w-full lg:w-[20%] p-8 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-[#1C1C1A]/5 relative">
            {/* The white circle in the reference */}
            <div className="bg-white rounded-full w-[240px] h-[240px] flex flex-col items-center justify-center shadow-lg border border-[#1C1C1A]/5 p-6 text-center">
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">Hurry Up!</span>
              <span className="text-xs text-[#5A5A55] mb-4">Offer ends in</span>
              
              <div className="flex gap-2 text-2xl font-serif font-bold text-[#1C1C1A]">
                <div className="flex flex-col items-center min-w-[32px]">
                  <span>{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-[10px] font-sans font-normal text-[#5A5A55] mt-1">Days</span>
                </div>
                <span className="text-[#5A5A55] font-sans -mt-1">:</span>
                <div className="flex flex-col items-center min-w-[32px]">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] font-sans font-normal text-[#5A5A55] mt-1">Hrs</span>
                </div>
                <span className="text-[#5A5A55] font-sans -mt-1">:</span>
                <div className="flex flex-col items-center min-w-[32px]">
                  <span>{String(timeLeft.mins).padStart(2, '0')}</span>
                  <span className="text-[10px] font-sans font-normal text-[#5A5A55] mt-1">Mins</span>
                </div>
                <span className="text-[#5A5A55] font-sans -mt-1">:</span>
                <div className="flex flex-col items-center min-w-[32px]">
                  <span>{String(timeLeft.secs).padStart(2, '0')}</span>
                  <span className="text-[10px] font-sans font-normal text-[#5A5A55] mt-1">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="w-full lg:w-[35%] flex flex-col md:flex-row lg:flex-col">
            <div className="relative h-[250px] md:h-auto md:flex-1 lg:h-1/2 w-full bg-[#EAECE3] border-b md:border-b-0 md:border-r lg:border-r-0 lg:border-b border-white">
              <Image 
                src="/images/collection_weekend.png" 
                alt="Weekend Tote" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className="relative h-[250px] md:h-auto md:flex-1 lg:h-1/2 w-full bg-[#DCDED5]">
              <Image 
                src="/images/feature_premium_canvas.png" 
                alt="Premium Canvas" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
