"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ScrollToteCanvas } from "./ScrollToteCanvas";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function MomentsWeCarry() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveIndex(0);
    } else if (latest >= 0.35 && latest < 0.7) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  // 0-20%: Photo entrance (resting at 10vh to leave room for header and bottom text)
  const photoY = useTransform(scrollYProgress, [0, 0.15], ["40vh", "10vh"]);
  const photoRotate = useTransform(
    scrollYProgress,
    [0, 0.15],
    ["-8deg", "0deg"],
  );
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], ["20px", "0px"]);

  // 20-45%: Mask reveal (Original -> Illustration)
  const maskProgress = useTransform(scrollYProgress, [0.2, 0.45], [0, 100]);

  // 45-70%: Artwork moves to meet the dropping bag
  // It starts at photoY (10vh), and the bag has been lowered to -0.85 (which is exactly ~10vh down in 3D space)
  // So we no longer need to translate it upward to meet the bag! It can stay perfectly still in Y.
  const artworkY = useTransform(scrollYProgress, [0.45, 0.7], ["0vh", "0vh"]);
  const artworkScale = useTransform(scrollYProgress, [0.45, 0.7], [1, 0.38]);
  const artworkRotate = useTransform(
    scrollYProgress,
    [0.45, 0.7],
    ["0deg", "3deg"],
  );

  // We fade out the DOM artwork right as it reaches the bag and the WebGL shader starts its reveal
  const artworkOpacity = useTransform(scrollYProgress, [0.65, 0.7], [1, 0]);

  const headerFadeOut = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[450vh] bg-[#F8F6EF]">

      {/* Sticky Inner Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle paper grain background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
            backgroundRepeat: "repeat",
          }}
        />

        {/* Soft muted olive glow positioned away from the main text */}
        <AmbientGlow
          color="bg-[#757D5C]"
          opacity={0.07}
          position="bottom-[-5%] left-[-10%]"
          width="w-[120vw] md:w-[70vw]"
          height="h-[120vw] md:h-[70vw]"
          shape="organic3"
          animationDelay={4}
        />

        {/* 3D R3F Layer (z-index 20) */}
        <ScrollToteCanvas scrollYProgress={scrollYProgress} />

        {/* Header (z-index 30) */}
        <motion.div
          className="absolute top-8 md:top-16 left-0 w-full flex flex-col items-center text-center z-30 px-6"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <motion.div style={{ opacity: headerFadeOut }}>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1A] tracking-tight mb-4">
              From your photo to a Timeless Tote
            </h2>
            <p className="text-lg text-[#5A5A55] max-w-[500px] mx-auto">
              Every detail is meticulously crafted. Watch your memory transform
              into wearable art.
            </p>
          </motion.div>
        </motion.div>

        {/* 2D Photo/Illustration Layers (z-index 10) */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{
            y: artworkY,
            scale: artworkScale,
            rotate: artworkRotate,
            opacity: artworkOpacity,
          }}
        >
          {/* Container defining the size of the photo */}
          <motion.div
            className="relative w-[70vw] md:w-[80vw] max-w-[400px] aspect-[4/5] rounded-[32px] shadow-2xl overflow-hidden bg-white"
            style={{ y: photoY, rotate: photoRotate }}
          >
            {/* Original Photo */}
            <div className="absolute inset-0">
              <Image
                src="/images/original_photo.png"
                alt="Original Photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 400px"
              />
            </div>

            {/* Illustrated Artwork (Masked) */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: useTransform(
                  maskProgress,
                  (p) => `inset(0% ${100 - p}% 0% 0%)`,
                ),
              }}
            >
              <Image
                src="/images/illustration1.png"
                alt="Illustrated Artwork"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 400px"
              />
              {/* Soft glow on the leading edge of the mask */}
              <motion.div
                className="absolute top-0 bottom-0 w-[20px] bg-white/40 blur-[10px]"
                style={{
                  left: useTransform(maskProgress, (p) => `${p}%`),
                  transform: "translateX(-50%)",
                  opacity: useTransform(maskProgress, (p) =>
                    p > 0 && p < 100 ? 1 : 0,
                  ),
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Persistent CTA (Right Column) (z-index 30) */}
        <div className="absolute right-0 lg:left-[calc(50%+200px)] lg:right-auto w-full lg:w-[calc(50vw-200px)] h-full flex flex-col items-center lg:items-start justify-end lg:justify-center pb-8 md:pb-12 lg:pb-0 px-6 lg:px-12 z-30 pointer-events-auto">
          <div className="w-full max-w-[420px] text-center lg:text-left">
            <h3 className="text-3xl md:text-5xl lg:text-[60px] font-serif text-[#1C1C1A] mb-8 lg:mb-10 leading-[1.05]">
              Every memory
              <br className="hidden lg:block" /> deserves to be
              <br className="hidden lg:block" /> carried.
            </h3>
            <Link href="/shop" className="bg-[#1C1C1A] text-white w-[200px] h-[60px] rounded-full font-medium tracking-wide hover:bg-black transition-colors duration-300 mx-auto lg:mx-0 flex items-center justify-center">
              Create Yours
            </Link>
          </div>
        </div>

        {/* Vertical Timeline (z-index 30) */}
        <div className="hidden md:flex absolute left-8 lg:left-[100px] top-1/2 -translate-y-1/2 flex-col z-30 pointer-events-none h-[240px]">
          {/* Background vertical line */}
          <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-[#1C1C1A]/50" />

          {/* Animated foreground vertical line */}
          <motion.div
            className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-[#1C1C1A] origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="flex flex-col justify-between h-full pl-8">
            {[
              "Upload Your Photo",
              "We Turn It Into Art",
              "Printed on Your Tote",
            ].map((text, i) => {
              const isActive = activeIndex === i;
              return (
                <div key={text} className="relative flex items-center">
                  <motion.div
                    className="absolute -left-8 w-2 h-2 rounded-full"
                    initial={false}
                    animate={{
                      backgroundColor: isActive ? "#1C1C1A" : "#8C867C",
                      scale: isActive ? 1 : 0.75,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                  <motion.span
                    className="text-xs md:text-[14px] tracking-[0.15em] uppercase"
                    initial={false}
                    animate={{
                      color: isActive ? "#1C1C1A" : "#8C867C",
                      x: isActive ? 0 : -4,
                      fontWeight: isActive ? 600 : 500,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {text}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
