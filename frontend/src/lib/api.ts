export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4010";

export const SOCKET_URL = API_BASE_URL;
export const ENABLE_REALTIME = !API_BASE_URL.includes("vercel.app");

export const ADMIN_SESSION_EXPIRED_EVENT = "totemood_admin_expired";

// Paths the backend guards with requireAdmin
function isAdminGatedPath(path: string, method?: string): boolean {
  if (path.startsWith("/api/admin")) return true;
  if (path === "/api/orders") return true;
  if (path.startsWith("/api/products") && (method || "GET") !== "GET") return true;
  return false;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("totemood_admin_token") : null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(adminToken ? { "x-admin-auth": adminToken } : {}),
      ...(init?.headers || {}),
    },
    cache: init?.cache,
  });

  // Admin token rejected/expired — drop the stale session so the UI
  // falls back to the login form instead of a panel full of failed calls
  if (
    res.status === 401 &&
    adminToken &&
    isAdminGatedPath(path, init?.method) &&
    typeof window !== "undefined"
  ) {
    localStorage.removeItem("totemood_admin_token");
    localStorage.removeItem("totemood_admin_auth");
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    const error = new Error(message) as Error & { details?: Record<string, string> };
    error.details = data?.details;
    throw error;
  }

  return data as T;
}
