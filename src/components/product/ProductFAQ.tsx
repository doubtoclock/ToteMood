"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days. Expedited options are available at checkout."
  },
  {
    question: "Can I return a customized tote?",
    answer: "Customized items are made specifically for you and cannot be returned unless there is a manufacturing defect."
  },
  {
    question: "What are the care instructions?",
    answer: "Spot clean with a damp cloth and mild soap. Do not machine wash or tumble dry as it may damage the custom print."
  }
];

export function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h2 className="text-xl md:text-2xl font-sans font-bold text-[#1C1C1A] uppercase tracking-wider mb-8">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col border-t border-[#1C1C1A]/10">
          {FAQS.map((faq, index) => (
            <div key={index} className="border-b border-[#1C1C1A]/10">
              <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-[#1C1C1A] group-hover:text-[#757D5C] transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#1C1C1A] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[#5A5A55] text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
