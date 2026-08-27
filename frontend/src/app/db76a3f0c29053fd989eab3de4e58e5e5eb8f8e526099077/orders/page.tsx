"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, IndianRupee, ShoppingBag, TriangleAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  customImageUrl: string | null;
  customText: string | null;
  product?: { name?: string } | null;
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
  customerCity: string;
  customerState: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const IST = { timeZone: "Asia/Kolkata" } as const;

function toISTParts(iso: string) {
  const date = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(date),
    timeOfDay: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).format(date),
    full: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date),
  };
}

function istDateKey(iso: string) {
  // "26/08/2026" -> "2026-08-26"
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
    "City",
    "State",
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

  const rows = orders.map((order) => {
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
      escapeCsv(order.customerCity),
      escapeCsv(order.customerState),
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
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Order[]>("/api/admin/orders")
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders."));
  }, []);

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
    return <div className="p-8 text-[#5A5A55]">Loading orders...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="p-8 text-[#5A5A55]">
        <h1 className="text-3xl font-serif text-[#1C1C1A] mb-2">Orders</h1>
        <p>No orders have been placed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-[#1C1C1A]">Orders</h1>
        <p className="text-[#5A5A55] mt-2">
          Grouped by day in India Standard Time. Download a CSV per day.
        </p>
      </div>

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
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Time (IST)</th>
                  </tr>
                </thead>
                <tbody>
                  {dayOrders.map((order) => {
                    const pay = paymentLabel(order.paymentStatus);
                    return (
                      <tr key={order.id} className="border-b border-[#1C1C1A]/5 hover:bg-[#FAF9F8]">
                        <td className="px-6 py-3 font-semibold text-[#1C1C1A]">{order.displayId}</td>
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
                        <td className="px-4 py-3 text-right font-semibold text-[#2E7D3F]">
                          <IndianRupee className="inline w-3 h-3" />
                          {currency(order.paidAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-[#5A5A55]">
                          {order.codBalance > 0 ? (
                            <>
                              <IndianRupee className="inline w-3 h-3" />
                              {currency(order.codBalance)}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#1C1C1A]">
                          <IndianRupee className="inline w-3 h-3" />
                          {currency(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${pay.className}`}>
                            {order.paymentStatus === "pending" && <TriangleAlert className="w-3 h-3" />}
                            {pay.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-[#5A5A55]">{toISTParts(order.createdAt).timeOfDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <p className="text-xs text-[#8C867C]">
        Times shown in IST (Supabase stores timestamps in UTC).
      </p>
    </div>
  );
}