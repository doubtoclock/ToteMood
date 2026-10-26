"use client";

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      const result = await apiFetch<StoreCategory[]>("/api/categories");
      setCategories(result);
      setError("");
    } catch (cause) {
      setCategories([]);
      setError(cause instanceof Error ? cause.message : "Could not load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertCategory = useCallback((nextCategory: StoreCategory) => {
    setCategories((current) => [...current.filter((category) => category.id !== nextCategory.id), nextCategory]
      .sort((left, right) => left.name.localeCompare(right.name)));
    setError("");
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories((current) => current.filter((category) => category.id !== id));
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refetch);
    if (!ENABLE_REALTIME) return;
    const socket = io(SOCKET_URL, { reconnection: true, reconnectionAttempts: 10, transports: ["polling", "websocket"] });
    socket.on("connect_error", () => {});
    socket.on("categories_updated", refetch);
    return () => { socket.disconnect(); };
  }, [refetch]);

  return { categories, loading, error, refetch, upsertCategory, removeCategory };
}
