"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import Image from "next/image";
import Link from "next/link";
import { Upload, CheckCircle2, ArrowLeft, Loader2, Lock, Check } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { loadGoogleIdentity, renderGoogleSignInButton } from "@/lib/googleSignIn";
import { useProducts } from "@/lib/useProducts";
import { SavedAddress, AccountSession, accountAuthHeaders, getStoredAccountProfile } from "@/lib/account";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { compressImageForUpload } from "@/lib/imageCompression";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const DEPOSIT_AMOUNT = 49;
const VERIFY_RETRY_DELAYS_MS = [1000, 2000];
const CONFIRMING_ORDER_MIN_MS = 1800;
const PAYMENT_SETUP_TIMEOUT_MS = 20000;
const requiresImage = (category: string) => category === "image" || category === "image+text";
const requiresText = (category: string) => category === "image+text";

const SERVER_FIELD_TO_FORM_FIELD: Record<string, string> = {
  customerEmail: "email",
  customerPhone: "phone",
  customerFirstName: "firstName",
  customerLastName: "lastName",
  customerAddress: "address",
  customerCity: "city",
  customerState: "state",
  customerZip: "zip",
};

function mapServerFieldErrors(details: Record<string, string>) {
  const mapped: Record<string, string> = {};
  for (const [key, message] of Object.entries(details || {})) {
    const formKey = SERVER_FIELD_TO_FORM_FIELD[key] || key;
    if (!mapped[formKey]) mapped[formKey] = message;
  }
  return mapped;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const wait = (delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs));


const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const emptyCheckoutForm = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  addressNickname: "Other",
};

