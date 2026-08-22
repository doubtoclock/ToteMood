"use client";

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Product, products as staticProducts } from "@/lib/data/products";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";

const CACHE_KEY = "totemood_products_cache_v8";
const PRODUCT_LABELS = ["bestseller", "new", "premium"] as const;
const CUSTOMIZATION_CATEGORIES = ["image", "image+text", "no customization"] as const;

function inferCustomizationCategory(product: Product): string {
  const category = String(product.category || "").trim().toLowerCase();
  if ((CUSTOMIZATION_CATEGORIES as readonly string[]).includes(category)) return category;
  if (!product.isCustomizable) return "no customization";

  const searchable = `${product.id} ${product.name} ${product.description}`.toLowerCase();
  return searchable.includes("text") || searchable.includes("emoji") ? "image+text" : "image";
}

function normalizeLabel(product: Product, match?: Product): Product["label"] {
  const rawLabel = String(product.label || product.category || match?.label || "").trim().toLowerCase();
  if ((PRODUCT_LABELS as readonly string[]).includes(rawLabel)) return rawLabel as Product["label"];
  return "new";
}

function getProductGallery(product: Product): string[] {
  let gallery: string[] = [];
  if (product.gallery && product.gallery.length > 0) {
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

  if (product.image && !gallery.includes(product.image)) {
    gallery.unshift(product.image);
  }
  
  if (!gallery.includes("/images/size.png")) {
    gallery.push("/images/size.png");
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
    label: normalizeLabel(product, match),
    category: inferCustomizationCategory(product),
    isCustomizable: inferCustomizationCategory(product) !== "no customization",
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
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeProduct);
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

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiFetch<Product[]>("/api/products");
      const normalized = data.map(normalizeProduct);
      setProducts(normalized);
      writeCache(normalized);
      setError("");
    } catch (err) {
      const fallbackProducts = staticProducts.map(normalizeProduct);
      setProducts(fallbackProducts);
      writeCache(fallbackProducts);
      setError("");
      console.error("Could not load live products, using fallback catalog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      queueMicrotask(() => {
        setProducts(cached);
        setLoading(false);
      });
    }
    void Promise.resolve().then(fetchProducts);
    if (!ENABLE_REALTIME) return;

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ["polling", "websocket"],
    });
    socket.on("connect_error", () => {});
    socket.on("products_updated", fetchProducts);
    return () => {
      socket.disconnect();
    };
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
