"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { useProducts } from "@/lib/useProducts";

export function FeaturedCollection() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="relative w-full py-24 lg:py-32 bg-[#EBE7DF] overflow-hidden">
      {/* Subtle Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
        }}
      />

      {/* Collections - One or two very subtle warm atmospheric shapes behind the collection imagery */}
      <AmbientGlow
        color="bg-[#D9CEB2]"
        opacity={0.06}
        position="top-[20%] right-[-10%]"
        width="w-[100vw] md:w-[60vw]"
        height="h-[100vw] md:h-[60vw]"
        shape="organic1"
        animationDelay={1}
      />
      <AmbientGlow
        color="bg-[#8E9476]"
        opacity={0.04}
        position="bottom-[-10%] left-[-10%]"
        width="w-[100vw] md:w-[60vw]"
        height="h-[100vw] md:h-[60vw]"
        shape="organic2"
        animationDelay={6}
      />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div className="max-w-[600px]">
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-[#1C1C1A] leading-[1.05] tracking-tight mb-6">
              Carry a little something with you.
            </h2>
            <p className="text-lg text-[#5A5A55]">
              Let's customize your tote bag with your personalized image and text.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center text-sm font-medium tracking-wide uppercase text-[#1C1C1A] hover:text-[#5A5A55] transition-colors pb-2"
          >
            Shop Collection
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* Product Grid / Carousel */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 pb-12 md:pb-0">
          {featuredProducts.map((product) => (
            <Link href={`/shop/${product.id}`} key={product.id}>
              <motion.div
                className="group cursor-pointer flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-auto snap-center flex flex-col h-full"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                {/* Product Image Wrapper */}
                <motion.div
                  className="relative aspect-[4/5] w-full mb-8 bg-transparent"
                  variants={{
                    rest: {
                      y: 0,
                      scale: 1,
                      rotate: 0,
                    },
                    hover: {
                      y: -10,
                      scale: 1.03,
                      rotate: 1.5,
                      transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                    },
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="(max-width: 768px) 75vw, (max-width: 1024px) 25vw, 300px"
                  />
                </motion.div>

                {/* Product Info */}
                <div className="flex flex-col items-center text-center mt-auto">
                  <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8C867C] mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif text-[#1C1C1A] mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-[#1C1C1A] flex items-center gap-2">
                    {product.oldPrice && (
                      <span className="text-xs text-[#8C867C] line-through">₹{product.oldPrice.toFixed(2)}</span>
                    )}
                    <span>₹{product.price.toFixed(2)}</span>
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </section>
  );
}
