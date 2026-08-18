"use client";

import { useState, useEffect } from "react";
import { Eye, Download, User, Phone, MapPin, PackageOpen } from "lucide-react";
import Image from "next/image";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-[#5A5A55]">Loading orders...</div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1C1A]">Orders (KOT)</h1>
          <p className="text-[#5A5A55] mt-2">Manage incoming orders, customer details, and custom image uploads.</p>
        </div>
      </div>

      <div className="bg-white border border-[#1C1C1A]/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1C1C1A]/10 bg-[#F8F6EF]/50">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Order ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Customer</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Total</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#1C1C1A]/5 hover:bg-[#F8F6EF]/20 transition-colors">
                <td className="p-4 text-sm font-medium text-[#1C1C1A]">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-[#1C1C1A]">{order.customerFirstName} {order.customerLastName}</div>
                  <div className="text-xs text-[#5A5A55]">{order.customerEmail}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#5A5A55]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm font-bold text-[#1C1C1A]">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-[#757D5C] hover:text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#5A5A55]">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            
            {/* Left side: Order details */}
            <div className="flex-1 p-8 border-r border-[#1C1C1A]/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-serif text-[#1C1C1A]">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                  <p className="text-sm text-[#5A5A55]">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F6EF] text-[#1C1C1A] hover:bg-[#EAECE3]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-[#F8F6EF] p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] mb-2">Customer Info</h3>
                  <div className="flex items-center gap-3 text-sm text-[#1C1C1A]">
                    <User className="w-4 h-4 text-[#757D5C]" />
                    {selectedOrder.customerFirstName} {selectedOrder.customerLastName} ({selectedOrder.customerEmail})
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1C1C1A]">
                    <Phone className="w-4 h-4 text-[#757D5C]" />
                    {selectedOrder.customerPhone}
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#1C1C1A]">
                    <MapPin className="w-4 h-4 text-[#757D5C] shrink-0 mt-0.5" />
                    <div>
                      {selectedOrder.customerAddress}<br />
                      {selectedOrder.customerCity}, {selectedOrder.customerState} {selectedOrder.customerZip}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-[#1C1C1A]/10 rounded-xl">
                        <div className="w-16 h-16 relative rounded-lg bg-[#EAECE3] overflow-hidden shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[#1C1C1A]">{item.product.name}</div>
                          <div className="text-sm text-[#5A5A55]">Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}</div>
                        </div>
                        <div className="font-bold text-[#1C1C1A]">
                          ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-[#1C1C1A]/10">
                  <div className="flex justify-between text-sm text-[#5A5A55]">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#5A5A55]">
                    <span>Shipping</span>
                    <span>₹{selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#1C1C1A] pt-2">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Custom Images / KOT status */}
            <div className="w-full md:w-80 bg-[#F8F6EF] p-8 flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] mb-6 flex items-center gap-2">
                <PackageOpen className="w-4 h-4" /> Custom Uploads
              </h3>
              
              <div className="flex-1 space-y-6">
                {selectedOrder.items.filter((i: any) => i.customImageUrl).map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-[#1C1C1A]/10 shadow-sm">
                    <div className="text-xs font-medium text-[#1C1C1A] mb-2 truncate" title={item.product.name}>
                      For: {item.product.name}
                    </div>
                    <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-[#EAECE3] border border-[#1C1C1A]/5 mb-3">
                      <Image src={item.customImageUrl} alt="Custom upload" fill className="object-cover" />
                    </div>
                    <a 
                      href={item.customImageUrl} 
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#757D5C] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#5C6348] transition-colors"
                    >
                      <Download className="w-3 h-3" /> Download Design
                    </a>
                  </div>
                ))}
                
                {selectedOrder.items.filter((i: any) => i.customImageUrl).length === 0 && (
                  <div className="text-sm text-[#5A5A55] text-center p-4 border border-dashed border-[#1C1C1A]/20 rounded-xl">
                    No custom images for this order.
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-[#1C1C1A]/10">
                <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Update Status</label>
                <select 
                  className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]"
                  defaultValue={selectedOrder.status}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
