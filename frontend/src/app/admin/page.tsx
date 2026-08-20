"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, IndianRupee, Package } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
}

interface RevenuePoint {
  date: string;
  revenue: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1C1A] text-white px-4 py-2.5 rounded-xl shadow-lg text-sm">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="font-bold">₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<AdminStats>("/api/admin/stats"),
      apiFetch<RevenuePoint[]>("/api/admin/revenue-chart"),
    ])
      .then(([statsData, chart]) => {
        setStats(statsData);
        setChartData(chart);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-[#5A5A55]">Loading dashboard...</div>;
  }

  const metricCards = [
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      accent: "bg-[#757D5C]/10 text-[#757D5C]",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      accent: "bg-[#1C1C1A]/5 text-[#1C1C1A]",
    },
    {
      label: "Active Products",
      value: stats?.activeProducts ?? 0,
      icon: Package,
      accent: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#1C1C1A]">Dashboard</h1>
        <p className="text-[#5A5A55] mt-2">Welcome back to the ToteMood admin panel.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.accent}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#5A5A55] uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-serif text-[#1C1C1A] mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-serif text-[#1C1C1A]">Revenue Over Time</h2>
          <p className="text-sm text-[#5A5A55] mt-1">Completed orders revenue by day</p>
        </div>
        {chartData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-[#5A5A55] text-sm">
            No completed orders yet. Revenue data will appear here once orders are marked as completed.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#757D5C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#757D5C" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#5A5A55" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E5E0" }}
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5A5A55" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#757D5C"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: "#757D5C", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#757D5C", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
