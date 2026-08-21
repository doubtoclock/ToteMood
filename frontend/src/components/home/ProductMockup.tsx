"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function ProductMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll over the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. The bags slide down and scale slightly. Offset it negatively so it stays centered higher up.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // 2. The massive TOTEMOOD text slides up from behind
  const textY = useTransform(scrollYProgress, [0, 1], ["100%", "-5%"]);
  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  // 3. The footer links elegantly fade in at the very end
  const footerOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.7, 1], ["20px", "0px"]);

  return (
    <section ref={containerRef} className="bg-[#EAECE3] h-auto md:h-[180vh] relative">
      {/* MOBILE LAYOUT (Static, tightly packed) */}
      <div className="flex md:hidden flex-col items-center justify-center pt-20 pb-12 w-full overflow-hidden relative">
        {/* Ambient Glows */}
        <AmbientGlow
          color="bg-[#757D5C]"
          opacity={0.15}
          position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width="w-[150vw]"
          height="h-[150vw]"
          shape="organic1"
        />

        {/* Layer Wrapper */}
        <div className="relative w-full flex items-center justify-center mt-4 mb-4">
          {/* Background Text (Absolute layer behind the image) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <h2 className="text-[35vw] font-heading text-primary/15 leading-[0.75] tracking-tighter select-none text-center flex flex-col mt-[-5%]">
              <span>TOTE</span>
              <span>MOOD</span>
            </h2>
          </div>

          {/* Image (Relative layer in front of the text) */}
          <div className="relative w-full aspect-[16/9] z-20 px-4">
            <Image
              src="/images/product_mockup.png"
              alt="Totemood Product Mockup"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        {/* Footer */}
        <div className="w-full px-6 z-30 flex flex-col items-center gap-8 mt-8 border-t border-primary/20 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.15em] font-medium text-primary/90">
            <Link href="/shop" className="hover:text-primary transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-[0.15em] font-medium text-primary/90">
            <a href="https://wa.me/919890842755" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
            <a href="https://instagram.com/totemood_gifts" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-primary/60 mt-4">
            © {new Date().getFullYear()} Totemood. All rights reserved.
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (Scroll Animated) */}
      {/* Sticky container pins to the screen during the 250vh scroll */}
      <div className="hidden md:flex sticky top-0 h-screen w-full overflow-hidden flex-col items-center justify-center">
        {/* Final CTA - Strongest atmospheric treatment */}
        <AmbientGlow
          color="bg-[#757D5C]"
          opacity={0.15}
          position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width="w-[120vw]"
          height="h-[120vw]"
          shape="organic1"
          animationDelay={0}
        />
        <AmbientGlow
          color="bg-[#D9CEB2]"
          opacity={0.2}
          position="bottom-[-20%] left-[-20%]"
          width="w-[80vw]"
          height="h-[80vw]"
          shape="organic2"
          animationDelay={4}
        />
        <AmbientGlow
          color="bg-[#8E9476]"
          opacity={0.15}
          position="top-[-20%] right-[-20%]"
          width="w-[80vw]"
          height="h-[80vw]"
          shape="organic3"
          animationDelay={7}
        />

        {/* Layer 1: Mockup Image (z-20 so it is IN FRONT of the text) */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6"
        >
          <div className="relative w-full max-w-[1400px] aspect-[16/9] lg:aspect-[21/9] mb-20">
            <Image
              src="/images/product_mockup.png"
              alt="Totemood Product Mockup"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </motion.div>

        {/* Layer 2: Massive Text Reveal */}
        <motion.div
          style={{ y: textY, scale: textScale }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none overflow-hidden"
        >
          <h2 className="text-[32vw] font-heading text-primary/15 leading-[0.75] tracking-tighter select-none text-center flex flex-col">
            <span>TOTE</span>
            <span>MOOD</span>
          </h2>
        </motion.div>

        {/* Layer 3: Footer Links */}
        <motion.div
          style={{ opacity: footerOpacity, y: footerY }}
          className="absolute bottom-10 w-full px-12 z-30 flex flex-row justify-between items-center gap-6 border-t border-primary/20 pt-6"
        >
          <div className="flex justify-center gap-8 text-sm uppercase tracking-[0.15em] font-medium text-primary/90">
            <Link href="/shop" className="hover:text-primary transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex gap-8 text-sm uppercase tracking-[0.15em] font-medium text-primary/90">
            <a href="https://wa.me/919890842755" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
            <a href="https://instagram.com/totemood_gifts" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </div>

          <div className="text-xs uppercase tracking-widest text-primary/60">
            © {new Date().getFullYear()} Totemood. All rights reserved.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
