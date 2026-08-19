"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import Image from "next/image";
import { PlayCircle, X } from "lucide-react";

type Story = {
  id: number;
  type: "image" | "video";
  src: string;
};

// Auto-generate array for images 1.png to 27.png
const STORIES: Story[] = Array.from({ length: 27 }).map((_, i) => ({
  id: i + 1,
  type: "image",
  src: `/review/${i + 1}.png`,
}));

// Split into 4 columns
const col1 = STORIES.filter((_, i) => i % 4 === 0);
const col2 = STORIES.filter((_, i) => i % 4 === 1);
const col3 = STORIES.filter((_, i) => i % 4 === 2);
const col4 = STORIES.filter((_, i) => i % 4 === 3);

export function CustomerStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStory]);

  return (
    <Section id="stories" className="bg-[#EAECE3] py-20 md:py-32 overflow-hidden relative">
      <AmbientGlow 
        color="bg-[#C4C9B3]" 
        opacity={0.3} 
        position="top-[10%] left-[20%]" 
        width="w-[60vw]" 
        height="h-[60vw]" 
      />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-[#1C1C1A] leading-[1.1] tracking-tight mb-4">
              Real Stories.
              <br />
              <span className="text-[#8E9476] italic">Real People.</span>
            </h2>
            <p className="text-[#5A5A55] text-lg">
              See what our community is saying about their Totemood experience.
            </p>
          </div>
        </div>

        {/* Infinite Marquee Columns */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 h-[60vh] md:h-[80vh]"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)" }}
        >
          {/* Column 1 - Scrolls Up */}
          <MarqueeColumn items={col1} duration={75} direction="up" setSelectedStory={setSelectedStory} />
          
          {/* Column 2 - Scrolls Down */}
          <MarqueeColumn items={col2} duration={90} direction="down" setSelectedStory={setSelectedStory} />
          
          {/* Column 3 - Scrolls Up (Hidden on very small mobile) */}
          <div className="hidden sm:block h-full">
            <MarqueeColumn items={col3} duration={85} direction="up" setSelectedStory={setSelectedStory} />
          </div>

          {/* Column 4 - Scrolls Down (Hidden on tablets/mobile) */}
          <div className="hidden lg:block h-full">
            <MarqueeColumn items={col4} duration={100} direction="down" setSelectedStory={setSelectedStory} />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1C1A]/90 backdrop-blur-md p-4 sm:p-8"
          >
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-white/70 hover:text-white bg-white/10 rounded-full backdrop-blur-md transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-transparent rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center justify-center shadow-2xl"
            >
              {selectedStory.type === "image" && (
                <div className="relative w-full h-full max-h-[85vh] flex justify-center">
                  <img 
                    src={selectedStory.src} 
                    alt="Customer Review" 
                    className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl"
                  />
                </div>
              )}
              
              {selectedStory.type === "video" && (
                <div className="relative w-full h-full max-h-[85vh] flex justify-center bg-black rounded-xl overflow-hidden">
                  <video 
                    src={selectedStory.src} 
                    className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
                    controls autoPlay playsInline
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

// Reusable Marquee Column Component
function MarqueeColumn({ 
  items, 
  duration, 
  direction, 
  setSelectedStory 
}: { 
  items: Story[]; 
  duration: number; 
  direction: "up" | "down";
  setSelectedStory: (story: Story) => void;
}) {
  const content = (
    <div className="flex flex-col gap-4 md:gap-6 py-2 md:py-3">
      {items.map(story => (
        <div 
          key={story.id} 
          className="relative bg-white rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all group"
          onClick={() => setSelectedStory(story)}
        >
          {story.type === "image" && (
            <Image 
              src={story.src} 
              alt="Customer Review" 
              width={600} 
              height={1000} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          )}
          {story.type === "video" && (
            <div className="relative w-full aspect-[4/5] bg-gray-900 flex items-center justify-center">
              <video 
                src={story.src} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loop muted playsInline
              />
              <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all z-10" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col relative w-full">
      <motion.div
        animate={{ y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ ease: "linear", duration, repeat: Infinity }}
        className="flex flex-col w-full absolute top-0 left-0"
        style={{ height: "fit-content" }}
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
}
