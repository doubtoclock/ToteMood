"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface AmbientGlowProps {
  color?: string; // Tailwind bg class e.g., "bg-[#757D5C]", "bg-[#D9D1BA]"
  opacity?: number; 
  position?: string; // absolute classes e.g. "top-0 right-0"
  width?: string;
  height?: string;
  className?: string;
  animationDelay?: number;
  shape?: "organic1" | "organic2" | "organic3";
}

export function AmbientGlow({
  color = "bg-[#757D5C]",
  opacity = 0.06,
  position = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  width = "w-[800px] max-w-[90vw]",
  height = "h-[800px] max-h-[90vw]",
  className = "",
  animationDelay = 0,
  shape = "organic1",
}: AmbientGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Extremely subtle scroll-based vertical drift
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  
  // Custom organic border radii for non-circular, art-directed shapes
  // This avoids obvious geometric circles and performs better than SVG filters
  const radii = {
    organic1: "40% 60% 70% 30% / 40% 50% 60% 50%",
    organic2: "60% 40% 30% 70% / 60% 30% 70% 40%",
    organic3: "50% 50% 70% 30% / 30% 60% 40% 70%",
  };

  return (
    <div ref={ref} className={`absolute pointer-events-none z-0 ${position} ${className}`}>
      <motion.div
        style={{ y, borderRadius: radii[shape] }}
        animate={{
          scale: [1, 1.04, 1],
          rotate: [0, 4, -2, 0],
          opacity: [opacity, opacity * 1.15, opacity],
        }}
        transition={{
          duration: 25 + animationDelay * 3, // Very slow, ambient movement
          repeat: Infinity,
          ease: "linear",
          delay: animationDelay,
        }}
        className={`blur-[140px] md:blur-[180px] ${width} ${height} ${color}`}
      />
    </div>
  );
}