export default function CheckoutPage() {
  const { items, getTotal, setCustomImage, setCustomText, clearCart, syncProducts } = useCartStore();
  const { products: liveProducts } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeUpload, setActiveUpload] = useState<{ id: string; index: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const accountToken = useAuthStore((state) => state.token);
  const signIn = useAuthStore((state) => state.signIn);
  const accountEmail = useAuthStore((state) => state.profile.email);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("other");
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "prepaid">("cod");
  const [googleButtonNode, setGoogleButtonNode] = useState<HTMLDivElement | null>(null);
  const [formValues, setFormValues] = useState(() => {
    const profile = getStoredAccountProfile();
    return {
      ...emptyCheckoutForm,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    };
  });

  const subtotal = getTotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;
  const codBalance = Math.max(0, total - DEPOSIT_AMOUNT);

  useEffect(() => {
    syncProducts(liveProducts);
  }, [liveProducts, syncProducts]);

  // Google sign-in for checkout
  const handleGoogleCredential = useCallback(async (credential: string) => {
    try {
      const session = await apiFetch<AccountSession>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
      signIn(session);
      setAuthMessage("Successfully logged in.");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setAuthMessage(error instanceof Error ? error.message : "Google sign-in failed.");
    }
  }, [signIn]);

  useEffect(() => {
    if (!authMessage) return;
    const timer = window.setTimeout(() => setAuthMessage(""), 3500);
    return () => window.clearTimeout(timer);
  }, [authMessage]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || accountToken || !googleButtonNode) return;

    let cancelled = false;
    loadGoogleIdentity().then((googleId) => {
      if (cancelled || !googleId || !googleButtonNode.isConnected) return;
      renderGoogleSignInButton(googleButtonNode, GOOGLE_CLIENT_ID, handleGoogleCredential);
    });

    return () => {
      cancelled = true;
    };
  }, [googleButtonNode, accountToken, handleGoogleCredential]);

  const setFormValue = (key: keyof typeof emptyCheckoutForm, value: string) => {
    setSelectedAddressId("other");
    setFormValues((current) => ({
      ...current,
      [key]: value,
      addressNickname: key === "addressNickname" ? value : current.addressNickname,
    }));
  };

  const applySavedAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setSaveAddress(false);
    setFormValues({
      email: address.email,
      phone: address.phone,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      addressNickname: address.nickname,
    });
  };

  useEffect(() => {
    if (!accountToken) return;
    apiFetch<SavedAddress[]>("/api/account/addresses", { headers: accountAuthHeaders() })
      .then((addresses) => {
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
        if (defaultAddress) {
          applySavedAddress(defaultAddress);
        }
      })
      .catch(() => {
        setSavedAddresses([]);
      });
  }, [accountToken]);

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true), { once: true });
        existingScript.addEventListener("error", () => resolve(false), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const validateForm = (data: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10 digit WhatsApp number.";
    if (data.firstName.trim().length < 2) errors.firstName = "First name is required.";
    if (!data.lastName.trim()) errors.lastName = "Last name is required.";
    if (data.address.trim().length < 8) errors.address = "Enter a complete delivery address.";
    if (data.city.trim().length < 2) errors.city = "City is required.";
    if (data.state.trim().length < 2) errors.state = "State is required.";
    if (!/^\d{6}$/.test(data.zip.trim())) errors.zip = "Enter a valid 6 digit PIN code.";
    return errors;
  };

  const missingCustomization = () =>
    items.reduce((missing, item) => {
      const missingImages = requiresImage(item.product.category)
        ? Array.from({ length: item.quantity }).filter((_, index) => !item.customImages?.[index]).length
        : 0;
      const missingTexts = requiresText(item.product.category)
        ? Array.from({ length: item.quantity }).filter((_, index) => !item.customTexts?.[index]?.trim()).length
        : 0;
      return {
        images: missing.images + missingImages,
        texts: missing.texts + missingTexts,
      };
    }, { images: 0, texts: 0 });

  const verifyRazorpayPayment = async (response: RazorpayPaymentResponse) => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= VERIFY_RETRY_DELAYS_MS.length; attempt += 1) {
      try {
        return await apiFetch<{ order: { id: string } }>('/api/checkout/verify-razorpay', {
          method: 'POST',
          body: JSON.stringify(response),
        });
      } catch (error) {
        lastError = error;
        const delay = VERIFY_RETRY_DELAYS_MS[attempt];
        if (!delay) break;
        await wait(delay);
      }
    }

    throw lastError;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !activeUpload) return;

    try {
      setCheckoutError("");
      const compressedImage = await compressImageForUpload(file);
      setCustomImage(activeUpload.id, activeUpload.index, compressedImage);
      setActiveUpload(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not upload this image.";
      setFieldErrors({ items: message });
      setCheckoutError(message);
    }
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutError("");
    setFieldErrors({});
    setIsConfirmingOrder(false);

    const localErrors = validateForm(formValues);
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }
    if (accountToken && accountEmail && formValues.email.trim().toLowerCase() !== accountEmail.toLowerCase()) {
      const message = "Use your Google account email for checkout.";
      setFieldErrors({ email: message });
      setCheckoutError(message);
      return;
    }
    const missing = missingCustomization();
    if (missing.images > 0 || missing.texts > 0) {
      const parts = [
        missing.images > 0 ? `${missing.images} image${missing.images === 1 ? "" : "s"}` : "",
        missing.texts > 0 ? `${missing.texts} text message${missing.texts === 1 ? "" : "s"}` : "",
      ].filter(Boolean);
      const message = `Please add ${parts.join(" and ")} before payment.`;
      setFieldErrors({ items: message });
      setCheckoutError(message);
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customerEmail: formValues.email,
      customerPhone: formValues.phone,
      customerFirstName: formValues.firstName,
      customerLastName: formValues.lastName,
      customerAddress: formValues.address,
      addressNickname: selectedAddressId === "other" ? (formValues.addressNickname || "Other") : formValues.addressNickname,
      saveAddress,
      accountToken,
      customerCity: formValues.city,
      customerState: formValues.state,
      customerZip: formValues.zip,
      paymentMethod,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        customImageUrl: item.customImages?.[0] || null,
        customImageUrls: item.customImages?.slice(0, item.quantity).filter(Boolean) || [],
        customTexts: item.customTexts?.slice(0, item.quantity) || []
      }))
    };

    try {
      const loaded = await withTimeout(
        loadRazorpay(),
        PAYMENT_SETUP_TIMEOUT_MS,
        "Payment checkout took too long to load. Please refresh and try again."
      );
      const RazorpayCheckout = window.Razorpay;
      if (!loaded || !RazorpayCheckout) {
        throw new Error("Razorpay could not be loaded. Please check your connection and try again.");
      }

      const paymentOrder = await withTimeout(
        apiFetch<{
          key: string;
          razorpayOrderId: string;
          amount: number;
          currency: string;
          total: number;
          codBalance: number;
        }>('/api/checkout/razorpay-order', {
          method: 'POST',
          body: JSON.stringify(orderData)
        }),
        PAYMENT_SETUP_TIMEOUT_MS,
        "Payment setup took too long. Please try again."
      );

      const payNowAmount = paymentMethod === "cod" ? DEPOSIT_AMOUNT : total;

      await new Promise<void>((resolve, reject) => {
        const razorpay = new RazorpayCheckout({
          key: paymentOrder.key,
          amount: payNowAmount * 100,
          currency: paymentOrder.currency,
          name: "ToteMood",
          description: paymentMethod === "cod"
            ? `₹${DEPOSIT_AMOUNT} advance. Remaining amount is cash on delivery.`
            : `Full payment of ₹${total.toFixed(2)}`,
          order_id: paymentOrder.razorpayOrderId,
          prefill: {
            name: `${formValues.firstName} ${formValues.lastName}`,
            email: formValues.email,
            contact: formValues.phone,
          },
          theme: {
            color: "#8E9476",
          },
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled before completion.")),
          },
          handler: async (response: RazorpayPaymentResponse) => {
            try {
              setIsConfirmingOrder(true);
              const [result] = await Promise.all([
                verifyRazorpayPayment(response),
                wait(CONFIRMING_ORDER_MIN_MS),
              ]);
              setConfirmedOrderId(result.order.id);
              setIsSuccess(true);
              setIsConfirmingOrder(false);
              clearCart();
              resolve();
            } catch (err) {
              setIsConfirmingOrder(false);
              reject(err);
            }
          },
        });
        razorpay.open();
      });
    } catch (error: unknown) {
      console.error("Error creating order:", error);
      let message = error instanceof Error ? error.message : "Could not place your order. Please try again.";
      if (error && typeof error === "object" && "details" in error) {
        const details = (error as { details?: Record<string, string> }).details;
        if (details && Object.keys(details).length > 0) {
          const mappedErrors = mapServerFieldErrors(details);
          setFieldErrors(mappedErrors);
          const firstMessage = Object.values(mappedErrors)[0];
          if (firstMessage) message = firstMessage;
        }
      }
      setCheckoutError(message);
      setIsConfirmingOrder(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing && !isConfirmingOrder) {
    return (
      <main className="min-h-screen bg-[#FAF9F8] pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.2} position="top-[10%] left-[20%]" shape="organic1" />

        <div className="bg-white p-10 md:p-16 rounded-[24px] shadow-sm max-w-lg w-full relative z-10 border border-[#E8E5DC]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E8E5DC] bg-[#FAF9F8]">
            <Loader2 className="h-8 w-8 animate-spin text-[#C4756A]" strokeWidth={1.5} />
          </div>
          <h1 className="text-[32px] font-title text-[#252A1A] mb-4">Opening Secure Payment</h1>
          <p className="text-[#686B59] mb-8 leading-[1.6]">
            We&apos;re connecting to Razorpay. The payment window should open in a moment.
          </p>
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#8C867C]">
            Please keep this page open
          </p>
        </div>
      </main>
    );
  }

  if (isConfirmingOrder) {
    return (
      <main className="min-h-screen bg-[#FAF9F8] pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.2} position="top-[10%] left-[20%]" shape="organic1" />

        <div className="bg-white p-10 md:p-16 rounded-[24px] shadow-sm max-w-lg w-full relative z-10 border border-[#E8E5DC]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E8E5DC] bg-[#FAF9F8]">
            <Loader2 className="h-8 w-8 animate-spin text-[#8E9476]" strokeWidth={1.5} />
          </div>
          <h1 className="text-[32px] font-title text-[#252A1A] mb-4">Confirming Order</h1>
          <p className="text-[#686B59] mb-8 leading-[1.6]">
            Payment received. We&apos;re confirming your order and saving the details now.
          </p>
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#8C867C]">
            Please don&apos;t close this page
          </p>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#FAF9F8] pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.2} position="top-[10%] left-[20%]" shape="organic1" />
        
        <div className="bg-white p-10 md:p-16 rounded-[24px] shadow-sm max-w-lg w-full relative z-10 border border-[#E8E5DC]">
          <CheckCircle2 className="w-16 h-16 text-[#8E9476] mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-[32px] font-title text-[#252A1A] mb-4">Order Confirmed</h1>
          <p className="text-[#686B59] mb-10 leading-[1.6]">
            Thank you for your order! We&apos;ll reach out on WhatsApp with order updates and design proofs before printing.
          </p>
          {confirmedOrderId && (
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#8C867C] mb-6">
              Order #{confirmedOrderId.slice(-6).toUpperCase()}
            </p>
          )}
          <Link href="/shop" className="inline-flex items-center justify-center bg-[#252A1A] text-white h-[54px] px-10 rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#3A3E2F] transition-colors shadow-sm">
            Continue Shopping &rarr;
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF9F8] pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-[32px] font-title text-[#252A1A] mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="inline-flex items-center justify-center bg-[#252A1A] text-white h-[54px] px-10 rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#3A3E2F] transition-colors shadow-sm">
          Return to Shop
        </Link>
      </main>
    );
  }

  if (!accountToken) {
    return (
      <main className="min-h-screen bg-[#FAF9F8] pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <AmbientGlow color="bg-[#C4C9B3]" opacity={0.15} position="top-[10%] left-[20%]" shape="organic1" />
        {authMessage && (
          <div className="fixed left-1/2 top-24 z-[80] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-[18px] border border-[#E8E5DC] bg-white px-5 py-4 text-center shadow-[0_18px_50px_rgba(37,42,26,0.12)]">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8E9476]">Totemood</p>
            <p className="mt-1 text-[14px] font-medium text-[#252A1A]">{authMessage}</p>
          </div>
        )}
        <div className="bg-white p-10 md:p-14 rounded-[24px] shadow-sm max-w-md w-full relative z-10 border border-[#E8E5DC]">
          <Lock className="w-12 h-12 text-[#8E9476] mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-[28px] font-title text-[#252A1A] mb-3">Sign in to checkout</h1>
          <p className="text-[15px] text-[#686B59] mb-8 leading-relaxed">
            Please sign in with your Google account to complete your order.
          </p>
          <div className="flex justify-center">
            {GOOGLE_CLIENT_ID ? (
              <div ref={setGoogleButtonNode} />
            ) : (
              <p className="text-[13px] font-medium text-[#B5483B]">Google login is not configured.</p>
            )}
          </div>
          <Link href="/shop" className="inline-flex items-center mt-8 text-[12px] font-bold uppercase tracking-widest text-[#8C867C] hover:text-[#252A1A] transition-colors">
            <ArrowLeft className="w-3 h-3 mr-1.5" />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 h-[54px] text-[15px] text-[#252A1A] placeholder:text-[#8C867C] focus:outline-none focus:border-[#8E9476] focus:bg-white transition-colors shadow-sm";
  const errorClass = "mt-1.5 text-[12px] font-medium text-[#B5483B]";
  const inputWithError = (name: string) => `${inputClass} ${fieldErrors[name] ? "border-[#B5483B] bg-[#FFF8F6]" : ""}`;

  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-24 md:pt-32 pb-24 relative">
      {authMessage && (
        <div className="fixed left-1/2 top-24 z-[80] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-[18px] border border-[#E8E5DC] bg-white px-5 py-4 text-center shadow-[0_18px_50px_rgba(37,42,26,0.12)]">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8E9476]">Totemood</p>
          <p className="mt-1 text-[14px] font-medium text-[#252A1A]">{authMessage}</p>
        </div>
      )}
      <div className="container mx-auto px-6 lg:px-12 max-w-[1100px] relative z-10">
        
        <Link href="/shop" className="inline-flex items-center text-[12px] font-bold uppercase tracking-widest text-[#8C867C] hover:text-[#252A1A] transition-colors mb-6 md:mb-8">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back to Shop
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <h1 className="text-[36px] md:text-[42px] font-title text-[#252A1A] leading-none">Checkout</h1>
          <div className="text-[13px] font-medium text-[#8C867C] flex items-center gap-2">
            <span className="text-[#252A1A]">1 Contact</span> &middot; <span>2 Shipping</span> &middot; <span>3 Payment</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-[55%] flex flex-col gap-12">
            
            {/* Contact Information */}
            <section>
              <h2 className="text-[20px] font-title text-[#252A1A] mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#252A1A] text-white text-[12px] font-bold">1</span>
                Contact Information
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <input name="email" type="email" placeholder="Email Address" autoComplete="email" required value={formValues.email} onChange={(event) => setFormValue("email", event.target.value)} className={inputWithError("email")} />
                  {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
                </div>
                <div>
                  <input name="phone" type="tel" placeholder="WhatsApp Number" autoComplete="tel" pattern="[6-9][0-9]{9}" maxLength={10} required value={formValues.phone} onChange={(event) => setFormValue("phone", event.target.value)} className={inputWithError("phone")} />
                  {fieldErrors.phone && <p className={errorClass}>{fieldErrors.phone}</p>}
                </div>
                <div className="flex items-center gap-3 mt-1 ml-1">
                  <div className="relative flex items-center">
                    <input type="checkbox" id="newsletter" className="peer appearance-none w-[18px] h-[18px] border border-[#E8E5DC] rounded-[4px] bg-white checked:bg-[#8E9476] checked:border-[#8E9476] cursor-pointer transition-colors shadow-sm" defaultChecked />
                    <Check className="w-3 h-3 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                  <label htmlFor="newsletter" className="text-[14px] text-[#5A5A55] cursor-pointer">Email me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-[20px] font-title text-[#252A1A] mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#252A1A] text-white text-[12px] font-bold">2</span>
                Shipping Address
              </h2>
              {accountToken && savedAddresses.length > 0 && (
                <div className="mb-5">
                  <select
                    value={selectedAddressId}
                    onChange={(event) => {
                      const nextId = event.target.value;
                      if (nextId === "other") {
                        setSelectedAddressId("other");
                        setFormValues((current) => ({ ...current, addressNickname: "Other" }));
                        return;
                      }
                      const selected = savedAddresses.find((address) => address.id === nextId);
                      if (selected) applySavedAddress(selected);
                    }}
                    className={inputClass}
                  >
                    <option value="other">Other address</option>
                    {savedAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.nickname} - {address.address}, {address.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input name="addressNickname" type="text" placeholder="Address nickname, e.g. Home, Work, Other" required value={formValues.addressNickname} onChange={(event) => setFormValue("addressNickname", event.target.value)} className={inputWithError("addressNickname")} />
                  {fieldErrors.addressNickname && <p className={errorClass}>{fieldErrors.addressNickname}</p>}
                </div>
                <div>
                  <input name="firstName" type="text" placeholder="First Name" autoComplete="given-name" minLength={2} required value={formValues.firstName} onChange={(event) => setFormValue("firstName", event.target.value)} className={inputWithError("firstName")} />
                  {fieldErrors.firstName && <p className={errorClass}>{fieldErrors.firstName}</p>}
                </div>
                <div>
                  <input name="lastName" type="text" placeholder="Last Name" autoComplete="family-name" required value={formValues.lastName} onChange={(event) => setFormValue("lastName", event.target.value)} className={inputWithError("lastName")} />
                  {fieldErrors.lastName && <p className={errorClass}>{fieldErrors.lastName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input name="address" type="text" placeholder="Address" autoComplete="street-address" minLength={8} required value={formValues.address} onChange={(event) => setFormValue("address", event.target.value)} className={inputWithError("address")} />
                  {fieldErrors.address && <p className={errorClass}>{fieldErrors.address}</p>}
                </div>
                <div>
                  <input name="city" type="text" placeholder="City" autoComplete="address-level2" required value={formValues.city} onChange={(event) => setFormValue("city", event.target.value)} className={inputWithError("city")} />
                  {fieldErrors.city && <p className={errorClass}>{fieldErrors.city}</p>}
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input name="state" type="text" placeholder="State" autoComplete="address-level1" required value={formValues.state} onChange={(event) => setFormValue("state", event.target.value)} className={inputWithError("state")} />
                    {fieldErrors.state && <p className={errorClass}>{fieldErrors.state}</p>}
                  </div>
                  <div className="w-1/2">
                    <input name="zip" type="text" placeholder="PIN Code" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={formValues.zip} onChange={(event) => setFormValue("zip", event.target.value)} className={inputWithError("zip")} />
                    {fieldErrors.zip && <p className={errorClass}>{fieldErrors.zip}</p>}
                  </div>
                </div>
                {accountToken && selectedAddressId === "other" && (
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 text-[14px] text-[#5A5A55]">
                      <input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} className="h-4 w-4" />
                      Save this address to my account
                    </label>
                    {fieldErrors.saveAddress && <p className={`${errorClass} mt-2`}>{fieldErrors.saveAddress}</p>}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-[20px] font-title text-[#252A1A] mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#252A1A] text-white text-[12px] font-bold">3</span>
                Payment Method
              </h2>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full p-5 rounded-[16px] border-2 text-left transition-all flex items-start gap-4 ${
                    paymentMethod === "cod"
                      ? "border-[#252A1A] bg-[#FAF9F8]"
                      : "border-[#E8E5DC] bg-white hover:border-[#C8C5BC]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                    paymentMethod === "cod" ? "border-[#252A1A]" : "border-[#C8C5BC]"
                  }`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-[#252A1A]" />}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#252A1A]">Cash on Delivery</p>
                    <p className="text-[13px] text-[#686B59] mt-1 leading-relaxed">
                      Pay ₹{DEPOSIT_AMOUNT} now online, remaining ₹{codBalance.toFixed(2)} when your order arrives. For custom items, we&apos;ll send a Ghibli sample design on WhatsApp for approval before dispatch.
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("prepaid")}
                  className={`w-full p-5 rounded-[16px] border-2 text-left transition-all flex items-start gap-4 ${
                    paymentMethod === "prepaid"
                      ? "border-[#252A1A] bg-[#FAF9F8]"
                      : "border-[#E8E5DC] bg-white hover:border-[#C8C5BC]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                    paymentMethod === "prepaid" ? "border-[#252A1A]" : "border-[#C8C5BC]"
                  }`}>
                    {paymentMethod === "prepaid" && <div className="w-2.5 h-2.5 rounded-full bg-[#252A1A]" />}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#252A1A]">Prepaid (Full Payment)</p>
                    <p className="text-[13px] text-[#686B59] mt-1 leading-relaxed">
                      Pay the full ₹{total.toFixed(2)} now via Razorpay. Fast &amp; secure.
                    </p>
                  </div>
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[#5A5A55]">
                <Lock className="w-4 h-4" />
                <span className="text-[13px] font-medium">Secure Razorpay payment in ToteMood colors.</span>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-24">
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-[#E8E5DC] shadow-sm">
              <h2 className="text-[24px] font-title text-[#252A1A] mb-8">Order Summary</h2>
              {fieldErrors.items && (
                <p className="mb-5 rounded-[12px] border border-[#E7B7AE] bg-[#FFF8F6] px-4 py-3 text-[13px] font-medium text-[#B5483B]">
                  {fieldErrors.items}
                </p>
              )}

              <div className="flex flex-col gap-8 mb-8">
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <div className="w-[92px] h-[92px] rounded-[12px] bg-[#F5F3EC] overflow-hidden border border-[#E8E5DC] relative">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover mix-blend-multiply" />
                        </div>
                        <span className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-[#686B59] text-white text-[11px] font-bold flex items-center justify-center rounded-full z-10 shadow-sm border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 justify-center py-1">
                        <h3 className="text-[14px] font-medium text-[#252A1A] mb-1">{item.product.name}</h3>
                        <p className="text-[12px] text-[#8C867C] mb-2">
                          {(item.product.label || "new").charAt(0).toUpperCase() + (item.product.label || "new").slice(1)}
                        </p>
                        <span className="font-bold text-[14px] text-[#252A1A]">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Premium Image Upload & Custom Text Module */}
                    {item.product.category !== "no customization" && (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: item.quantity }).map((_, idx) => {
                          const uploadedImage = item.customImages?.[idx];
                          const customText = item.customTexts?.[idx] || "";
                          const showImageError = Boolean(fieldErrors.items && requiresImage(item.product.category) && !uploadedImage);
                          const showTextError = Boolean(fieldErrors.items && requiresText(item.product.category) && !customText.trim());

                          return (
                            <div key={idx} className="flex flex-col gap-2">
                              {requiresImage(item.product.category) && (
                                uploadedImage ? (
                                <div className="bg-[#FAF9F8] rounded-[12px] p-4 border border-[#E8E5DC] flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-[48px] h-[48px] rounded-[8px] overflow-hidden relative border border-[#E8E5DC] bg-white">
                                      <Image src={uploadedImage} alt="Uploaded preview" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-medium text-[#252A1A] flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8E9476]" /> 
                                        Image attached
                                      </span>
                                    </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setActiveUpload({ id: item.product.id, index: idx });
                                      fileInputRef.current?.click();
                                    }}
                                    className="text-[11px] font-bold uppercase tracking-widest text-[#8C867C] hover:text-[#252A1A] transition-colors"
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
                                  className={`w-full h-[80px] border border-dashed rounded-[12px] flex flex-col items-center justify-center transition-colors ${showImageError ? "bg-[#FFF8F6] border-[#B5483B]" : "bg-[#F5F3EC] border-[#8C867C]/50 hover:border-[#8E9476] hover:bg-[#FAF9F8]"}`}
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <Upload className="w-[14px] h-[14px] text-[#8C867C]" strokeWidth={2} />
                                    <span className="text-[13px] font-bold text-[#252A1A]">Upload your image</span>
                                  </div>
                                  <span className="text-[11px] text-[#8C867C]">PNG or JPG &middot; Max 10MB</span>
                                </button>
                                )
                              )}

                              {requiresText(item.product.category) && (
                                <div className={`bg-[#FAF9F8] p-3.5 rounded-[12px] border ${showTextError ? "border-[#B5483B]" : "border-[#E8E5DC]"}`}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252A1A]">
                                      Custom Text / Message
                                    </label>
                                    <span className="text-[10px] text-[#8C867C]">e.g. Names, Date, Quote</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={customText}
                                    onChange={(e) => setCustomText(item.product.id, idx, e.target.value)}
                                    placeholder="Enter your custom text here..."
                                    className="w-full h-10 px-3.5 bg-white border border-[#E8E5DC] rounded-[8px] text-[13px] text-[#252A1A] placeholder:text-[#8C867C] focus:outline-none focus:border-[#8E9476] transition-colors"
                                  />
                                </div>
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
                accept="image/png, image/jpeg" 
                className="hidden" 
              />

              <div className="flex flex-col gap-4 pt-6 border-t border-[#E8E5DC]">
                <div className="flex justify-between text-[#5A5A55] text-[14px]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#252A1A]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5A5A55] text-[14px]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#252A1A]">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[18px] font-bold text-[#252A1A] mt-2 pt-6 border-t border-[#E8E5DC]">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {paymentMethod === "cod" ? (
                  <>
                    <div className="flex justify-between text-[#757D5C] text-[14px] font-bold">
                      <span>Pay now</span>
                      <span>₹{DEPOSIT_AMOUNT.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A5A55] text-[14px]">
                      <span>Cash on delivery</span>
                      <span className="font-medium text-[#252A1A]">₹{codBalance.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#757D5C] text-[14px] font-bold">
                    <span>Pay now (full)</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Final CTA Area */}
              <div className="mt-8 flex flex-col gap-4">
                {items.some(item => item.product.isCustomizable) && (
                  <div className="bg-[#FFF5F3] border border-[#E8C4BC] rounded-[14px] p-4">
                    <p className="text-[13px] text-[#6B4A42] leading-relaxed">
                      Since this is a personalised order, pay <strong>₹{DEPOSIT_AMOUNT} now</strong> to confirm. Pay the remaining amount on delivery, and we&apos;ll send your <strong>Ghibli sample design on WhatsApp</strong> for approval before dispatch.
                    </p>
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-[#C4756A] text-white h-[54px] rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#A85D53] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {paymentMethod === "cod" ? `Pay ₹${DEPOSIT_AMOUNT} advance` : `Pay ₹${total.toFixed(2)}`}
                      <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </>
                  )}
                </button>
                {checkoutError && (
                  <p className="text-center text-[13px] font-medium text-[#B5483B]">
                    {checkoutError}
                  </p>
                )}
                <div className="flex items-center justify-center gap-1.5 text-[#8C867C]">
                  <Lock className="w-[12px] h-[12px]" strokeWidth={2} />
                  <span className="text-[11px] font-medium">
                    {paymentMethod === "cod"
                      ? `₹${DEPOSIT_AMOUNT} online now · rest payable by COD`
                      : "Full amount payable now via Razorpay"
                    }
                  </span>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </main>
  );
}
