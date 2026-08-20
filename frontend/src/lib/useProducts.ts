"use client";

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Product } from "@/lib/data/products";
import { apiFetch, SOCKET_URL } from "@/lib/api";

function normalizeProduct(product: Product): Product {
  const oldPrice = product.oldPrice ?? product.originalPrice ?? null;
  return {
    ...product,
    oldPrice,
    originalPrice: oldPrice ?? undefined,
    rating: product.rating ?? 4.8,
    reviews: product.reviews ?? 0,
    gallery: product.gallery?.length ? product.gallery : [product.image],
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiFetch<Product[]>("/api/products");
      setProducts(data.map(normalizeProduct));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
    const socket = io(SOCKET_URL);
    socket.on("products_updated", fetchProducts);
    return () => {
      socket.disconnect();
    };
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
