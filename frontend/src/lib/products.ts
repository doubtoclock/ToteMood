export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  originalPrice?: number | null;
  image: string;
  gallery?: string[];
  isCustomizable: boolean;
  category: string;
  inventoryCount: number;
  rating: number;
  reviews: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
type ProductPayload = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asProductPayload(product: unknown): ProductPayload {
  return product && typeof product === "object" ? product as ProductPayload : {};
}

function getProductArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.products)) {
    return record.products;
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  return [];
}

export function normalizeProduct(rawProduct: unknown): Product {
  const product = asProductPayload(rawProduct);
  const oldPrice = product.oldPrice ?? product.originalPrice ?? null;
  const image = typeof product.image === "string" && product.image
    ? product.image
    : "/images/product_mockup.png";

  return {
    id: String(product.id),
    name: typeof product.name === "string" && product.name ? product.name : "Untitled product",
    description: typeof product.description === "string" ? product.description : "",
    price: toNumber(product.price),
    oldPrice: oldPrice === null ? null : toNumber(oldPrice),
    originalPrice: oldPrice === null ? null : toNumber(oldPrice),
    image,
    gallery: Array.isArray(product.gallery)
      ? product.gallery.filter((item): item is string => typeof item === "string")
      : [image],
    isCustomizable: Boolean(product.isCustomizable),
    category: typeof product.category === "string" && product.category ? product.category : "Custom Totes",
    inventoryCount: toNumber(product.inventoryCount),
    rating: toNumber(product.rating, 4.8),
    reviews: toNumber(product.reviews, 128),
  };
}

export function normalizeProductsPayload(payload: unknown): Product[] {
  return getProductArray(payload).map(normalizeProduct);
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
  const payload = await res.json();

  if (!res.ok) {
    const error = asProductPayload(payload).error;
    throw new Error(typeof error === "string" ? error : "Failed to fetch products");
  }

  return normalizeProductsPayload(payload);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { cache: "no-store" });
  const payload = await res.json();

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const error = asProductPayload(payload).error;
    throw new Error(typeof error === "string" ? error : "Failed to fetch product");
  }

  return normalizeProduct(payload);
}
