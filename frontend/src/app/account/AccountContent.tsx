"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Package, User, MapPin, LogOut } from "lucide-react";

// --- Mock Data ---
const MOCK_ORDERS = [
  { id: "TM1024", date: "12 AUG 2026", items: 2, total: 2499, status: "Delivered", image: "/images/product_mockup.png" },
  { id: "TM0982", date: "05 JUL 2026", items: 1, total: 1299, status: "Processing", image: "/images/collection_everyday.png" },
  { id: "TM0744", date: "18 MAY 2026", items: 1, total: 1599, status: "Cancelled", image: "/images/collection_panoramic.png" },
];

const MOCK_ADDRESSES = [
  { id: 1, label: "HOME", name: "Jane Doe", line1: "123 Fashion Street, Apt 4B", city: "Mumbai", state: "Maharashtra", pin: "400001", phone: "+91 98765 43210", isDefault: true },
  { id: 2, label: "WORK", name: "Jane Doe", line1: "Totemood HQ, 5th Floor, Design Park", city: "Mumbai", state: "Maharashtra", pin: "400051", phone: "+91 98765 43210", isDefault: false }
];

export function AccountContent() {
  const [activeTab, setActiveTab] = useState("details"); // details, orders, addresses
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // --- Views ---
  
  const AccountDetailsView = () => (
    <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">
          Account Details
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors"
        >
          {isEditing ? "Cancel" : <>Edit profile&rarr;</>}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-6 w-full max-w-[550px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">First Name</span>
              <p className="text-[#5A5A55] text-[16px]">Jane</p>
            </div>
            <div>
              <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">Last Name</span>
              <p className="text-[#5A5A55] text-[16px]">Doe</p>
            </div>
          </div>
          <div>
            <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">Email Address</span>
            <p className="text-[#5A5A55] text-[16px]">jane.doe@example.com</p>
          </div>
          <div>
            <span className="block text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em] mb-1">Phone Number</span>
            <p className="text-[#5A5A55] text-[16px]">+91 98765 43210</p>
          </div>
        </div>
      ) : (
        <form className="space-y-6 w-full max-w-[550px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">First Name</label>
              <input type="text" id="firstName" defaultValue="Jane" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all shadow-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Last Name</label>
              <input type="text" id="lastName" defaultValue="Doe" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all shadow-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Email Address</label>
            <input type="email" id="email" defaultValue="jane.doe@example.com" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all shadow-none" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Phone Number</label>
            <input type="tel" id="phone" defaultValue="+91 98765 43210" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all shadow-none" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="bg-[#252A1A] text-white text-[13px] font-bold uppercase tracking-widest px-8 py-3 rounded-[14px] hover:bg-black transition-all">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-transparent text-[#686B59] border border-[#E8E5DC] text-[13px] font-bold uppercase tracking-widest px-8 py-3 rounded-[14px] hover:bg-[#F5F3EC] transition-all">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );

  const OrderListView = () => (
    <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Order History</h2>
        <span className="text-[12px] tracking-wide text-[#686B59]">{MOCK_ORDERS.length} orders</span>
      </div>
      
      <div className="flex flex-col w-full max-w-[700px]">
        {MOCK_ORDERS.map((order, index) => (
          <div key={order.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 ${index !== MOCK_ORDERS.length - 1 ? 'border-b border-[#E8E5DC]' : ''}`}>
            <div className="flex gap-5 items-center">
              <div className="w-[68px] h-[68px] bg-[#F5F3EC] rounded-[10px] relative overflow-hidden shrink-0">
                <Image src={order.image} alt="Order Thumbnail" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-medium text-[#252A1A] uppercase tracking-[0.1em]">{order.id}</span>
                  <span className="text-[#E8E5DC]">&bull;</span>
                  <span className="text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em]">{order.date}</span>
                </div>
                <p className="text-[15px] text-[#5A5A55] mb-2">{order.items} item{order.items > 1 ? 's' : ''} &middot; ₹{order.total.toLocaleString()}</p>
                <div className="flex items-center">
                  <span className={`text-[12px] font-bold uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'text-[#8E9476]' : 
                    order.status === 'Processing' ? 'text-[#b8956e]' : 
                    'text-[#b06161]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
              <button 
                onClick={() => setSelectedOrder(order.id)}
                className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors"
              >
                View order&rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OrderDetailsView = () => {
    const order = MOCK_ORDERS.find(o => o.id === selectedOrder) || MOCK_ORDERS[0];
    
    return (
      <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-8 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Order {order.id}</h2>
            <span className="text-[12px] font-medium text-[#686B59] uppercase tracking-[0.1em]">{order.date}</span>
          </div>
          <button 
            onClick={() => setSelectedOrder(null)}
            className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors"
          >
            &larr; Back to Orders
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 px-2 sm:px-0">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E8E5DC] -z-10"></div>
            {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((step, idx) => {
              // Simple mock logic for status styling
              let isActive = false;
              if (order.status === 'Delivered') isActive = true;
              else if (order.status === 'Processing' && idx <= 1) isActive = true;
              
              return (
                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#8E9476]' : 'bg-[#E8E5DC]'}`}></div>
                  <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#252A1A]' : 'text-[#a2a596]'}`}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Product List */}
        <div className="mb-8">
          <h3 className="text-[14px] font-title text-[#252A1A] mb-4">Items in this order</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-[#F5F3EC]/50 p-3 rounded-[16px] border border-[#E8E5DC]">
              <div className="w-16 h-16 bg-[#EAECE3] rounded-[10px] relative overflow-hidden shrink-0">
                <Image src={order.image} alt="Product" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] text-[#252A1A] font-medium">Customizable Canvas Tote</p>
                <p className="text-[13px] text-[#686B59]">Standard Size &middot; Qty: {order.items}</p>
              </div>
              <div className="text-[15px] text-[#252A1A] font-medium pr-2">
                ₹{order.total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#E8E5DC] pt-8">
          {/* Delivery Address */}
          <div>
            <h3 className="text-[14px] font-title text-[#252A1A] mb-3">Delivery Address</h3>
            <div className="text-[14px] text-[#5A5A55] leading-relaxed">
              <span className="block font-medium text-[#252A1A] mb-1">Jane Doe</span>
              123 Fashion Street, Apt 4B<br/>
              Mumbai, Maharashtra 400001<br/>
              Phone: +91 98765 43210
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <h3 className="text-[14px] font-title text-[#252A1A] mb-3">Order Summary</h3>
            <div className="space-y-2 text-[14px] text-[#5A5A55]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-[#E8E5DC] pt-2 mt-2 font-bold text-[#252A1A]">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddressGridView = () => (
    <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Saved Addresses</h2>
        <button 
          onClick={() => setIsAddingAddress(true)}
          className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors"
        >
          + Add address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className="border border-[#E8E5DC] rounded-[16px] p-6 flex flex-col h-full bg-[#FAF9F8]/50 hover:bg-[#FAF9F8] transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#252A1A]">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#686B59] bg-[#F5F3EC] px-2 py-0.5 rounded-[4px]">
                    DEFAULT
                  </span>
                )}
              </div>
            </div>
            <div className="text-[14px] text-[#5A5A55] leading-relaxed flex-1 mb-6">
              <span className="block font-medium text-[#252A1A] mb-1">{addr.name}</span>
              {addr.line1}<br/>
              {addr.city}, {addr.state} {addr.pin}<br/>
              {addr.phone}
            </div>
            <div className="flex items-center gap-5 border-t border-[#E8E5DC] pt-4 mt-auto">
              <button className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors">Edit</button>
              <button className="text-[12px] tracking-wide text-[#b06161] hover:text-[#8c4d4d] transition-colors">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AddressFormView = () => (
    <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#E8E5DC]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E5DC] pb-4 mb-6 gap-4">
        <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A]">Add New Address</h2>
        <button 
          onClick={() => setIsAddingAddress(false)}
          className="text-[12px] tracking-wide text-[#686B59] hover:text-[#252A1A] transition-colors"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-6 w-full max-w-[650px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">First Name</label>
            <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Last Name</label>
            <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Phone Number</label>
          <input type="tel" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
        </div>

        <div className="space-y-2">
          <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Address Line 1</label>
          <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
        </div>
        
        <div className="space-y-2">
          <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Address Line 2 (Optional)</label>
          <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">City</label>
            <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">State</label>
            <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Postal Code</label>
            <input type="text" className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block text-[12px] md:text-[13px] font-bold text-[#686B59] uppercase tracking-wider">Country</label>
            <select className="w-full bg-[#F5F3EC] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[#252A1A] focus:outline-none focus:ring-1 focus:ring-[#8E9476] transition-all appearance-none">
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="defaultAddress" className="w-4 h-4 rounded-[4px] border-[#E8E5DC] text-[#8E9476] focus:ring-[#8E9476]" />
          <label htmlFor="defaultAddress" className="text-[14px] text-[#5A5A55]">Set as default address</label>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setIsAddingAddress(false)} className="bg-[#252A1A] text-white text-[13px] font-bold uppercase tracking-widest px-8 py-3 rounded-[14px] hover:bg-black transition-all">Save Address</button>
          <button type="button" onClick={() => setIsAddingAddress(false)} className="bg-transparent text-[#686B59] border border-[#E8E5DC] text-[13px] font-bold uppercase tracking-widest px-8 py-3 rounded-[14px] hover:bg-[#F5F3EC] transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
        return <AccountDetailsView />;
      case "orders":
        if (selectedOrder) return <OrderDetailsView />;
        return <OrderListView />;
      case "addresses":
        if (isAddingAddress) return <AddressFormView />;
        return <AddressGridView />;
      default:
        return <AccountDetailsView />;
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-[90px] pb-16">
      <Section className="relative overflow-hidden pt-0 md:pt-0">
        <AmbientGlow
          color="bg-[#8E9476]"
          opacity={0.06}
          position="top-[5%] left-[5%]"
          width="w-[50vw]"
          height="h-[50vw]"
          shape="organic1"
        />
        
        <div className="max-w-[1150px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          <div className="w-full mb-10 text-left">
            <h1 className="text-[32px] md:text-[48px] font-title text-[#252A1A] font-medium leading-none tracking-tight">
              My Account
            </h1>
            <p className="text-[17px] md:text-[18px] text-[#686B59] font-sans mt-1.5">
              Welcome back, Jane Doe!
            </p>
            <p className="text-[11px] tracking-[0.1em] text-[#8C867C] uppercase mt-1">
              {MOCK_ORDERS.length} ORDER{MOCK_ORDERS.length !== 1 ? 'S' : ''} &middot; {MOCK_ADDRESSES.length} SAVED ADDRESS{MOCK_ADDRESSES.length !== 1 ? 'ES' : ''} &middot; MEMBER SINCE 2025
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-[250px_minmax(0,850px)] gap-6 lg:gap-7 lg:justify-center">
            
            {/* Sidebar Navigation */}
            <div>
              <div className="flex lg:flex-col overflow-x-auto whitespace-nowrap lg:whitespace-normal pb-4 lg:pb-0 hide-scrollbar gap-1 lg:bg-white lg:rounded-[20px] lg:p-4 lg:border lg:border-[#E8E5DC]">
                
                <button 
                  onClick={() => { setActiveTab("details"); setSelectedOrder(null); setIsAddingAddress(false); }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-[12px] font-medium transition-all shrink-0 lg:shrink-auto ${
                    activeTab === "details" 
                      ? "bg-[#F5F3EC]/70 text-[#252A1A]" 
                      : "text-[#686B59] hover:bg-[#F5F3EC]/50 hover:text-[#252A1A] bg-transparent"
                  }`}
                >
                  <User size={18} strokeWidth={1.5} />
                  Account Details
                </button>

                <button 
                  onClick={() => { setActiveTab("orders"); setSelectedOrder(null); setIsAddingAddress(false); }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-[12px] font-medium transition-all shrink-0 lg:shrink-auto ${
                    activeTab === "orders" 
                      ? "bg-[#F5F3EC]/70 text-[#252A1A]" 
                      : "text-[#686B59] hover:bg-[#F5F3EC]/50 hover:text-[#252A1A] bg-transparent"
                  }`}
                >
                  <Package size={18} strokeWidth={1.5} />
                  Order History
                </button>

                <button 
                  onClick={() => { setActiveTab("addresses"); setSelectedOrder(null); setIsAddingAddress(false); }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-[12px] font-medium transition-all shrink-0 lg:shrink-auto ${
                    activeTab === "addresses" 
                      ? "bg-[#F5F3EC]/70 text-[#252A1A]" 
                      : "text-[#686B59] hover:bg-[#F5F3EC]/50 hover:text-[#252A1A] bg-transparent"
                  }`}
                >
                  <MapPin size={18} strokeWidth={1.5} />
                  Addresses
                </button>
                
                <div className="hidden lg:block h-px bg-[#E8E5DC] my-3"></div>
                
                <button className="flex items-center gap-3 px-4 py-2 rounded-[12px] hover:bg-red-50 text-[#b06161] transition-all shrink-0 lg:shrink-auto">
                  <LogOut size={18} strokeWidth={1.5} />
                  Log Out
                </button>

              </div>
            </div>

            {/* Main Content Area */}
            <div>
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </Section>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
