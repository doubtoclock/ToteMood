"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
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

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[#FAF9F8] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 md:px-8 border-b border-[#E8E5DC]">
              <div className="flex items-baseline gap-3">
                <h2 className="text-[24px] font-title text-[#252A1A]">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="text-[13px] text-[#8C867C] font-medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button 
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 hover:bg-[#E8E5DC]/50 rounded-full transition-colors text-[#252A1A]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#5A5A55] gap-4">
                  <ShoppingBag className="w-10 h-10 text-[#E8E5DC]" strokeWidth={1.5} />
                  <p className="text-[14px]">Your cart is currently empty.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-2 text-[12px] font-bold text-[#252A1A] border-b border-[#252A1A] pb-0.5 hover:text-[#686B59] hover:border-[#686B59] uppercase tracking-widest transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-[92px] h-[92px] rounded-[10px] bg-[#F5F3EC] border border-[#E8E5DC] overflow-hidden shrink-0">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name}
                          fill
                          className="object-cover mix-blend-multiply"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-col flex-1 py-0.5 justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-col">
                            <h3 className="text-[14px] font-medium text-[#252A1A] leading-tight">
                              {item.product.name}
                            </h3>
                            {item.product.label && (
                              <span className="text-[12px] text-[#8C867C] mt-1">
                                {(item.product.label || "new").charAt(0).toUpperCase() + (item.product.label || "new").slice(1)}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[#8C867C] hover:text-[#b06161] transition-colors p-1"
                          >
                            <Trash2 className="w-[14px] h-[14px]" strokeWidth={1.5} />
                          </button>
                        </div>
                        
                        <div className="flex items-end justify-between mt-auto">
                          {/* Quantity Control */}
                          <div className="flex items-center border border-[#E8E5DC] rounded-[8px] h-[34px] bg-white">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label={`Decrease ${item.product.name} quantity`}
                              className="w-8 h-full flex items-center justify-center text-[#252A1A] hover:bg-[#F5F3EC] rounded-l-[8px] transition-colors"
                            >
                              <Minus className="w-[10px] h-[10px]" strokeWidth={2} />
                            </button>
                            <span className="w-6 text-center text-[13px] font-medium text-[#252A1A]">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label={`Increase ${item.product.name} quantity`}
                              className="w-8 h-full flex items-center justify-center text-[#252A1A] hover:bg-[#F5F3EC] rounded-r-[8px] transition-colors"
                            >
                              <Plus className="w-[10px] h-[10px]" strokeWidth={2} />
                            </button>
                          </div>
                          
                          <span className="font-bold text-[14px] text-[#252A1A]">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Checkout Section */}
            {items.length > 0 && (
              <div className="bg-[#FAF9F8] border-t border-[#E8E5DC] px-6 py-6 md:px-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-medium text-[#252A1A]">Subtotal</span>
                  <span className="text-[18px] font-bold text-[#252A1A]">₹{getTotal().toFixed(2)}</span>
                </div>
                
                <p className="text-[12px] text-[#8C867C] mb-5">
                  Shipping and taxes calculated at checkout.
                </p>

                <Link href="/checkout" onClick={closeCart} className="block w-full mb-3">
                  <button className="w-full h-[54px] bg-[#252A1A] text-white rounded-[14px] text-[13px] font-bold uppercase tracking-[0.1em] hover:bg-[#3A3E2F] transition-colors flex items-center justify-center gap-2 group shadow-sm">
                    Proceed to checkout
                    <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </Link>

                <button 
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#8C867C] hover:text-[#252A1A] transition-colors py-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
