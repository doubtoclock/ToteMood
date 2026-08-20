import { Section } from "@/components/layout/Section";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <Section className="bg-primary text-[#FFFCE6] py-20 md:py-40 flex flex-col relative overflow-hidden">
      {/* Editorial Text Composition */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 flex flex-col items-center text-center">
        <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.25em] text-[#FFFCE6]/70 mb-8 block">
          Keep Carrying
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-heading leading-[1.05] tracking-tight mb-8 max-w-4xl mx-auto">
          Carry a little something with you.
        </h2>

        <p className="text-lg md:text-xl text-[#FFFCE6]/80 max-w-md mx-auto mb-14 leading-relaxed">
          Find the tote that fits your everyday moments.
        </p>

        <Link
          href="/shop"
          className="inline-flex items-center gap-4 bg-[#FFFCE6] text-primary font-medium uppercase tracking-[0.15em] text-xs px-10 py-5 hover:bg-white hover:scale-[1.02] transition-all duration-300 group"
        >
          Shop Collection
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Section>
  );
}
