export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#1C1C1A]">Dashboard</h1>
        <p className="text-[#5A5A55] mt-2">Welcome back to the ToteMood admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm">
          <h3 className="text-sm font-medium text-[#5A5A55] uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-serif text-[#1C1C1A]">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm">
          <h3 className="text-sm font-medium text-[#5A5A55] uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-serif text-[#1C1C1A]">₹0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm">
          <h3 className="text-sm font-medium text-[#5A5A55] uppercase tracking-wider mb-2">Active Products</h3>
          <p className="text-3xl font-serif text-[#1C1C1A]">0</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#1C1C1A]/10 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-[#5A5A55]">Recent Activity Chart Placeholder</p>
      </div>
    </div>
  );
}
