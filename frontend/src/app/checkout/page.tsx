"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import Image from "next/image";
import Link from "next/link";
import { Upload, CheckCircle2, ArrowLeft, Loader2, AlertCircle, X } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

declare global {
  interface Window {
    gokwikSdk?: {
      initCheckout: (config: any) => void;
      on: (event: string, callback: (data?: any) => void) => void;
      close: () => void;
    };
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const GOKWIK_MERCHANT_ID = process.env.NEXT_PUBLIC_GOKWIK_MERCHANT_ID || "";
const GOKWIK_ENV = process.env.NEXT_PUBLIC_GOKWIK_ENV || "sandbox";

const GOKWIK_SDK_URLS: Record<string, string> = {
  dev: "https://dev.pdp.gokwik.co/v4/build/gokwik.js",
  qa: "https://qa.pdp.gokwik.co/v4/build/gokwik.js",
  sandbox: "https://sandbox.pdp.gokwik.co/v4/build/gokwik.js",
  production: "https://pdp.gokwik.co/v4/build/gokwik.js",
};

function loadGoKwikSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.gokwikSdk) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      `script[src*="pdp.gokwik.co"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("GoKwik SDK load failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = GOKWIK_SDK_URLS[GOKWIK_ENV] || GOKWIK_SDK_URLS.sandbox;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GoKwik SDK load failed"));
    document.head.appendChild(script);
  });
}

function dismissGoKwikOverlay() {
  // Force-close any GoKwik overlay/modal that may be stuck
  const overlays = document.querySelectorAll(
    '[id*="gokwik"], [class*="gokwik"], [data-gokwik], iframe[src*="gokwik"]'
  );
  overlays.forEach((el) => el.remove());

  // Also try removing any full-screen overlays GoKwik may have injected
  document.querySelectorAll("div").forEach((el) => {
    const style = window.getComputedStyle(el);
    if (
      style.position === "fixed" &&
      parseInt(style.zIndex, 10) > 999 &&
      el.querySelector('[class*="gokwik"], [id*="gokwik"]')
    ) {
      el.remove();
    }
  });
}

function forceCloseGoKwik() {
  try {
    if (window.gokwikSdk && typeof window.gokwikSdk.close === "function") {
      window.gokwikSdk.close();
    }
  } catch (_) {
    // ignore
  }
  dismissGoKwikOverlay();
}

export default function CheckoutPage() {
  const { items, getTotal, setCustomImage, clearCart } = useCartStore();

  const [activeUpload, setActiveUpload] = useState<{ id: string; index: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkoutInitiated = useRef(false);
  const retryCount = useRef(0);

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

  const dismissAndReset = useCallback(() => {
    forceCloseGoKwik();
    setIsProcessing(false);
    checkoutInitiated.current = false;
  }, []);

  // Auto-detect stuck GoKwik overlay after 15 seconds
  const stuckTimeout = useRef<NodeJS.Timeout | null>(null);

  const startStuckTimer = useCallback(() => {
    stuckTimeout.current = setTimeout(() => {
      if (checkoutInitiated.current && isProcessing) {
        setSdkError(
          "GoKwik checkout appears to be stuck. This usually means GoKwik servers cannot reach your backend."
        );
      }
    }, 15000);
  }, [isProcessing]);

  const clearStuckTimer = useCallback(() => {
    if (stuckTimeout.current) {
      clearTimeout(stuckTimeout.current);
      stuckTimeout.current = null;
    }
  }, []);

  const initializeGoKwikCheckout = useCallback(async () => {
    if (checkoutInitiated.current) return;
    checkoutInitiated.current = true;
    retryCount.current++;

    try {
      setSdkError(null);
      setIsProcessing(true);
      startStuckTimer();

      // 1. Load GoKwik SDK
      await loadGoKwikSDK();

      if (!window.gokwikSdk) {
        throw new Error("GoKwik SDK failed to load. Check your internet connection.");
      }

      // 2. Create checkout session on our backend
      const sessionRes = await fetch(`${API_URL}/api/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.image,
            customImageUrl: item.customImages?.[0] || null,
          })),
          subtotal,
          shipping,
          total,
        }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create checkout session. Is the backend running?");
      }

      const sessionData = await sessionRes.json();
      const sessionId = sessionData.sessionId;

      // 3. Listen for GoKwik SDK events
      window.gokwikSdk.on("order-complete", (order: any) => {
        console.log("GoKwik order-complete:", order);
        clearStuckTimer();
        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
      });

      window.gokwikSdk.on("checkout-close", () => {
        console.log("GoKwik checkout closed by user");
        clearStuckTimer();
        setIsProcessing(false);
        checkoutInitiated.current = false;
      });

      window.gokwikSdk.on("checkout-initiation-failure", (error: any) => {
        console.error("GoKwik checkout initiation failed:", error);
        clearStuckTimer();
        forceCloseGoKwik();
        setSdkError(
          "GoKwik could not connect to our server. " +
          "Make sure your backend is publicly accessible (GoKwik servers need to reach it)."
        );
        setIsProcessing(false);
        checkoutInitiated.current = false;
      });

      window.gokwikSdk.on("payment-failure", (error: any) => {
        console.error("GoKwik payment failure:", error);
        clearStuckTimer();
        setSdkError("Payment failed. Please try again.");
        setIsProcessing(false);
        checkoutInitiated.current = false;
      });

      // 4. Initialize GoKwik checkout
      window.gokwikSdk.initCheckout({
        environment: GOKWIK_ENV,
        type: "merchantInfo",
        mid: GOKWIK_MERCHANT_ID,
        merchantParams: {
          merchantCheckoutId: sessionId,
        },
      });
    } catch (error) {
      console.error("GoKwik checkout error:", error);
      clearStuckTimer();
      setSdkError(
        error instanceof Error
          ? error.message
          : "Failed to initialize checkout. Please try again."
      );
      setIsProcessing(false);
      checkoutInitiated.current = false;
    }
  }, [items, subtotal, shipping, total, clearCart, startStuckTimer, clearStuckTimer]);

  // Cleanup on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanup = useCallback(() => {
    clearStuckTimer();
    if (window.gokwikSdk) {
      forceCloseGoKwik();
    }
  }, [clearStuckTimer]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F8F6EF] pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.2} position="top-[10%] left-[20%]" shape="organic1" />
        
        <div className="bg-white p-10 md:p-16 rounded-[32px] shadow-lg max-w-lg w-full relative z-10 border border-[#1C1C1A]/10">
          <CheckCircle2 className="w-20 h-20 text-[#757D5C] mx-auto mb-6" />
          <h1 className="text-3xl font-serif text-[#1C1C1A] mb-4">Order Confirmed</h1>
          <p className="text-[#5A5A55] mb-8">
            Thank you for your purchase! We&apos;ve received your order and will begin processing it right away.
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

      {/* Floating dismiss button — appears when GoKwik overlay is stuck */}
      {isProcessing && (
        <button
          type="button"
          onClick={dismissAndReset}
          className="fixed top-6 right-6 z-[9999] bg-[#1C1C1A] text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-black transition-colors"
          title="Close GoKwik checkout"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        <Link href="/shop" className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-[#5A5A55] hover:text-[#1C1C1A] transition-colors mb-8 md:mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1C1A] mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: GoKwik Checkout */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white p-8 rounded-[32px] border border-[#1C1C1A]/10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F8F6EF] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#757D5C]" />
              </div>
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-4">Express Checkout</h2>
              <p className="text-[#5A5A55] mb-8 max-w-md">
                We use GoKwik for a faster, more secure checkout experience. Your address and contact details will be automatically filled using KwikPass.
              </p>

              {sdkError && (
                <div className="w-full sm:w-3/4 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-3 text-sm text-red-700">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold mb-1">Checkout Error</p>
                      <p>{sdkError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSdkError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dismissAndReset();
                      setTimeout(() => initializeGoKwikCheckout(), 100);
                    }}
                    className="self-center px-6 py-2 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              <button 
                type="button"
                onClick={() => {
                  dismissAndReset();
                  clearStuckTimer();
                  setTimeout(() => initializeGoKwikCheckout(), 50);
                }}
                disabled={isProcessing}
                className="w-full sm:w-3/4 bg-[#757D5C] text-white py-5 rounded-full font-bold uppercase tracking-[0.1em] text-lg hover:bg-[#5C6348] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
              >
                {isProcessing && (
                  <div className="absolute inset-0 bg-[#5C6348] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
                Checkout with GoKwik
              </button>
            </div>
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
