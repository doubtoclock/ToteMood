"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
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
              className="font-title text-lg font-bold tracking-tight text-primary uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              Totemood
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center space-x-10 lg:space-x-14">
            {[
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
            <button 
              aria-label="Search" 
              className="text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <Link 
              href="/account"
              aria-label="Account" 
              className={`hidden md:block relative transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1 ${pathname?.startsWith("/account") ? "text-primary border-b-[1.5px] border-primary" : "text-primary hover:text-primary/70"}`}
            >
              <User className="h-4 w-4" strokeWidth={pathname?.startsWith("/account") ? 2 : 1.5} />
            </Link>
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
              className="md:hidden ml-2 text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
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
