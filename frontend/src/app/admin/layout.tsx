"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Lock } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("totemood_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for now
    if (password === "admin123") {
      localStorage.setItem("totemood_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("totemood_admin_auth");
    setIsAuthenticated(false);
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Still checking auth state
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center">Loading...</div>;
  }

  // Not authenticated -> Show Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-lg max-w-md w-full border border-[#1C1C1A]/10 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-[#F8F6EF] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1C1C1A]">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-[#1C1C1A] mb-2">Admin Login</h1>
          <p className="text-[#5A5A55] text-sm mb-8">Enter your password to access the dashboard.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F6EF] border border-[#1C1C1A]/10 rounded-xl px-4 py-4 text-[#1C1C1A] focus:outline-none focus:border-[#757D5C]"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-[#1C1C1A] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-[#5A5A55] mt-8">Default password: <b>admin123</b></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6EF] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#1C1C1A]/10 flex flex-col fixed inset-y-0 z-10">
        <div className="p-6 border-b border-[#1C1C1A]/10">
          <Link href="/" className="text-2xl font-serif text-[#1C1C1A] tracking-tighter hover:opacity-80 transition-opacity">
            Tote<span className="italic font-light">Mood</span>
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-[#757D5C] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#757D5C] text-white"
                    : "text-[#5A5A55] hover:bg-[#F8F6EF] hover:text-[#1C1C1A]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1C1C1A]/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#E53E3E] hover:bg-[#FFF5F5] w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-w-0">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
