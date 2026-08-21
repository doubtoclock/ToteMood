"use client";

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Product, products as staticProducts } from "@/lib/data/products";
import { apiFetch, SOCKET_URL } from "@/lib/api";

const CACHE_KEY = "totemood_products_cache_v5";

function getProductGallery(product: Product): string[] {
  let gallery: string[] = [];
  if (product.gallery && product.gallery.length > 1) {
    gallery = [...product.gallery];
  } else {
    const match = staticProducts.find(
      (p) => p.id === product.id || p.name.toLowerCase() === product.name?.toLowerCase()
    );
    if (match?.gallery && match.gallery.length > 0) {
      gallery = [...match.gallery];
    } else {
      const image = product.image || "";
      const matchW = image.match(/W(\d+)\.png/i);
      if (matchW) {
        const num = parseInt(matchW[1], 10);
        const baseGroup = Math.floor((num - 1) / 4) * 4 + 1;
        gallery = [
          `/images/product/W${baseGroup}.png`,
          `/images/product/W${baseGroup + 1}.png`,
          `/images/product/W${baseGroup + 2}.png`,
          `/images/product/W${baseGroup + 3}.png`,
        ];
      } else {
        gallery = [image];
      }
    }
  }
  
  if (!gallery.includes("/images/size.jpeg")) {
    gallery.push("/images/size.jpeg");
  }
  
  return gallery;
}

function normalizeProduct(product: Product): Product {
  const oldPrice = product.oldPrice ?? product.originalPrice ?? null;
  const match = staticProducts.find(
    (p) => p.id === product.id || p.name.toLowerCase() === product.name?.toLowerCase()
  );
  return {
    ...product,
    description: match?.description ?? product.description,
    oldPrice,
    originalPrice: oldPrice ?? undefined,
    rating: product.rating ?? match?.rating ?? 4.8,
    reviews: product.reviews ?? match?.reviews ?? 120,
    gallery: getProductGallery(product),
  };
}

function readCache(): Product[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeCache(products: Product[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch {
    // storage full or unavailable
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setProducts(cached);
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiFetch<Product[]>("/api/products");
      const normalized = data.map(normalizeProduct);
      setProducts(normalized);
      writeCache(normalized);
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
