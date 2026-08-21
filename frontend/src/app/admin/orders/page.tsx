"use client";

import { useState, useEffect } from "react";
import { Eye, Download, User, Phone, MapPin, PackageOpen, Trash2, Loader2, FileSpreadsheet } from "lucide-react";
import Image from "next/image";
import { io } from "socket.io-client";
import { apiFetch, SOCKET_URL } from "@/lib/api";

interface AdminOrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  customImageUrl?: string | null;
  customText?: string | null;
  product?: {
    name?: string;
    image?: string;
  } | null;
}

interface AdminOrder {
  id: string;
  customerEmail: string;
  customerPhone: string;
  customerFirstName: string;
  customerLastName: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerZip: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: AdminOrderItem[];
}

const ORDER_STATUSES = [
  "LIVE",
  "MANIFESTED",
  "SHIPPED",
  "DD",
  "DELIVER",
  "RTO",
  "CANCELLED",
  "SHIP_LATER",
] as const;

function formatOrderStatus(status: string) {
  return status.replace(/_/g, " ");
}

function statusClassName(status: string) {
  switch (status) {
    case "LIVE":
      return "bg-yellow-100 text-yellow-800";
    case "MANIFESTED":
      return "bg-indigo-100 text-indigo-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DD":
      return "bg-cyan-100 text-cyan-800";
    case "DELIVER":
      return "bg-green-100 text-green-800";
    case "RTO":
      return "bg-orange-100 text-orange-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "SHIP_LATER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial orders
    apiFetch<AdminOrder[]>('/api/orders')
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Setup Socket.IO connection
    const socket = io(SOCKET_URL);

    socket.on("new_order", (order: AdminOrder) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("order_updated", (updatedOrder: AdminOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      setSelectedOrder(prev => (prev?.id === updatedOrder.id ? updatedOrder : prev));
    });

    socket.on("order_deleted", (deletedId: string) => {
      setOrders(prev => prev.filter(o => o.id !== deletedId));
      setSelectedOrder(prev => (prev?.id === deletedId ? null : prev));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/orders/${id}`, {
        method: 'DELETE'
      });
      // UI updates automatically via WebSocket
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/api/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      // UI updates automatically via WebSocket
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Status", "First Name", "Last Name", "Email", "Phone", "Address", "City", "State", "Zip", "Subtotal", "Shipping", "Total", "Items", "Product Names"];
    const rows = orders.map(order => [
      order.id,
      new Date(order.createdAt).toISOString(),
      formatOrderStatus(order.status),
      order.customerFirstName,
      order.customerLastName,
      order.customerEmail,
      order.customerPhone,
      order.customerAddress,
      order.customerCity,
      order.customerState,
      order.customerZip,
      order.subtotal.toFixed(2),
      order.shipping.toFixed(2),
      order.total.toFixed(2),
      order.items.length,
      order.items.map(i => `${i.product?.name || 'Unknown'} x${i.quantity}`).join("; ")
    ]);

    const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `totemood-orders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8 text-[#5A5A55] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading orders...</div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1C1A]">Orders</h1>
          <p className="text-[#5A5A55] mt-2">Manage incoming orders, customer details, and custom image uploads.</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#757D5C] text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5C6348] transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download CSV
          </button>
        )}
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
              <tr key={order.id} className={`border-b border-[#1C1C1A]/5 hover:bg-[#F8F6EF]/20 transition-colors ${deletingId === order.id ? 'opacity-50' : ''}`}>
                <td className="p-4 text-sm font-medium text-[#1C1C1A]">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-[#1C1C1A]">{order.customerFirstName} {order.customerLastName}</div>
                  <div className="text-xs text-[#5A5A55]">{order.customerEmail}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${statusClassName(order.status)}`}>
                    {updatingId === order.id && <Loader2 className="w-3 h-3 animate-spin" />}
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#5A5A55]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm font-bold text-[#1C1C1A]">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    disabled={deletingId === order.id}
                    className="p-2 text-[#757D5C] hover:text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button 
                    onClick={() => handleDelete(order.id)}
                    disabled={deletingId === order.id}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {deletingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-[#1C1C1A]/10 rounded-xl">
                        <div className="w-16 h-16 relative rounded-lg bg-[#EAECE3] overflow-hidden shrink-0">
                          <Image src={item.product?.image || ''} alt={item.product?.name || 'Product'} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[#1C1C1A]">{item.product?.name || 'Unknown Product'}</div>
                          <div className="text-sm text-[#5A5A55]">Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}</div>
                          {item.customText && (
                            <div className="text-xs text-[#5A5A55] mt-1">Text: {item.customText}</div>
                          )}
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
                  <div className="flex justify-between text-sm font-bold text-[#757D5C]">
                    <span>Paid online</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1C1C1A]">
                    <span>Cash on delivery</span>
                    <span>₹{Math.max(0, selectedOrder.total - 50).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Custom Images & Status */}
            <div className="w-full md:w-80 bg-[#F8F6EF] p-8 flex flex-col relative">
              {updatingId === selectedOrder.id && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-r-2xl">
                  <Loader2 className="w-8 h-8 text-[#757D5C] animate-spin" />
                </div>
              )}
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] mb-6 flex items-center gap-2">
                <PackageOpen className="w-4 h-4" /> Custom Uploads
              </h3>
              
              <div className="flex-1 space-y-6">
                {selectedOrder.items.filter((i) => Boolean(i.customImageUrl)).map((item, idx) => {
                  const customImageUrl = item.customImageUrl || "";
                  return (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-[#1C1C1A]/10 shadow-sm">
                    <div className="text-xs font-medium text-[#1C1C1A] mb-2 truncate" title={item.product?.name}>
                      For: {item.product?.name}
                    </div>
                    {item.customText && (
                      <div className="text-xs text-[#5A5A55] mb-2 break-words">Text: {item.customText}</div>
                    )}
                    <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-[#EAECE3] border border-[#1C1C1A]/5 mb-3">
                      <Image src={customImageUrl} alt="Custom upload" fill className="object-cover" />
                    </div>
                    <a 
                      href={customImageUrl} 
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#757D5C] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#5C6348] transition-colors"
                    >
                      <Download className="w-3 h-3" /> Download Design
                    </a>
                  </div>
                  );
                })}
                
                {selectedOrder.items.filter((i) => i.customImageUrl).length === 0 && (
                  <div className="text-sm text-[#5A5A55] text-center p-4 border border-dashed border-[#1C1C1A]/20 rounded-xl">
                    No custom images for this order.
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-[#1C1C1A]/10">
                <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Update Status</label>
                <select 
                  className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  disabled={updatingId === selectedOrder.id}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{formatOrderStatus(status)}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
