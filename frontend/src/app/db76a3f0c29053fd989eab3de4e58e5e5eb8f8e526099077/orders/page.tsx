"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileSpreadsheet,
  IndianRupee,
  Loader2,
  MapPin,
  PackageOpen,
  Pencil,
  Phone,
  Trash2,
  TriangleAlert,
  User,
  X,
  Check,
} from "lucide-react";
import Image from "next/image";
import { io } from "socket.io-client";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  customImageUrl: string | null;
  customText: string | null;
  product?: { name?: string; image?: string } | null;
}

interface Order {
  id: string;
  displayId: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paidAmount: number;
  codBalance: number;
  paymentStatus: string;
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
  items: OrderItem[];
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OrderListResponse {
  items: Order[];
  pagination: Pagination;
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

function toISTParts(iso: string) {
  const date = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(date),
    timeOfDay: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).format(date),
    full: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date),
    dateTime: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(date),
  };
}

function istDateKey(iso: string) {
  const [dd, mm, yyyy] = toISTParts(iso).day.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

function paymentLabel(status: string) {
  switch (status) {
    case "paid":
      return { label: "PAID", className: "bg-[#E4F2E5] text-[#2E7D3F]" };
    case "partial":
      return { label: "PARTIAL", className: "bg-[#FFF4DC] text-[#9A6B00]" };
    case "pending":
      return { label: "PENDING", className: "bg-[#FFE8E5] text-[#C2402E] font-bold" };
    default:
      return { label: (status || "?").toUpperCase(), className: "bg-[#F0EFEA] text-[#5A5A55]" };
  }
}

const currency = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function buildCsv(orders: Order[]): string {
  const header = [
    "Display ID",
    "Date (IST)",
    "Customer",
    "Email",
    "Phone",
    "Address",
    "City",
    "State",
    "Zip",
    "Payment",
    "Paid (INR)",
    "Balance (INR)",
    "Subtotal (INR)",
    "Shipping (INR)",
    "Total (INR)",
    "Items",
    "Razorpay Order ID",
    "Razorpay Payment ID",
    "Created (IST)",
  ].join(",");

  const sorted = [...orders].sort((a, b) => Number(a.displayId) - Number(b.displayId));

  const rows = sorted.map((order) => {
    const parts = toISTParts(order.createdAt);
    const items = order.items
      .map((item) => `${item.product?.name || item.productId} x${item.quantity}`)
      .join("; ");
    return [
      order.displayId,
      parts.day,
      escapeCsv(`${order.customerFirstName} ${order.customerLastName}`.trim()),
      escapeCsv(order.customerEmail),
      escapeCsv(order.customerPhone),
      escapeCsv(order.customerAddress),
      escapeCsv(order.customerCity),
      escapeCsv(order.customerState),
      escapeCsv(order.customerZip),
      escapeCsv(paymentLabel(order.paymentStatus).label),
      currency(order.paidAmount),
      currency(order.codBalance),
      currency(order.subtotal),
      currency(order.shipping),
      currency(order.total),
      escapeCsv(items),
      order.razorpayOrderId || "",
      order.razorpayPaymentId || "",
      parts.timeOfDay,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

function downloadCsv(dateKey: string, orders: Order[]) {
  const csv = buildCsv(orders);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `totemood-orders-${dateKey}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingDisplayId, setEditingDisplayId] = useState<string | null>(null);
  const [displayIdInput, setDisplayIdInput] = useState("");
  const [displayIdError, setDisplayIdError] = useState("");

  const fetchOrders = useCallback(() => {
    apiFetch<OrderListResponse>(`/api/orders?page=${page}&pageSize=25`)
      .then((data) => {
        setOrders(data.items);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders."));
  }, [page]);

  useEffect(() => {
    fetchOrders();

    if (!ENABLE_REALTIME) return;

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ["polling", "websocket"],
    });
    socket.on("connect_error", () => {});

    // Re-read only the active page after a change. Prepending or mutating a
    // local page can otherwise duplicate rows or shift pagination boundaries.
    socket.on("new_order", fetchOrders);
    socket.on("order_updated", fetchOrders);
    socket.on("order_deleted", fetchOrders);

    return () => {
      socket.disconnect();
    };
  }, [fetchOrders]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/orders/${id}`, { method: "DELETE" });
      setOrders((current) => current?.filter((order) => order.id !== id) ?? current);
      setSelectedOrder((current) => current?.id === id ? null : current);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const updated = await apiFetch<Order>(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((current) => current?.map((order) => order.id === updated.id ? updated : order) ?? current);
      setSelectedOrder((current) => current?.id === updated.id ? updated : current);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateDisplayId = async (orderId: string) => {
    if (!/^\d{6}$/.test(displayIdInput)) {
      setDisplayIdError("Must be exactly 6 digits.");
      return;
    }
    setUpdatingId(orderId);
    setDisplayIdError("");
    try {
      const updated = await apiFetch<Order>(`/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ displayId: displayIdInput }),
      });
      setOrders((current) => current?.map((order) => order.id === updated.id ? updated : order) ?? current);
      setSelectedOrder((current) => current?.id === updated.id ? updated : current);
      setEditingDisplayId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update Order ID.";
      setDisplayIdError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const groups = useMemo(() => {
    const all = orders ?? [];
    const bucket = new Map<string, Order[]>();
    for (const order of all) {
      const key = istDateKey(order.createdAt);
      bucket.set(key, [...(bucket.get(key) || []), order]);
    }
    return [...bucket.entries()].sort(([a], [b]) => (a < b ? 1 : -1));
  }, [orders]);

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">Failed to load orders: {error}</div>;
  }
  if (!orders) {
    return (
      <div className="p-8 text-[#5A5A55] flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1C1A]">Orders</h1>
          <p className="text-[#5A5A55] mt-2">
            Manage incoming orders, customer details, and custom image uploads.
          </p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => downloadCsv(istDateKey(new Date().toISOString()), orders)}
            className="flex items-center gap-2 bg-[#757D5C] text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5C6348] transition-colors"
            title="Download all orders as CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download this page
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <p className="p-8 text-center text-[#5A5A55]">No orders found.</p>
      )}

      {groups.map(([dateKey, dayOrders]) => {
        const revenue = dayOrders.reduce((sum, o) => sum + o.paidAmount, 0);
        const pendingCount = dayOrders.filter((o) => o.paymentStatus === "pending").length;
        return (
          <section key={dateKey} className="bg-white rounded-2xl border border-[#1C1C1A]/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1C1C1A]/10 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-lg font-serif text-[#1C1C1A]">{toISTParts(dayOrders[0].createdAt).full}</h2>
                <p className="text-sm text-[#5A5A55]">
                  {dayOrders.length} order{dayOrders.length === 1 ? "" : "s"} · ₹{currency(revenue)} collected
                  {pendingCount > 0 && (
                    <span className="text-[#C2402E] font-semibold"> · {pendingCount} pending</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadCsv(dateKey, dayOrders)}
                className="inline-flex items-center gap-2 bg-[#1C1C1A] text-white px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#8C867C] border-b border-[#1C1C1A]/10">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Time (IST)</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dayOrders.map((order) => {
                    const pay = paymentLabel(order.paymentStatus);
                    return (
                      <tr key={order.id} className="border-b border-[#1C1C1A]/5 hover:bg-[#FAF9F8]">
                        <td className="px-6 py-3 font-semibold text-[#1C1C1A]">#{order.displayId}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#1C1C1A]">
                            {order.customerFirstName} {order.customerLastName}
                          </div>
                          <div className="text-xs text-[#8C867C]">{order.customerEmail}</div>
                          <div className="text-xs text-[#8C867C]">{order.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-[#5A5A55] whitespace-nowrap">
                              {item.product?.name || item.productId} × {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${statusClassName(order.status)}`}>
                            {updatingId === order.id && <Loader2 className="w-3 h-3 animate-spin" />}
                            {formatOrderStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${pay.className}`}>
                            {order.paymentStatus === "pending" && <TriangleAlert className="w-3 h-3" />}
                            {pay.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#1C1C1A]">
                          <IndianRupee className="inline w-3 h-3" />
                          {currency(order.total)}
                        </td>
                        <td className="px-4 py-3 text-right text-[#5A5A55]">{toISTParts(order.createdAt).timeOfDay}</td>
                        <td className="px-4 py-3 text-right space-x-1">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Order pages" className="flex items-center justify-center gap-3">
          <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-[#1C1C1A]/20 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <span className="text-sm text-[#5A5A55]">Page {pagination.page} of {pagination.totalPages} · {pagination.total} orders</span>
          <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-xl bg-[#1C1C1A] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      )}

      <p className="text-xs text-[#8C867C]">
        Times shown in IST (Supabase stores timestamps in UTC).
      </p>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            <div className="flex-1 p-8 border-r border-[#1C1C1A]/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-serif text-[#1C1C1A]">Order #{selectedOrder.displayId}</h2>
                  <p className="text-sm text-[#5A5A55]">{toISTParts(selectedOrder.createdAt).dateTime}</p>
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
                          <Image src={item.product?.image || ""} alt={item.product?.name || "Product"} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[#1C1C1A]">{item.product?.name || "Unknown Product"}</div>
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
                  <div className="flex justify-between text-sm font-bold text-[#2E7D3F]">
                    <span>Paid online</span>
                    <span>₹{selectedOrder.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1C1C1A]">
                    <span>Cash on delivery</span>
                    <span>₹{selectedOrder.codBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${paymentLabel(selectedOrder.paymentStatus).className}`}>
                      {selectedOrder.paymentStatus === "pending" && <TriangleAlert className="w-3 h-3" />}
                      Payment: {paymentLabel(selectedOrder.paymentStatus).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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

              <div className="mt-6 pt-6 border-t border-[#1C1C1A]/10">
                <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Order ID</label>
                {editingDisplayId === selectedOrder.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={displayIdInput}
                        onChange={(e) => { setDisplayIdInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setDisplayIdError(""); }}
                        maxLength={6}
                        className="flex-1 bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-2 text-[#1C1C1A] text-sm font-mono focus:outline-none focus:border-[#757D5C]"
                        placeholder="000000"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateDisplayId(selectedOrder.id)}
                        disabled={updatingId === selectedOrder.id}
                        className="p-2 bg-[#757D5C] text-white rounded-xl hover:bg-[#5C6348] transition-colors disabled:opacity-50"
                      >
                        {updatingId === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setEditingDisplayId(null); setDisplayIdError(""); }}
                        className="p-2 bg-[#EAECE3] text-[#5A5A55] rounded-xl hover:bg-[#E2E4DA] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {displayIdError && <p className="text-xs text-red-500">{displayIdError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-[#1C1C1A]">#{selectedOrder.displayId}</span>
                    <button
                      onClick={() => { setEditingDisplayId(selectedOrder.id); setDisplayIdInput(selectedOrder.displayId); setDisplayIdError(""); }}
                      className="p-1.5 text-[#5A5A55] hover:text-[#1C1C1A] hover:bg-white rounded-lg transition-colors"
                      title="Edit Order ID"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
