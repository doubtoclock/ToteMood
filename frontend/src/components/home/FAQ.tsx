"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const faqs = [
  {
    question: "How long will it take to share the design with the customer?",
    answer:
      "The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.",
  },
  {
    question: "Will I get to see the design before it is printed?",
    answer:
      "Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.",
  },
  {
    question: "Why don't you offer full Cash on Delivery?",
    answer:
      "Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.",
  },
  {
    question: "Why do I need to pay ₹50 while placing the order?",
    answer:
      "We take a ₹50 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.",
  },
  {
    question: "Is there any return policy?",
    answer:
      "Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).",
  },
  {
    question: "What if I want changes in the design?",
    answer:
      "No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Once your design is approved, your order is printed and delivered within 4-6 working days.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" className="bg-[#FFFCE6] py-16 md:py-32 border-t border-primary/10 relative overflow-hidden">
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
                    className="w-full py-5 flex items-center justify-between text-left group focus:outline-none"
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
                        ? "max-h-[500px] opacity-100 mb-5"
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
