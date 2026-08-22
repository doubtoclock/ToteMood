"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ShopPromo() {
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
    <div className="container mx-auto px-6 lg:px-12">
      <div className="bg-[#F8F6EF] rounded-[24px] overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left Content */}
        <div className="w-full lg:w-[52%] p-8 md:p-12 lg:pl-16 lg:pr-24 lg:py-20 flex flex-col justify-center items-start z-10">
          <span className="inline-flex items-center px-4 py-1.5 bg-[#F5F3EC] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#252A1A] mb-6 border border-[#E8E5DC]">
            Limited Time Offer
          </span>
          
          <h2 className="text-[44px] md:text-[54px] lg:text-[60px] font-title text-[#252A1A] leading-[1.05] tracking-tight mb-4 w-full">
            Summer<br/>Collection Is Here
          </h2>
          
          <p className="text-[17px] md:text-[18px] text-[#686B59] mb-10 max-w-[420px] leading-[1.6]">
            Get up to 30% off on all customizable totes. Excludes Artist Series.
          </p>
          
          <Link
            href="#all-products"
            className="bg-[#252A1A] text-white px-8 h-[52px] rounded-full text-[14px] font-medium tracking-wide hover:bg-[#3A3E2F] transition-colors flex items-center justify-center gap-2 group w-full sm:w-auto inline-flex"
          >
            Shop the Sale
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Mobile Countdown - Horizontal (Below CTA, Above Image) */}
        <div className="lg:hidden w-full flex items-center justify-center py-6 bg-white border-y border-[#E8E5DC]">
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-medium text-[#5A5A55] mb-3">Offer ends in</span>
            <div className="flex gap-3 text-[22px] font-title text-[#252A1A]">
              <div className="flex flex-col items-center w-[36px]">
                <span>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Days</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[36px]">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Hrs</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[36px]">
                <span>{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Mins</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[36px]">
                <span>{String(timeLeft.secs).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Countdown - Absolute Circle */}
        <div className="hidden lg:flex lg:absolute lg:left-[53%] lg:top-[55%] lg:-translate-y-1/2 lg:-translate-x-1/2 z-20 justify-center">
          <div className="bg-white rounded-full w-[250px] h-[250px] flex flex-col items-center justify-center shadow-sm border border-[#E8E5DC] p-6 text-center">
            <span className="text-[12px] font-medium text-[#5A5A55] mb-1">Hurry up!</span>
            <span className="text-[12px] text-[#8C867C] mb-5">Offer ends in</span>
            
            <div className="flex gap-2 text-[22px] font-title text-[#252A1A]">
              <div className="flex flex-col items-center w-[32px]">
                <span>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Days</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[32px]">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Hrs</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[32px]">
                <span>{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Mins</span>
              </div>
              <span className="text-[#E8E5DC] font-sans -mt-0.5">:</span>
              <div className="flex flex-col items-center w-[32px]">
                <span>{String(timeLeft.secs).padStart(2, '0')}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#8C867C] mt-1">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="w-full lg:w-[48%] flex flex-col h-[400px] lg:h-auto group">
          <div className="relative h-[65%] w-full overflow-hidden">
            <Image 
              src="/images/collection_weekend.png" 
              alt="Weekend Tote" 
              fill 
              className="object-cover object-[center_35%] transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="relative h-[35%] w-full overflow-hidden">
            <Image 
              src="/images/feature_premium_canvas.png" 
              alt="Premium Texture" 
              fill 
              className="object-cover opacity-90 transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
