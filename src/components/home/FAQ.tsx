"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const faqs = [
  {
    question: "What makes Totemood different?",
    answer:
      "Our totes are designed with a meticulous balance of form and function. We prioritize sustainable materials and artisanal craftsmanship, ensuring each piece is as enduring as it is beautiful.",
  },
  {
    question: "How do I choose the right tote?",
    answer:
      "Consider your daily routine. The Everyday Tote is perfect for standard commutes and essentials, while our Panoramic Tote offers extended capacity for weekends or those who simply carry more.",
  },
  {
    question: "What materials are your bags made from?",
    answer:
      "We use premium, sustainably sourced heavy-weight organic cotton canvas, paired with vegetable-tanned leather accents and solid brass hardware designed to develop a rich patina over time.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard domestic shipping typically takes 3–5 business days. Expedited options are available at checkout. International shipping varies by destination but usually arrives within 7–14 days.",
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "Yes, we accept returns and exchanges on unused items in their original packaging within 30 days of delivery. Custom or monogrammed pieces are final sale.",
  },
  {
    question: "How do I care for my tote?",
    answer:
      "Spot clean the canvas with a damp cloth and mild soap. Avoid machine washing or submerging. For the leather straps, a gentle leather conditioner applied twice a year will keep them supple.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="bg-[#FFFCE6] py-16 md:py-32 border-t border-primary/10 relative overflow-hidden">
      {/* FAQ - Keep mostly clean cream. Only use a very subtle background glow near one edge. */}
      <AmbientGlow
        color="bg-[#8E9476]"
        opacity={0.03}
        position="top-0 right-[-10%]"
        width="w-[80vw] md:w-[50vw]"
        height="h-[80vw] md:h-[50vw]"
        shape="organic2"
        animationDelay={2}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left Column: Headings */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-primary/60 mb-6 block">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary leading-[1.1] tracking-tight mb-6">
              Everything you might want to know.
            </h2>
            <p className="text-lg text-primary/80">
              A few answers before you carry it home.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col w-full">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "border-b border-primary/20",
                    index === 0 && "border-t",
                  )}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-8 flex items-center justify-between text-left group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        "text-xl md:text-2xl font-heading transition-colors duration-300 pr-8",
                        isOpen
                          ? "text-primary"
                          : "text-primary/80 group-hover:text-primary",
                      )}
                    >
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-primary/60 transition-transform duration-300">
                      {isOpen ? (
                        <Minus className="w-5 h-5 stroke-[1.5]" />
                      ) : (
                        <Plus className="w-5 h-5 stroke-[1.5]" />
                      )}
                    </span>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      isOpen
                        ? "max-h-[500px] opacity-100 mb-8"
                        : "max-h-0 opacity-0 mb-0",
                    )}
                  >
                    <p className="text-primary/70 text-lg leading-relaxed max-w-2xl pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
