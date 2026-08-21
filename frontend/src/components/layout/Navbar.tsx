"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getStoredAccountProfile, clearStoredAccountProfile, type AccountProfile } from "@/lib/account";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const { toggleCart, getItemCount } = useCartStore();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    const stored = getStoredAccountProfile();
    setProfile(stored.email ? stored : null);
    const onStorage = () => {
      const updated = getStoredAccountProfile();
      setProfile(updated.email ? updated : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleLogout = () => {
    clearStoredAccountProfile();
    setProfile(null);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.header
        className={`sticky left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? "top-4 px-4" : "top-0"
        }`}
      >
        <div 
          className={`w-full max-w-7xl transition-all duration-500 flex items-center justify-between ${
            isScrolled
              ? "bg-[#FAF9F8]/90 backdrop-blur-md border border-[#E8E5DC] rounded-full shadow-sm py-2 px-4 md:py-3 md:px-8"
              : "bg-transparent border-transparent py-4 px-4 md:py-5 md:px-6 lg:px-8"
          }`}
        >
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link 
              href="/" 
              className="font-script text-3xl md:text-4xl tracking-tight text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              Totemood
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center space-x-10 lg:space-x-14">
            {[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/shop" },
              { name: "Stories", href: "/#stories" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" }
            ].map((item) => {
              const isAnchor = item.href.includes("#");
              const className = "font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm px-2 py-1";
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={className}
                  onClick={(e) => {
                    if (isAnchor && pathname === "/") {
                      e.preventDefault();
                      const id = item.href.split("#")[1];
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center space-x-5 lg:space-x-6">
            {/* Account / Login */}
            {profile ? (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  href="/account"
                  aria-label="Account" 
                  className={`relative transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1 ${pathname?.startsWith("/account") ? "border-b-[1.5px] border-primary" : "hover:opacity-70"}`}
                >
                  {profile.picture ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-[#F5F3EC]">
                      <Image src={profile.picture} alt="Account" width={20} height={20} className="w-full h-full object-cover" unoptimized />
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={pathname?.startsWith("/account") ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="text-[#8C867C] hover:text-[#252A1A] transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link 
                href="/account"
                className="hidden md:block font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm px-2 py-1"
              >
                Sign in
              </Link>
            )}

            <button 
              aria-label="Cart" 
              onClick={toggleCart}
              className="relative text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1C1C1A] text-[8px] font-medium text-white">
                  {getItemCount()}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              aria-label="Open menu"
              className="md:hidden ml-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1"
              style={{ color: '#B55E5B' }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart Drawer Overlay */}
      <CartDrawer />
    </>
  );
}
