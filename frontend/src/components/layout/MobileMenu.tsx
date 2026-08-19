"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (solid translucent color instead of glassmorphism) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-foreground/20"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-[320px] bg-background px-6 py-6 border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-title text-xl font-bold uppercase tracking-tight text-foreground">
                Totemood
              </span>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="text-foreground/80 hover:text-foreground transition-colors p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col justify-center space-y-10">
              {[
                { name: "Shop", href: "/shop" },
                { name: "Stories", href: "/#stories" },
                { name: "About", href: "/about" }
              ].map((item, i) => {
                const isAnchor = item.href.includes("#");
                const className = "inline-block font-heading text-4xl md:text-5xl font-medium tracking-tight text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className={className}
                      onClick={(e) => {
                        onClose();
                        if (isAnchor && pathname === "/") {
                          e.preventDefault();
                          const id = item.href.split("#")[1];
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            
            <div className="pb-8 flex flex-col space-y-6">
               <div className="h-px w-full bg-border" />
               <div className="flex space-x-6">
                 <Link href="/account" className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                   Account
                 </Link>
                 <Link href="/contact" className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                   Contact
                 </Link>
                 <Link href="/faq" className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                   FAQ
                 </Link>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
