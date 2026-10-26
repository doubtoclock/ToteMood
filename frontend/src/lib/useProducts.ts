"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Product, products as staticProducts } from "@/lib/data/products";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";

const PRODUCT_LABELS = ["bestseller", "new", "premium"] as const;
const CUSTOMIZATION_CATEGORIES = ["image", "text", "image+text", "no customization"] as const;

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductListResponse {
  items: Product[];
  pagination: Pagination;
}

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "name-asc";
  availability?: "all" | "in-stock";
  ids?: string[];
  details?: boolean;
}

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
    reviews: Number.isInteger(product.reviews) && product.reviews >= 0 ? product.reviews : (match?.reviews ?? 0),
    gallery: getProductGallery(product),
  };
}

function productQueryPath(query: ProductQuery) {
  // Full galleries belong to one product-detail response, never a public
  // catalog list. This keeps homepage/shop/card fetches compact.
  if (query.details && query.ids?.length === 1) {
    return `/api/products/${encodeURIComponent(query.ids[0]!)}`;
  }
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("pageSize", String(query.pageSize ?? 12));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.availability) params.set("availability", query.availability);
  if (query.ids?.length) params.set("ids", [...new Set(query.ids)].join(","));
  return `/api/products?${params.toString()}`;
}

export function useProducts(query: ProductQuery = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const requestVersion = useRef(0);
  // This is a primitive value, so callbacks/effects only change when the
  // effective request changes even if a caller creates a new query object.
  const path = productQueryPath(query);
  const isProductDetail = query.details === true && query.ids?.length === 1;

  const fetchProducts = useCallback(async () => {
    const version = ++requestVersion.current;
    setLoading(true);
    try {
      const data = isProductDetail
        ? await apiFetch<Product>(path, { cache: "no-store" })
        : await apiFetch<ProductListResponse>(path, { cache: "no-store" });
      if (version !== requestVersion.current) return;
      const items = isProductDetail ? [data as Product] : (data as ProductListResponse).items;
      const normalized = items.map(normalizeProduct);
      setProducts(normalized);
      setPagination(isProductDetail ? null : (data as ProductListResponse).pagination);
      setError("");
    } catch (err) {
      if (version !== requestVersion.current) return;
      setError(err instanceof Error ? err.message : "Could not refresh products.");
      console.error("Could not load products:", err);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [isProductDetail, path]);

  useEffect(() => {
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

  return { products, loading, error, pagination, refetch: fetchProducts };
}
