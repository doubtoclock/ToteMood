"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { ToteCanvas } from "./ToteCanvas";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WebGLErrorBoundary } from "@/components/ui/WebGLErrorBoundary";

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textureIndex, setTextureIndex] = useState(0);
  const [webglOk, setWebglOk] = useState(false);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll animations
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] overflow-hidden"
      style={{
        backgroundColor: "#F8F7F3",
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(110,122,83,.18), transparent 70%)",
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Subtle radial atmospheric glow centered around the tote (right-center) */}
        <AmbientGlow
          color="bg-[#757D5C]"
          opacity={0.06}
          position="right-[10%] top-1/2 -translate-y-1/2"
          width="w-[110vw] max-w-[1400px]"
          height="h-[110vw] max-h-[1400px]"
          shape="organic1"
        />

        {webglOk && (
          <div className="absolute inset-0 z-10 pointer-events-auto">
            <WebGLErrorBoundary>
              <ToteCanvas
                scrollYProgress={scrollYProgress}
                textureIndex={textureIndex}
              />
            </WebGLErrorBoundary>
          </div>
        )}

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.12)_150%)]" />

        {/* Subtle Grain Overlay - extremely low opacity to prevent digital flatness without being noisy */}
        <div
          className="absolute inset-0 z-30 pointer-events-none opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.5"/%3E%3C/svg%3E')`,
          }}
        />
      </div>

      <Container className="h-full relative z-20 flex flex-col justify-start md:justify-center pt-28 md:pt-20">
        {/* Text Content */}
        <motion.div
          className="max-w-lg flex flex-col justify-start md:justify-center h-full md:pb-20"
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-heading text-[50px] sm:text-[70px] md:text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.85] tracking-tight text-foreground"
          >
            Bags that
            <br />
            speak.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-8 md:mt-12 text-lg md:text-xl text-foreground/80 font-sans leading-relaxed max-w-[440px]"
          >
            Customize your best memories into your gift which you can gift to
            your friends, partner, family.
          </motion.p>
        </motion.div>
      </Container>

      {/* Interactive Illustration Controls - Moved out of z-0 to fix clickability */}
      <div className="absolute right-4 md:right-[15%] bottom-8 md:bottom-[15%] z-30 flex gap-4 pointer-events-auto">
        <button
          onClick={() => setTextureIndex((prev) => (prev - 1 + 5) % 5)}
          className="group w-12 h-12 rounded-full bg-white border border-primary/10 shadow-[0_8px_30px_rgba(28,28,26,0.06)] flex items-center justify-center text-primary transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(28,28,26,0.12)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Previous Illustration"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5] group-hover:-translate-x-0.5 transition-transform duration-300" />
        </button>
        <button
          onClick={() => setTextureIndex((prev) => (prev + 1) % 5)}
          className="group w-12 h-12 rounded-full bg-white border border-primary/10 shadow-[0_8px_30px_rgba(28,28,26,0.06)] flex items-center justify-center text-primary transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(28,28,26,0.12)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Next Illustration"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5] group-hover:translate-x-0.5 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
