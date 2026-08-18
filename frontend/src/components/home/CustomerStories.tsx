"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    text: "The entire setup with Totemood was painless and straightforward. They go the extra mile to reach out to you and make sure you have everything you need.",
    name: "Sarah M.",
    age: "28 y.o.",
    tag: "Positive effect in 2 months",
    image: "/images/feature_photo_art.png",
    bgColor: "bg-[#E6DEC4]",
  },
  {
    id: 2,
    text: "I take this bag everywhere. It somehow makes even ordinary days feel a little more considered. The quality is unmatched.",
    name: "James T.",
    age: "35 y.o.",
    tag: "The Everyday Tote",
    image: "/images/collection_everyday.png",
    bgColor: "bg-[#C4C9B3]",
  },
  {
    id: 3,
    text: "Finally found the perfect balance of form and function. It holds everything without feeling bulky. The materials feel so premium and thoughtful.",
    name: "Chloe P.",
    age: "31 y.o.",
    tag: "The Weekend Carry",
    image: "/images/feature_premium_canvas.png",
    bgColor: "bg-[#D9CEB2]",
  },
  {
    id: 4,
    text: "A beautiful design that only gets better with time. Incredible service and perfect delivery. Exceeded expectations on every level.",
    name: "Elena R.",
    age: "29 y.o.",
    tag: "Verified Buyer",
    image: "/images/collection_weekend.png",
    bgColor: "bg-[#8E9476]",
  },
];

export function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const getCardStyle = (index: number) => {
    if (index === activeIndex) {
      return { zIndex: 10, scale: 1, y: 0, rotate: 0, opacity: 1, x: 0 };
    }

    // Calculate if it's the next or previous card in a circular way
    const isNext = (activeIndex + 1) % REVIEWS.length === index;
    const isPrev =
      (activeIndex - 1 + REVIEWS.length) % REVIEWS.length === index;

    if (isNext) {
      return { zIndex: 5, scale: 0.94, y: 15, rotate: 6, opacity: 0.85, x: 25 };
    }
    if (isPrev) {
      return {
        zIndex: 4,
        scale: 0.92,
        y: -10,
        rotate: -7,
        opacity: 0.75,
        x: -25,
      };
    }

    // Hide others
    return {
      zIndex: 1,
      scale: 0.85,
      y: 0,
      rotate: 0,
      opacity: 0,
      x: 0,
      pointerEvents: "none" as any,
    };
  };

  return (
    <Section id="stories" className="bg-[#EAECE3] py-16 md:py-32 overflow-hidden flex flex-col justify-center relative min-h-[80vh]">
      {/* Ambient background treatment - slightly stronger for the review section */}
      <AmbientGlow
        color="bg-[#C4C9B3]"
        opacity={0.12}
        position="top-1/2 left-[20%] -translate-y-1/2"
        width="w-[120vw] md:w-[80vw]"
        height="h-[120vw] md:h-[80vw]"
        shape="organic1"
        animationDelay={0}
      />
      <AmbientGlow
        color="bg-[#E6DEC4]"
        opacity={0.15}
        position="top-[30%] right-[-10%]"
        width="w-[100vw] md:w-[60vw]"
        height="h-[100vw] md:h-[60vw]"
        shape="organic3"
        animationDelay={3}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8 md:mb-20 px-0 md:px-20">
          <h2 className="text-2xl md:text-3xl font-heading text-primary tracking-tight">
            Customer Stories
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={prevReview}
              className="p-2 hover:bg-black/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5 text-primary stroke-[1.5]" />
            </button>
            <button
              onClick={nextReview}
              className="p-2 hover:bg-black/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5 text-primary stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Card Deck */}
        <div className="relative w-full h-[420px] md:h-[350px] flex justify-center items-center">
          {REVIEWS.map((review, index) => {
            const style = getCardStyle(index);
            return (
              <motion.div
                key={review.id}
                initial={false}
                animate={{
                  zIndex: style.zIndex,
                  scale: style.scale,
                  y: style.y,
                  x: style.x,
                  rotate: style.rotate,
                  opacity: style.opacity,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[90%] md:w-full max-w-[650px] bg-white rounded-[32px] p-6 sm:p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(28,28,26,0.08)] flex flex-col justify-between"
                style={{
                  pointerEvents: index === activeIndex ? "auto" : "none",
                }}
              >
                <p className="text-lg md:text-xl font-sans text-[#1C1C1A] leading-relaxed mb-10 min-h-[100px]">
                  {review.text}
                </p>

                <div className="flex items-center gap-5 mt-auto">
                  {/* Avatar Image */}
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${review.bgColor}`}
                  >
                    {review.image ? (
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="font-heading text-xl text-primary/80">
                        {review.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-[17px] font-medium text-[#1C1C1A]">
                      {review.name}, {review.age}
                    </span>
                    <div className="inline-flex items-center border border-primary/20 rounded-full px-4 py-1.5 bg-white">
                      <span className="text-xs text-primary/70 font-medium">
                        {review.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
