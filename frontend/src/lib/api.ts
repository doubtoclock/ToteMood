export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4010";

export const SOCKET_URL = API_BASE_URL;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: init?.cache,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    const error = new Error(message) as Error & { details?: Record<string, string> };
    error.details = data?.details;
    throw error;
  }

  return data as T;
}
