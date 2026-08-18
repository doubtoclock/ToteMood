"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over ₹5,000"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day return policy"
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure checkout"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Dedicated support"
  }
];

// Duplicate the array to allow for seamless infinite scrolling
const MARQUEE_ITEMS = [...VALUE_PROPS, ...VALUE_PROPS, ...VALUE_PROPS, ...VALUE_PROPS];

export function ShopValueProps() {
  return (
    <div className="w-full border-y border-[#1C1C1A]/10 bg-white overflow-hidden py-6 md:py-8 flex items-center relative z-20">
      
      {/* Left/Right Fade Gradients for smooth entrance/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {MARQUEE_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-4 px-12 md:px-20 border-r border-[#1C1C1A]/10 last:border-r-0"
            >
              <div className="text-[#757D5C]">
                <Icon className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-bold text-[#1C1C1A]">{item.title}</span>
                <span className="text-xs md:text-sm text-[#5A5A55]">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
