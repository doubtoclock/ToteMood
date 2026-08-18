"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotal 
  } = useCartStore();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-[#F8F6EF] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1C1C1A]/10">
              <h2 className="text-xl font-serif text-[#1C1C1A]">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-[#EAECE3] rounded-full transition-colors text-[#1C1C1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#5A5A55] gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is currently empty.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 px-6 py-2 border border-[#1C1C1A]/20 rounded-full text-sm font-medium hover:bg-[#1C1C1A] hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-[#1C1C1A]/5 shadow-sm">
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-xl bg-[#EAECE3] overflow-hidden shrink-0">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        fill
                        className="object-cover mix-blend-multiply"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-[#1C1C1A] leading-tight pr-2">
                          {item.product.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#8C867C] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#5A5A55] mb-2">{item.product.category}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-[#1C1C1A]/10 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-l-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-[#1C1C1A]">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-r-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <span className="font-bold text-[#1C1C1A]">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-[#1C1C1A]/10 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base text-[#5A5A55]">Subtotal</span>
                  <span className="text-xl font-bold text-[#1C1C1A]">₹{getTotal().toFixed(2)}</span>
                </div>
                
                <p className="text-xs text-[#8C867C] text-center mb-4">
                  Shipping and taxes calculated at checkout.
                </p>

                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <button className="w-full h-14 bg-[#757D5C] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#5C6348] transition-colors shadow-md flex items-center justify-center">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
