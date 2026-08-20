"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section className="py-20 bg-[#FAF9F8]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[800px]">
        <h2 className="text-[28px] md:text-[36px] font-title text-[#252A1A] tracking-tight mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col border-t border-[#E8E5DC]">
          {FAQS.map((faq, index) => (
            <div key={index} className="border-b border-[#E8E5DC]">
              <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-[16px] font-bold text-[#252A1A] group-hover:text-[#8E9476] transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#8C867C] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="pb-6 text-[#5A5A55] text-[15px] leading-[1.6]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
