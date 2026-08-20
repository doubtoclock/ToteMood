import React from "react";
import Image from "next/image";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function MadeToCarry() {
  const features = [
    {
      title: "Premium Canvas",
      description:
        "Crafted from ultra-heavyweight cotton canvas, designed for exceptional durability while maintaining a luxuriously soft touch.",
      image: "/images/feature_premium_canvas.png",
      alt: "Detailed texture of heavy cotton canvas",
    },
    {
      title: "From Memory to Illustration",
      description:
        "Upload your favorite memory and watch it transform into a stunning, high-resolution piece of wearable art.",
      image: "/images/feature_photo_art.png",
      alt: "An elegant artist desk drawing a beautiful digital illustration on an iPad Pro",
    },
    {
      title: "Crafted to Last",
      description:
        "Using advanced DTG technology, every tote is printed with vibrant, lasting colors that gracefully follow the fabric's natural weave.",
      image: "/images/feature_printed_care.png",
      alt: "A beautiful canvas tote bag being carefully wrapped in crisp white tissue paper",
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-[140px] bg-[#F8F6EF] overflow-hidden">
      {/* Subtle paper grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
        }}
      />
      {/* Very subtle warm beige/earth glow behind the lifestyle imagery */}
      <AmbientGlow
        color="bg-[#D9CEB2]"
        opacity={0.06}
        position="top-[40%] left-1/2 -translate-x-1/2"
        width="w-[120vw] md:w-[80vw]"
        height="h-[100vw] md:h-[60vw]"
        shape="organic2"
        animationDelay={2}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1A] tracking-tight mb-6">
            Made to Carry Your Story
          </h2>
          <p className="text-lg text-[#5A5A55] max-w-[620px] leading-relaxed">
            Every tote is a canvas for your most cherished moments. We obsess
            over the details—from the weight of the cotton to the vibrancy of
            the ink—so your memories look as beautiful as they feel.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col bg-[#FFFCF6] rounded-[32px] p-6 lg:p-8 transition-all duration-300 ease-out hover:-translate-y-[10px] shadow-[0_4px_20px_-10px_rgba(28,28,26,0.06)] ring-1 ring-inset ring-white/60 hover:shadow-[0_30px_60px_-15px_rgba(28,28,26,0.12)]"
            >
              {/* Illustration Container (~65% visual height, tighter padding) */}
              <div className="relative w-full aspect-square mb-8 overflow-hidden rounded-2xl bg-[#F0EDE4] transition-all duration-300 group-hover:blur-[0.5px]">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-grow justify-end">
                <h3 className="text-xl font-serif text-[#1C1C1A] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[#5A5A55] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
