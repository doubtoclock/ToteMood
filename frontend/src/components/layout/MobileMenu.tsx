"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getStoredAccountProfile, clearStoredAccountProfile, type AccountProfile } from "@/lib/account";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<AccountProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const stored = getStoredAccountProfile();
      setProfile(stored.email ? stored : null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    clearStoredAccountProfile();
    setProfile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-foreground/20"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-[320px] bg-background px-6 py-6 border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-script text-2xl tracking-tight text-foreground">
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
                { name: "Home", href: "/" },
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
               {profile ? (
                 <div className="flex items-center gap-3">
                   <Link href="/account" className="flex items-center gap-2 font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                     {profile.picture ? (
                       <div className="w-5 h-5 rounded-full overflow-hidden bg-[#F5F3EC]">
                         <Image src={profile.picture} alt="Account" width={20} height={20} className="w-full h-full object-cover" unoptimized />
                       </div>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                     )}
                     Account
                   </Link>
                   <button
                     onClick={handleLogout}
                     className="flex items-center gap-1.5 font-sans text-sm font-medium text-[#b06161] hover:text-[#252A1A] transition-colors"
                   >
                     <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                     Sign out
                   </button>
                 </div>
               ) : (
                 <Link href="/account" className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                   Sign in
                 </Link>
               )}
               <div className="flex space-x-6">
                 <Link href="/contact" className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onClose}>
                   Contact
                 </Link>
                 <Link 
                   href="/#faq" 
                   className="font-sans text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                   onClick={(e) => {
                     onClose();
                     if (window.location.pathname === "/") {
                       e.preventDefault();
                       document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                     }
                   }}
                 >
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
