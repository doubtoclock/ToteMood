"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { apiFetch } from "@/lib/api";
import { loadGoogleIdentity, renderGoogleSignInButton } from "@/lib/googleSignIn";
import {
  AccountProfile,
  AccountSession,
  SavedAddress,
  accountAuthHeaders,
  getStoredAccountProfile,
} from "@/lib/account";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2, MapPin, Package, Plus, Trash2, User, LogOut } from "lucide-react";

type AccountTab = "details" | "orders" | "addresses";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface AccountOrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  customImageUrl?: string | null;
  customText?: string | null;
  product?: {
    name: string;
    image: string;
    label: string;
    category: string;
  } | null;
}

interface AccountOrder {
  id: string;
  customerEmail: string;
  customerPhone: string;
  customerFirstName: string;
  customerLastName: string;
  customerAddress: string;
  addressNickname?: string;
  customerCity: string;
  customerState: string;
  customerZip: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: AccountOrderItem[];
}

type AddressForm = Omit<SavedAddress, "id" | "createdAt" | "updatedAt">;

const emptyAddress = (profile: AccountProfile): AddressForm => ({
  email: profile.email,
  nickname: "Other",
  firstName: profile.firstName,
  lastName: profile.lastName,
  phone: profile.phone,
  address: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
});

