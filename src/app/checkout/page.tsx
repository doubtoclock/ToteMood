"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import Image from "next/image";
import Link from "next/link";
import { Upload, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotal, setCustomImage, clearCart } = useCartStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeUpload, setActiveUpload] = useState<{ id: string; index: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(activeUpload.id, activeUpload.index, reader.result as string);
        setActiveUpload(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F8F6EF] pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.2} position="top-[10%] left-[20%]" shape="organic1" />
        
        <div className="bg-white p-10 md:p-16 rounded-[32px] shadow-lg max-w-lg w-full relative z-10 border border-[#1C1C1A]/10">
          <CheckCircle2 className="w-20 h-20 text-[#757D5C] mx-auto mb-6" />
          <h1 className="text-3xl font-serif text-[#1C1C1A] mb-4">Order Confirmed</h1>
          <p className="text-[#5A5A55] mb-8">
            Thank you for your purchase! We've received your order and will begin processing it right away.
          </p>
          <Link href="/shop" className="inline-block bg-[#1C1C1A] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F6EF] pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-serif text-[#1C1C1A] mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="inline-block bg-[#1C1C1A] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors">
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] pt-24 md:pt-32 pb-24 relative">
      <AmbientGlow color="bg-[#C4C9B3]" opacity={0.1} position="top-[0%] right-[0%]" shape="organic2" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        <Link href="/shop" className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-[#5A5A55] hover:text-[#1C1C1A] transition-colors mb-8 md:mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1C1A] mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleCheckout} className="flex flex-col gap-10">
              
              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-serif text-[#1C1C1A] mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1A] text-white text-sm">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input type="email" placeholder="Email Address" required className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C] focus:ring-1 focus:ring-[#757D5C] transition-all" />
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="newsletter" className="accent-[#757D5C]" defaultChecked />
                    <label htmlFor="newsletter" className="text-sm text-[#5A5A55]">Email me with news and offers</label>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-serif text-[#1C1C1A] mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1A] text-white text-sm">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" required className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                  <input type="text" placeholder="Last Name" required className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                  <input type="text" placeholder="Address" required className="w-full sm:col-span-2 bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                  <input type="text" placeholder="City" required className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="State" required className="w-1/2 bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                    <input type="text" placeholder="ZIP" required className="w-1/2 bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]" />
                  </div>
                </div>
              </section>

              {/* Payment Mock */}
              <section>
                <h2 className="text-xl font-serif text-[#1C1C1A] mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1A] text-white text-sm">3</span>
                  Payment
                </h2>
                <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/20">
                  <p className="text-sm text-[#5A5A55] mb-4">All transactions are secure and encrypted.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Card Number (Mock)" required className="w-full bg-[#F8F6EF] border border-[#1C1C1A]/10 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none" />
                    <div className="flex gap-4">
                      <input type="text" placeholder="MM/YY" required className="w-1/2 bg-[#F8F6EF] border border-[#1C1C1A]/10 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none" />
                      <input type="text" placeholder="CVC" required className="w-1/2 bg-[#F8F6EF] border border-[#1C1C1A]/10 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-[#757D5C] text-white py-5 rounded-full font-bold uppercase tracking-[0.1em] text-lg hover:bg-[#5C6348] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#1C1C1A]/10 sticky top-32">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-6 mb-8">
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl bg-[#EAECE3] overflow-hidden shrink-0 border border-[#1C1C1A]/5">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover mix-blend-multiply" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#1C1C1A] text-white text-xs flex items-center justify-center rounded-full z-10 border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 justify-center">
                        <h3 className="text-sm font-bold text-[#1C1C1A]">{item.product.name}</h3>
                        <p className="text-xs text-[#5A5A55] mb-2">{item.product.category}</p>
                        <span className="font-bold text-[#1C1C1A]">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Image Upload for Customizable Products */}
                    {item.product.isCustomizable && (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: item.quantity }).map((_, idx) => {
                          const uploadedImage = item.customImages?.[idx];
                          return (
                            <div key={idx} className="bg-[#F8F6EF] rounded-xl p-4 border border-dashed border-[#1C1C1A]/20">
                              {uploadedImage ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md overflow-hidden relative border border-[#1C1C1A]/10">
                                      <Image src={uploadedImage} alt="Uploaded" fill className="object-cover" />
                                    </div>
                                    <span className="text-xs font-medium text-[#757D5C] flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> Image {item.quantity > 1 ? idx + 1 : ''} Uploaded
                                    </span>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setActiveUpload({ id: item.product.id, index: idx });
                                      fileInputRef.current?.click();
                                    }}
                                    className="text-xs font-bold uppercase tracking-wider text-[#1C1C1A] hover:underline"
                                  >
                                    Change
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveUpload({ id: item.product.id, index: idx });
                                    fileInputRef.current?.click();
                                  }}
                                  className="w-full py-4 border-2 border-dashed border-[#1C1C1A]/30 rounded-lg flex flex-col items-center justify-center gap-2 text-[#5A5A55] hover:border-[#757D5C] hover:text-[#757D5C] transition-colors bg-white"
                                >
                                  <Upload className="w-5 h-5" />
                                  <span className="text-xs font-bold uppercase tracking-widest">
                                    Upload Custom Image {item.quantity > 1 ? idx + 1 : ''}
                                  </span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="flex flex-col gap-3 pt-6 border-t border-[#1C1C1A]/10">
                <div className="flex justify-between text-[#5A5A55] text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5A5A55] text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#1C1C1A] mt-4 pt-4 border-t border-[#1C1C1A]/10">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
