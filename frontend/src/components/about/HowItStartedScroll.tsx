"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

export function HowItStartedScroll() {
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
      <div className="sticky top-0 w-full h-[100svh] flex items-center bg-[#FAF9F8] overflow-hidden">
        <Container className="w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left Column: Image with Wipe Effect */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-[4/5] md:aspect-[3/4] rounded-[24px] overflow-hidden border border-[#E8E5DC] shadow-xl bg-[#F5F3EC]">
                
                {/* Base Image (Before) */}
                <div className="absolute inset-0">
                  <Image 
                    src="/siya2.png" 
                    alt="Original Photo" 
                    fill 
                    className="object-contain object-top"
                  />
                </div>

                {/* Top Image (After - Ghibli) - Wipes from left to right */}
                <motion.div 
                  className="absolute inset-0 z-10"
                  style={{ clipPath }}
                >
                  <Image 
                    src="/siya_ghibli.png" 
                    alt="Ghibli Version" 
                    fill 
                    className="object-contain object-top"
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

            {/* Right Column: Text */}
            <div className="w-full lg:w-[45%]">
              <h2 className="text-[32px] md:text-[42px] font-title text-[#252A1A] mb-6">
                How It Started
              </h2>
              <div className="space-y-6 text-[17px] md:text-[18px] text-[#5A5A55] leading-[1.7]">
                <p>
                  It began with a simple desire: to make something by hand that meant something to someone. The first pieces were created at a small desk, fueled by a passion for design and a deep appreciation for human connection.
                </p>
                <p>
                  What started as a personal creative outlet quickly resonated with people who were looking for ways to express love without relying on mass-produced goods. Slowly, carefully, Totemood grew into a dedicated studio.
                </p>
                <p>
                  Today, every piece we craft still carries that original intention. We don&apos;t just process orders; we carefully assemble the fragments of your stories into art you can hold.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
