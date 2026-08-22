"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

export function WhyTotemoodExistsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const maskProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const clipPath = useTransform(maskProgress, (p) => `inset(0% ${100 - p}% 0% 0%)`);
  const lineLeft = useTransform(maskProgress, (p) => `${p}%`);
  const lineOpacity = useTransform(maskProgress, (p) => (p > 5 && p < 95 ? 1 : 0));

  return (
    <div ref={containerRef} className="relative w-full h-[250vh]">
      <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-start bg-[#FAF9F8] overflow-hidden pt-[40px] md:pt-[60px] pb-8">
        <Container className="w-full relative z-10 flex flex-col items-center justify-start h-full">
          
          <div className="flex flex-col items-center text-center w-full gap-8 shrink-0">
            
            {/* Header Text */}
            <div className="flex flex-col items-center text-center z-20">
              <p className="text-[14px] md:text-[16px] text-[#C25858] font-bold uppercase tracking-[0.2em] mb-4">
                BUILDING TOTEMOOD
              </p>
              <h1 className="text-[52px] md:text-[72px] font-title text-[#252A1A] leading-[1.1] tracking-tight">
                Siya Maurya
              </h1>
            </div>

            {/* Centered Image with Wipe Effect */}
            <div className="relative shrink-0 w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] aspect-[4/5] md:aspect-[3/4] rounded-[16px] md:rounded-[24px] overflow-hidden border border-[#E8E5DC] shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-[#F5F3EC]">
              
              {/* Base Image (Before) */}
              <div className="absolute inset-0">
                <Image 
                  src="/siya2.jpeg" 
                  alt="Siya Maurya Original" 
                  fill 
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Top Image (After - Ghibli) - Wipes from left to right */}
              <motion.div 
                className="absolute inset-0 z-10"
                style={{ clipPath }}
              >
                <Image 
                  src="/siya_ghibli.png" 
                  alt="Siya Maurya Ghibli" 
                  fill 
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </motion.div>

              {/* Glow line following the wipe */}
              <motion.div 
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{ 
                  left: lineLeft, 
                  opacity: lineOpacity 
                }}
              >
                <div className="absolute top-0 bottom-0 w-[2px] bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2" />
                <div className="absolute top-0 bottom-0 w-[40px] bg-white/30 blur-[20px] -translate-x-1/2" />
              </motion.div>
            </div>

          </div>

        </Container>
      </div>
    </div>
  );
}