const inputClass = "w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 h-[54px] text-[15px] text-[#252A1A] placeholder:text-[#8C867C] focus:outline-none focus:border-[#8E9476] focus:bg-white transition-colors shadow-sm";
const labelClass = "block text-[12px] font-bold text-[#686B59] uppercase tracking-wider mb-2";
const errorClass = "mt-1.5 text-[12px] font-medium text-[#B5483B]";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function prettyStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function AccountContent() {
  const [googleButtonNode, setGoogleButtonNode] = useState<HTMLDivElement | null>(null);
  const addressFormRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>("details");
  const profile = useAuthStore((state) => state.profile);
  const accountToken = useAuthStore((state) => state.token);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressDraft, setAddressDraft] = useState<AddressForm>(() => emptyAddress(getStoredAccountProfile()));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const accountEmail = profile.email.trim().toLowerCase();
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || null;
  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Guest";

  const orderCountLabel = useMemo(
    () => `${orders.length} order${orders.length === 1 ? "" : "s"}`,
    [orders.length]
  );

  const scrollAddressFormIntoView = () => {
    window.requestAnimationFrame(() => {
      addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    try {
      const session = await apiFetch<AccountSession>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
      signIn(session);
      setMessage("Successfully logged in.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign-in failed.");
    }
  }, [signIn]);

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

  useEffect(() => {
    if (!accountToken) {
      queueMicrotask(() => {
        setOrders([]);
        setAddresses([]);
      });
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    const headers = accountAuthHeaders();
    Promise.all([
      apiFetch<AccountOrder[]>("/api/account/orders", { headers }),
      apiFetch<SavedAddress[]>("/api/account/addresses", { headers }),
    ])
      .then(([nextOrders, nextAddresses]) => {
        if (cancelled) return;
        setOrders(nextOrders);
        setAddresses(nextAddresses);
      })
      .catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Could not load account details.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountToken]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const startNewAddress = () => {
    if (isSavingAddress || deletingAddressId) return;
    setEditingAddress(null);
    setAddressDraft(emptyAddress(profile));
    setFieldErrors({});
    scrollAddressFormIntoView();
  };

  const startEditAddress = (address: SavedAddress) => {
    if (isSavingAddress || deletingAddressId) return;
    setEditingAddress(address);
    setAddressDraft({
      email: address.email,
      nickname: address.nickname,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      isDefault: address.isDefault,
    });
    setFieldErrors({});
    scrollAddressFormIntoView();
  };

  const saveAddress = async () => {
    if (isSavingAddress) return;

    if (!accountToken) {
      setMessage("Sign in with Google before adding addresses.");
      return;
    }

    setIsSavingAddress(true);
    setFieldErrors({});

    try {
      const payload = { ...addressDraft, email: accountEmail };
      const headers = accountAuthHeaders();
      const saved = editingAddress
        ? await apiFetch<SavedAddress>(`/api/account/addresses/${editingAddress.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          })
        : await apiFetch<SavedAddress>("/api/account/addresses", {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

      setAddresses((current) => {
        const withoutSaved = current.filter((address) => address.id !== saved.id);
        const updated = saved.isDefault
          ? withoutSaved.map((address) => ({ ...address, isDefault: false }))
          : withoutSaved;
        return [saved, ...updated].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      });
      setEditingAddress(null);
      setAddressDraft(emptyAddress(profile));
      setFieldErrors({});
      setMessage("Address saved successfully.");
    } catch (error) {
      if (error && typeof error === "object" && "details" in error) {
        setFieldErrors((error as { details?: Record<string, string> }).details || {});
      }
      setMessage(error instanceof Error ? error.message : "Could not save address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!accountToken) return;
    if (deletingAddressId) return;

    setDeletingAddressId(addressId);
    try {
      await apiFetch(`/api/account/addresses/${addressId}`, {
        method: "DELETE",
        headers: accountAuthHeaders(),
      });
      setAddresses((current) => current.filter((address) => address.id !== addressId));
      setMessage("Address removed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove address.");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const AccountDetailsView = () => (
    <section className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Account Details</h2>
        {accountToken && <span className="text-[12px] tracking-wide text-[#686B59]">Google account</span>}
      </div>

      {!accountToken ? (
        <div key="account-signed-out" className="max-w-[650px]">
          <p className="text-[14px] text-[#686B59] mb-5">Sign in with Google to see your own orders and saved addresses.</p>
          {GOOGLE_CLIENT_ID ? (
            <div ref={setGoogleButtonNode} />
          ) : (
            <p className="text-[13px] font-medium text-[#B5483B]">Google login is missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.</p>
          )}
        </div>
      ) : (
        <div key="account-signed-in" className="flex flex-col sm:flex-row gap-5 sm:items-center max-w-[650px]">
          {profile.picture && (
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#F5F3EC]">
              <Image src={profile.picture} alt={profile.name || profile.email} fill className="object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div>
              <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">Name</span>
              <p className="text-[#5A5A55] text-[16px]">{profile.name || displayName}</p>
            </div>
            <div>
              <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">Email Address</span>
              <p className="text-[#5A5A55] text-[16px]">{profile.email}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const OrdersView = () => (
    <section className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex justify-between items-center border-b border-[#E8E5DC] pb-4 mb-6">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Order History</h2>
        <span className="text-[12px] tracking-wide text-[#686B59]">{orderCountLabel}</span>
      </div>

      {!accountToken ? (
        <p className="text-[14px] text-[#686B59]">Sign in with Google to see your orders.</p>
      ) : selectedOrder ? (
        OrderDetails({ order: selectedOrder, onBack: () => setSelectedOrderId(null) })
      ) : orders.length === 0 ? (
        <p className="text-[14px] text-[#686B59]">{isLoading ? "Loading orders..." : "No orders found for this account yet."}</p>
      ) : (
        <div className="flex flex-col">
          {orders.map((order, index) => {
            const firstItem = order.items[0];
            return (
              <div key={order.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-6 ${index !== orders.length - 1 ? "border-b border-[#E8E5DC]" : ""}`}>
                <div className="flex gap-5 items-center">
                  <div className="w-[68px] h-[68px] bg-[#F5F3EC] rounded-[10px] relative overflow-hidden shrink-0">
                    {firstItem?.product?.image && <Image src={firstItem.product.image} alt={firstItem.product.name} fill className="object-cover" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium text-[#252A1A] uppercase tracking-[0.1em]">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em]">{formatDate(order.createdAt)}</span>
                    </div>
                    <p className="text-[15px] text-[#5A5A55] mb-2">{order.items.length} item{order.items.length === 1 ? "" : "s"} · ₹{order.total.toFixed(2)}</p>
                    <span className="text-[12px] font-bold uppercase tracking-widest text-[#8E9476]">{prettyStatus(order.status)}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedOrderId(order.id)} className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors">
                  View order
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  const OrderDetails = ({ order, onBack }: { order: AccountOrder; onBack: () => void }) => (
    <div>
      <button onClick={onBack} className="mb-6 text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors">Back to orders</button>
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-8">
        <div>
          <h3 className="text-[20px] font-title text-[#252A1A]">Order #{order.id.slice(-6).toUpperCase()}</h3>
          <p className="text-[12px] uppercase tracking-widest text-[#686B59]">{formatDate(order.createdAt)} · {prettyStatus(order.status)}</p>
        </div>
        <div className="text-right text-[14px] font-bold text-[#252A1A]">₹{order.total.toFixed(2)}</div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-[#F5F3EC]/50 p-3 rounded-[16px] border border-[#E8E5DC]">
            <div className="w-16 h-16 bg-[#EAECE3] rounded-[10px] relative overflow-hidden shrink-0">
              {item.product?.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-[15px] text-[#252A1A] font-medium">{item.product?.name || "Product"}</p>
              <p className="text-[13px] text-[#686B59]">Qty: {item.quantity}</p>
              {item.customText && (
                <p className="text-[12px] text-[#686B59] mt-1">Text: {item.customText}</p>
              )}
            </div>
            <div className="text-[15px] text-[#252A1A] font-medium">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#E8E5DC] pt-8">
        <div>
          <h3 className="text-[14px] font-title text-[#252A1A] mb-3">Delivery Address</h3>
          <div className="text-[14px] text-[#5A5A55] leading-relaxed">
            <span className="inline-flex mb-2 text-[10px] font-bold uppercase tracking-widest text-[#686B59] bg-[#F5F3EC] px-2 py-1 rounded-[4px]">{order.addressNickname || "Other"}</span>
            <span className="block font-medium text-[#252A1A]">{order.customerFirstName} {order.customerLastName}</span>
            {order.customerAddress}<br />
            {order.customerCity}, {order.customerState} {order.customerZip}<br />
            {order.customerPhone}
          </div>
        </div>
        <div>
          <h3 className="text-[14px] font-title text-[#252A1A] mb-3">Order Summary</h3>
          <div className="space-y-2 text-[14px] text-[#5A5A55]">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between border-t border-[#E8E5DC] pt-2 mt-2 font-bold text-[#252A1A]"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddressesView = () => (
    <section className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Saved Addresses</h2>
        <button onClick={startNewAddress} className="inline-flex items-center gap-2 text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add address
        </button>
      </div>

      {!accountToken && <p className="text-[14px] text-[#686B59] mb-6">Sign in with Google before managing addresses.</p>}

      {accountToken && (
        <div ref={addressFormRef} className={editingAddress ? "rounded-[18px] ring-2 ring-[#8E9476]/30 ring-offset-4 ring-offset-white transition-shadow" : "transition-shadow"}>
          <AddressForm
            draft={addressDraft}
            errors={fieldErrors}
            title={editingAddress ? `Editing ${editingAddress.nickname}` : "Add address"}
            submitLabel={editingAddress ? "Update address" : "Save address"}
            isSaving={isSavingAddress}
            onChange={setAddressDraft}
            onSave={saveAddress}
            onCancel={() => { setEditingAddress(null); setAddressDraft(emptyAddress(profile)); setFieldErrors({}); }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {addresses.map((address) => (
          <div key={address.id} className="border border-[#E8E5DC] rounded-[16px] p-6 flex flex-col bg-[#FAF9F8]/50">
            <div className="flex justify-between gap-3 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#252A1A]">{address.nickname}</span>
              {address.isDefault && <span className="text-[9px] font-bold uppercase tracking-widest text-[#686B59] bg-[#F5F3EC] px-2 py-0.5 rounded-[4px]">Default</span>}
            </div>
            <div className="text-[14px] text-[#5A5A55] leading-relaxed flex-1 mb-6">
              <span className="block font-medium text-[#252A1A] mb-1">{address.firstName} {address.lastName}</span>
              {address.address}<br />
              {address.city}, {address.state} {address.zip}<br />
              {address.phone}
            </div>
            <div className="flex items-center gap-5 border-t border-[#E8E5DC] pt-4">
              <button
                type="button"
                onClick={() => startEditAddress(address)}
                disabled={isSavingAddress || deletingAddressId !== null}
                className={`text-[12px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${editingAddress?.id === address.id ? "font-bold text-[#252A1A]" : "text-[#686B59] hover:text-[#252A1A]"}`}
              >
                {editingAddress?.id === address.id ? "Editing" : "Edit"}
              </button>
              <button
                type="button"
                onClick={() => deleteAddress(address.id)}
                disabled={deletingAddressId !== null}
                className="inline-flex min-w-[82px] items-center gap-1 text-[12px] tracking-wide text-[#b06161] transition-colors hover:text-[#8c4d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingAddressId === address.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {deletingAddressId === address.id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-[90px] pb-16">
      <Section className="relative overflow-hidden pt-0 md:pt-0">
        <AmbientGlow color="bg-[#8E9476]" opacity={0.06} position="top-[5%] left-[5%]" width="w-[50vw]" height="h-[50vw]" shape="organic1" />
        <div className="max-w-[1150px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="w-full mb-10 text-left">
            <h1 className="text-[32px] md:text-[48px] font-title text-[#252A1A] font-medium leading-none tracking-tight">My Account</h1>
            <p className="text-[17px] md:text-[18px] text-[#686B59] font-sans mt-1.5">Welcome back, {displayName}.</p>
            <p className="text-[11px] tracking-[0.1em] text-[#8C867C] uppercase mt-1">
              {orders.length} ORDER{orders.length === 1 ? "" : "S"} · {addresses.length} SAVED ADDRESS{addresses.length === 1 ? "" : "ES"}
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-[250px_minmax(0,850px)] gap-6 lg:gap-7">
            <div className="flex lg:flex-col overflow-x-auto whitespace-nowrap lg:whitespace-normal pb-4 lg:pb-0 hide-scrollbar gap-1 lg:bg-white lg:rounded-[20px] lg:p-4 lg:border lg:border-[#E8E5DC]">
              {[
                { key: "details" as const, label: "Account Details", icon: User },
                { key: "orders" as const, label: "Order History", icon: Package },
                { key: "addresses" as const, label: "Addresses", icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActiveTab(item.key); setSelectedOrderId(null); }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-[12px] font-medium transition-all shrink-0 lg:shrink-auto ${activeTab === item.key ? "bg-[#F5F3EC]/70 text-[#252A1A]" : "text-[#686B59] hover:bg-[#F5F3EC]/50 hover:text-[#252A1A] bg-transparent"}`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {item.label}
                  </button>
                );
              })}
              <div className="hidden lg:block h-px bg-[#E8E5DC] my-3" />
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-3 px-4 py-2 rounded-[12px] text-[#b06161] hover:bg-red-50 font-medium transition-all shrink-0 lg:shrink-auto"
              >
                <LogOut size={18} strokeWidth={1.5} />
                Log out
              </button>
            </div>

            <div>
              {activeTab === "details" && AccountDetailsView()}
              {activeTab === "orders" && OrdersView()}
              {activeTab === "addresses" && AddressesView()}
            </div>
          </div>
        </div>
      </Section>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 max-w-[400px] w-full shadow-2xl border border-[#E8E5DC]">
            <h3 className="text-[20px] font-title text-[#252A1A] mb-3">Log Out</h3>
            <p className="text-[15px] text-[#5A5A55] mb-8">
              Are you sure you want to log out of your account? You will need to sign back in to view your orders.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-[#E8E5DC] h-[46px] rounded-[14px] text-[12px] font-bold uppercase tracking-widest text-[#686B59] hover:bg-[#F5F3EC]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  signOut();
                  setOrders([]);
                  setAddresses([]);
                  setMessage("You have been logged out.");
                }}
                className="flex-1 bg-[#b06161] text-white h-[46px] rounded-[14px] text-[12px] font-bold uppercase tracking-widest hover:bg-[#9a5454] transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed left-1/2 top-24 z-[80] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-[18px] border border-[#E8E5DC] bg-white px-5 py-4 text-center shadow-[0_18px_50px_rgba(37,42,26,0.12)]">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8E9476]">Totemood</p>
          <p className="mt-1 text-[14px] font-medium text-[#252A1A]">{message}</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      ` }} />
    </main>
  );
}

function AddressForm({
  draft,
  errors,
  title,
  submitLabel,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: {
  draft: AddressForm;
  errors: Record<string, string>;
  title: string;
  submitLabel: string;
  isSaving: boolean;
  onChange: (draft: AddressForm) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const setValue = (key: keyof AddressForm, value: string | boolean) => onChange({ ...draft, [key]: value });

  return (
    <form
      className="border border-[#E8E5DC] rounded-[16px] p-5 bg-[#FAF9F8]/60"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isSaving) onSave();
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-title text-[#252A1A]">{title}</h3>
        {isSaving && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E5DC] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#686B59] shadow-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nickname</label>
          <input value={draft.nickname} onChange={(event) => setValue("nickname", event.target.value)} placeholder="Home, Work, Other" className={inputClass} />
          {errors.nickname && <p className={errorClass}>{errors.nickname}</p>}
        </div>
        <div>
          <label className={labelClass}>First Name</label>
          <input value={draft.firstName} onChange={(event) => setValue("firstName", event.target.value)} className={inputClass} />
          {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input value={draft.lastName} onChange={(event) => setValue("lastName", event.target.value)} className={inputClass} />
          {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>WhatsApp Number</label>
          <input value={draft.phone} onChange={(event) => setValue("phone", event.target.value)} className={inputClass} />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <input value={draft.address} onChange={(event) => setValue("address", event.target.value)} className={inputClass} />
          {errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input value={draft.city} onChange={(event) => setValue("city", event.target.value)} className={inputClass} />
          {errors.city && <p className={errorClass}>{errors.city}</p>}
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input value={draft.state} onChange={(event) => setValue("state", event.target.value)} className={inputClass} />
          {errors.state && <p className={errorClass}>{errors.state}</p>}
        </div>
        <div>
          <label className={labelClass}>PIN Code</label>
          <input value={draft.zip} onChange={(event) => setValue("zip", event.target.value)} className={inputClass} />
          {errors.zip && <p className={errorClass}>{errors.zip}</p>}
        </div>
        <label className="flex items-center gap-3 pt-7 text-[14px] text-[#5A5A55]">
          <input type="checkbox" checked={draft.isDefault} onChange={(event) => setValue("isDefault", event.target.checked)} className="h-4 w-4" />
          Default address
        </label>
      </div>
      <div className="flex gap-3 pt-5">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-[46px] min-w-[156px] items-center justify-center gap-2 rounded-[14px] bg-[#252A1A] px-7 text-[12px] font-bold uppercase tracking-widest text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#5F6252]"
        >
          {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isSaving ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="h-[46px] rounded-[14px] border border-[#E8E5DC] px-7 text-[12px] font-bold uppercase tracking-widest text-[#686B59] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
