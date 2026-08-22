"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

const collections = [
  {
    id: "everyday",
    title: "Everyday Mood",
    image: "/images/collection_everyday.png",
    aspect: "aspect-[16/9] lg:aspect-[3/1]",
  },
  {
    id: "weekend",
    title: "Weekend Escape",
    image: "/images/collection_weekend.png",
    aspect: "aspect-[4/5] lg:aspect-[3/4]",
  },
  {
    id: "creative",
    title: "Creative Corner",
    image: "/images/collection_creative.png",
    aspect: "aspect-[4/5] lg:aspect-[3/4]",
  },
];

export function CuratedCollections() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: custom * 0.1 },
    }),
  };

  return (
    <section className="bg-white py-16 md:py-[160px] w-full">
      <Container>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-20 md:mb-32"
        >
          <span className="block text-[11px] font-medium tracking-[0.2em] uppercase text-foreground/60 mb-8">
            Collections
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-foreground mb-6">
            Curated for Every Mood.
          </h2>
          <p className="text-lg text-foreground/70 font-sans max-w-[480px]">
            Explore thoughtfully curated collections designed for different moments, routines, and personalities.
          </p>
        </motion.div>

        {/* Masonry Layout */}
        <div className="flex flex-col gap-12 md:gap-32">
          
          {/* 1. Everyday Mood (Large Landscape) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={itemVariants}
          >
            <Link href="/shop" className="group flex flex-col gap-6 md:gap-8">
              <div className={`relative w-full overflow-hidden rounded-[16px] ${collections[0].aspect}`}>
                <Image
                  src={collections[0].image}
                  alt={collections[0].title}
                  fill
                  className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
                  sizes="100vw"
                />
              </div>
              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-4 transition-transform duration-[350ms] ease-out group-hover:-translate-y-[6px]">
                  <h3 className="font-heading text-3xl md:text-4xl lg:text-[40px] text-foreground">
                    {collections[0].title}
                  </h3>
                  <ArrowRight strokeWidth={1.5} className="w-6 h-6 text-foreground opacity-0 -translate-x-4 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 2. Asymmetrical Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24">
            
            {/* Left Card - Wider and aligned to top */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={2}
              variants={itemVariants}
              className="lg:col-span-7"
            >
              <Link href={`/shop`} className="group flex flex-col gap-6 md:gap-8">
                <div className={`relative w-full overflow-hidden rounded-[16px] ${collections[1].aspect}`}>
                  <Image
                    src={collections[1].image}
                    alt={collections[1].title}
                    fill
                    className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 transition-transform duration-[350ms] ease-out group-hover:-translate-y-[6px]">
                    <h3 className="font-heading text-3xl lg:text-[36px] text-foreground">
                      {collections[1].title}
                    </h3>
                    <ArrowRight strokeWidth={1.5} className="w-5 h-5 text-foreground opacity-0 -translate-x-4 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Right Card - Narrower and staggered downward */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={3}
              variants={itemVariants}
              className="lg:col-span-5 lg:mt-40"
            >
              <Link href={`/shop`} className="group flex flex-col gap-6 md:gap-8">
                <div className={`relative w-full overflow-hidden rounded-[16px] aspect-[4/5] lg:aspect-[3/4]`}>
                  <Image
                    src={collections[2].image}
                    alt={collections[2].title}
                    fill
                    className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 transition-transform duration-[350ms] ease-out group-hover:-translate-y-[6px]">
                    <h3 className="font-heading text-3xl lg:text-[36px] text-foreground">
                      {collections[2].title}
                    </h3>
                    <ArrowRight strokeWidth={1.5} className="w-5 h-5 text-foreground opacity-0 -translate-x-4 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* 3. Wide Panoramic Editorial Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={4}
            variants={itemVariants}
            className="w-full pt-10"
          >
            <div className="relative w-full overflow-hidden rounded-[16px] aspect-[16/9] md:aspect-[3/1]">
              <Image
                src="/images/collection_panoramic.png"
                alt="A premium Totemood tote resting naturally in a sunlit European cafe interior"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
