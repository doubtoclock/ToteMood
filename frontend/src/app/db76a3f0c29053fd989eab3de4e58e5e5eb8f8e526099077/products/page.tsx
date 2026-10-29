"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload, ImageIcon, Loader2 } from "lucide-react";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";
import { io } from "socket.io-client";
import { compressImageForUpload } from "@/lib/imageCompression";
import { useCategories } from "@/lib/useCategories";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  gallery?: string[];
  galleryCount?: number;
  isCustomizable: boolean;
  label: "bestseller" | "new" | "premium";
  category: string;
  inventoryCount: number;
  reviews: number;
  categoryIds?: string[];
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductListResponse {
  items: AdminProduct[];
  pagination: Pagination;
}

const MAX_GALLERY_IMAGES = 8;
const PAYLOAD_WARNING_BYTES = 5 * 1024 * 1024;

function estimateJsonBytes(value: unknown) {
  return new Blob([JSON.stringify(value)]).size;
}

const normalizeAdminLabel = (product: AdminProduct): AdminProduct["label"] => {
  const value = String(product.label || product.category || "").trim().toLowerCase();
  return value === "bestseller" || value === "premium" || value === "new" ? value : "new";
};

const normalizeAdminCategory = (product: AdminProduct) => {
  const value = String(product.category || "").trim().toLowerCase().replace(/\s*\+\s*/g, "+");
  if (value === "image" || value === "text" || value === "image+text" || value === "no customization") return value;
  if (!product.isCustomizable) return "no customization";

  const searchable = `${product.id} ${product.name} ${product.description}`.toLowerCase();
  return searchable.includes("text") || searchable.includes("emoji") ? "image+text" : "image";
};

export default function AdminProducts() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [label, setLabel] = useState<AdminProduct["label"]>("new");
  const [category, setCategory] = useState("image");
  const [inventoryCount, setInventoryCount] = useState("0");
  const [reviews, setReviews] = useState("0");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [originalImages, setOriginalImages] = useState<{ image: string; gallery: string[] }>({ image: "", gallery: [] });
  const [originalCategoryIds, setOriginalCategoryIds] = useState<string[]>([]);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useBodyScrollLock(isModalOpen);

  const fetchProducts = useCallback((showSpinner = true) => {
    if (showSpinner) setLoading(true);
    apiFetch<ProductListResponse>(`/api/admin/products?page=${page}&pageSize=24`)
      .then(data => {
        setProducts(data.items);
        setPagination(data.pagination);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProducts(true));
    if (!ENABLE_REALTIME) return;

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ["polling", "websocket"],
    });
    socket.on("connect_error", () => {});
    // Refresh quietly so a save elsewhere does not replace the table with a
    // full-page spinner.
    socket.on("products_updated", () => fetchProducts(false));
    return () => {
      socket.disconnect();
    };
  }, [fetchProducts]);

  useEffect(() => {
    if (pagination && page > pagination.totalPages) setPage(pagination.totalPages);
  }, [pagination, page]);

  const processCoverFile = async (file: File) => {
    try {
      const result = await compressImageForUpload(file);
      setImage(result);
      setImagePreview(result);
      setGallery((current) => current.length > 0 ? [result, ...current.filter((item) => item !== result)] : [result]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not upload this image.");
    }
  };

  const processGalleryFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    setIsGalleryUploading(true);
    try {
      const settled = await Promise.allSettled(selectedFiles.map((file) => compressImageForUpload(file)));
      const results = settled
        .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
        .map((result) => result.value);

      if (results.length === 0) {
        const firstError = settled.find((result): result is PromiseRejectedResult => result.status === "rejected");
        throw firstError?.reason || new Error("Could not upload these images.");
      }

      const availableSlots = Math.max(0, MAX_GALLERY_IMAGES - gallery.length);
      const acceptedResults = results.slice(0, availableSlots);
      setGallery((current) => {
        const next = [...current];
        for (const result of acceptedResults) {
          if (!next.includes(result)) next.push(result);
        }
        return next;
      });
      if (results.length > acceptedResults.length) {
        alert(`Only ${MAX_GALLERY_IMAGES} gallery images are allowed. Extra images were skipped.`);
      }
      if (!image && acceptedResults[0]) {
        setImage(acceptedResults[0]);
        setImagePreview(acceptedResults[0]);
      }
      const failedCount = settled.length - results.length;
      if (failedCount > 0) {
        alert(`${results.length} image${results.length === 1 ? "" : "s"} added. ${failedCount} image${failedCount === 1 ? "" : "s"} could not be processed.`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not upload these images.");
    } finally {
      setIsGalleryUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) processCoverFile(file);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (files.length) void processGalleryFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processCoverFile(file);
  };

  const setCoverFromGallery = (nextImage: string) => {
    setImage(nextImage);
    setImagePreview(nextImage);
    setGallery((current) => [nextImage, ...current.filter((item) => item !== nextImage)]);
  };

  const removeGalleryImage = (nextImage: string) => {
    setGallery((current) => current.filter((item) => item !== nextImage));
    if (image === nextImage) {
      const replacement = gallery.find((item) => item !== nextImage) || "";
      setImage(replacement);
      setImagePreview(replacement);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setLabel("new");
    setCategory("image");
    setInventoryCount("0");
    setReviews("0");
    setImage("");
    setImagePreview("");
    setGallery([]);
    setOriginalImages({ image: "", gallery: [] });
    setSelectedCategoryIds([]);
    setOriginalCategoryIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setOldPrice(product.oldPrice ? product.oldPrice.toString() : "");
    setLabel(normalizeAdminLabel(product));
    setCategory(normalizeAdminCategory(product));
    setInventoryCount(product.inventoryCount.toString());
    setReviews(String(product.reviews ?? 0));
    const productGallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image].filter(Boolean);
    setImage(product.image);
    setImagePreview(product.image);
    setGallery(productGallery);
    setOriginalImages({ image: product.image, gallery: productGallery });
    setSelectedCategoryIds(product.categoryIds || []);
    setOriginalCategoryIds(product.categoryIds || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const remaining = products.filter((product) => product.id !== id);
      setProducts(remaining);
      // Deleting the only row on a later page would leave the table empty.
      if (remaining.length === 0 && page > 1) setPage(page - 1);
    } catch (err) {
      console.error(err);
      alert("Cannot delete product: it may be tied to existing orders.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imagesChanged = !editingProduct
      || image !== originalImages.image
      || gallery.length !== originalImages.gallery.length
      || gallery.some((item, index) => item !== originalImages.gallery[index]);

    const categoryIdsChanged = !editingProduct
      || selectedCategoryIds.length !== originalCategoryIds.length
      || selectedCategoryIds.some((id) => !originalCategoryIds.includes(id));

    const payload: Record<string, unknown> = {
      name,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      label,
      category,
      inventoryCount: parseInt(inventoryCount, 10),
      reviews: parseInt(reviews || "0", 10),
      isCustomizable: category !== "no customization",
      // The backend keeps the existing links (and the row's categoryIds) when
      // this is omitted, which is one less round trip on an unchanged save.
      ...(categoryIdsChanged ? { categoryIds: selectedCategoryIds } : {}),
    };

    if (imagesChanged) {
      const coverImage = image || gallery[0] || "/images/product_mockup.png";
      const nextGallery = [coverImage, ...gallery.filter((item) => item !== coverImage)];
      if (nextGallery.length > MAX_GALLERY_IMAGES) {
        alert(`Please keep the gallery to ${MAX_GALLERY_IMAGES} images or fewer.`);
        setIsSubmitting(false);
        return;
      }
      payload.image = coverImage;
      payload.gallery = nextGallery;

      if (estimateJsonBytes(payload) > PAYLOAD_WARNING_BYTES) {
        const shouldContinue = confirm("This product has a large image gallery and may take longer to save. Continue?");
        if (!shouldContinue) {
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const saved = await apiFetch<AdminProduct>(url, {
        method: editingProduct ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      if (editingProduct) {
        setProducts((current) => current.map((product) => product.id === saved.id ? { ...product, ...saved } : product));
      } else {
        if (page === 1) setProducts((current) => [saved, ...current].slice(0, 24));
        else setPage(1);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-[#5A5A55]"><Loader2 className="h-8 w-8 animate-spin text-[#757D5C]" /><p className="text-sm font-medium">Loading products…</p></div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1C1A]">Products</h1>
          <p className="text-[#5A5A55] mt-2">Manage your catalog, prices, and inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#1C1C1A] text-white px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-[#1C1C1A]/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1C1C1A]/10 bg-[#F8F6EF]/50">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Product</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Price</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Inventory</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Reviews</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Customizable</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#1C1C1A]/5 hover:bg-[#F8F6EF]/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg bg-[#EAECE3] overflow-hidden shrink-0 border border-[#1C1C1A]/5">
                      <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1C1C1A]">{product.name}</div>
                      <div className="text-xs text-[#5A5A55]">
                        {(product.label || "new").charAt(0).toUpperCase() + (product.label || "new").slice(1)} · {product.category} · {(() => { const count = product.galleryCount ?? product.gallery?.length ?? 1; return `${count} image${count === 1 ? "" : "s"}`; })()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1C1C1A]">₹{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-[#5A5A55] line-through">₹{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    product.inventoryCount > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inventoryCount} in stock
                  </span>
                </td>
                <td className="p-4 text-sm font-medium text-[#1C1C1A]">{product.reviews ?? 0}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    product.category !== "no customization" ? 'bg-[#757D5C]/20 text-[#757D5C]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.category !== "no customization" ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 text-[#5A5A55] hover:text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#5A5A55]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Admin product pages" className="flex items-center justify-center gap-3">
          <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-[#1C1C1A]/20 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <span className="text-sm text-[#5A5A55]">Page {pagination.page} of {pagination.totalPages} · {pagination.total} products</span>
          <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-xl bg-[#1C1C1A] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl">
            <div className="p-6 border-b border-[#1C1C1A]/10 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif text-[#1C1C1A]">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F8F6EF] rounded-full text-[#5A5A55]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Product Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Label</label>
                    <select
                      required
                      value={label}
                      onChange={e => setLabel(e.target.value as AdminProduct["label"])}
                      className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C] cursor-pointer"
                    >
                      <option value="bestseller">Bestseller</option>
                      <option value="new">New</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Customization</label>
                    <select
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C] cursor-pointer"
                    >
                      <option value="image">Image</option>
                      <option value="text">Text</option>
                      <option value="image+text">Image + Text</option>
                      <option value="no customization">No Customization</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Price (₹)</label>
                      <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Old Price (₹)</label>
                      <input type="number" step="0.01" value={oldPrice} onChange={e => setOldPrice(e.target.value)} placeholder="Optional" className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Inventory</label>
                      <input type="number" required value={inventoryCount} onChange={e => setInventoryCount(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Review count</label>
                      <input type="number" min="0" step="1" required value={reviews} onChange={e => setReviews(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Collections</label>
                    <div className="max-h-40 overflow-y-auto overscroll-contain rounded-xl border border-[#1C1C1A]/20 bg-white p-2">
                      {categoriesLoading ? <p className="flex items-center gap-2 px-2 py-2 text-xs text-[#5A5A55]"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading collections…</p> : categories.length === 0 ? <p className="px-2 py-2 text-xs text-[#5A5A55]">No collections yet. Create one in Collections.</p> : categories.map((storeCategory) => {
                        const selected = selectedCategoryIds.includes(storeCategory.id);
                        return <label key={storeCategory.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#1C1C1A] hover:bg-[#F8F6EF]"><input type="checkbox" checked={selected} onChange={() => setSelectedCategoryIds((current) => selected ? current.filter((id) => id !== storeCategory.id) : [...current, storeCategory.id])} className="h-4 w-4 accent-[#757D5C]" />{storeCategory.name}</label>;
                      })}
                    </div>
                    <p className="mt-1 text-xs text-[#8C867C]">Assign this product to one or more collections created in the Collections area.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Cover Image</label>
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => coverFileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 ${
                        isDragOver ? 'border-[#757D5C] bg-[#757D5C]/5' : imagePreview ? 'border-[#1C1C1A]/10' : 'border-[#1C1C1A]/20 hover:border-[#757D5C]/50'
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 90vw, 512px" className="object-contain p-2" />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                              <Upload className="w-5 h-5 text-[#1C1C1A]" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[#F8F6EF] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-[#5A5A55]" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-[#1C1C1A]">Click to upload</p>
                            <p className="text-xs text-[#5A5A55] mt-1">This appears first on shop cards</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block">Product Gallery</label>
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#757D5C] hover:text-[#1C1C1A]"
                      >
                        <Plus className="w-3 h-3" /> {isGalleryUploading ? "Adding..." : "Add images"}
                      </button>
                    </div>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFileChange}
                      className="hidden"
                    />
                    <div
                      className="grid grid-cols-4 gap-2"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (event.dataTransfer.files.length > 0) void processGalleryFiles(event.dataTransfer.files);
                      }}
                    >
                      {gallery.map((galleryImage, index) => (
                        <div key={`${galleryImage}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-[#1C1C1A]/10 bg-[#F8F6EF]">
                          <Image src={galleryImage} alt={`Gallery image ${index + 1}`} fill sizes="(max-width: 768px) 22vw, 120px" className="object-contain p-1" />
                          <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => setCoverFromGallery(galleryImage)}
                              className="rounded bg-white/90 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#1C1C1A] shadow-sm"
                            >
                              {image === galleryImage ? "Cover" : "Set"}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(galleryImage)}
                              className="rounded bg-white/90 p-1 text-red-500 shadow-sm"
                              aria-label="Remove gallery image"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {gallery.length === 0 && (
                        <button
                          type="button"
                          onClick={() => galleryFileInputRef.current?.click()}
                          className="col-span-4 h-20 rounded-xl border border-dashed border-[#1C1C1A]/20 text-sm font-bold text-[#5A5A55] hover:border-[#757D5C]/50"
                        >
                          {isGalleryUploading ? "Adding images..." : "Upload or drop gallery images"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Description</label>
                    <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C] resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#1C1C1A]/10 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-[#5A5A55] hover:bg-[#F8F6EF] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center bg-[#757D5C] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#5C6348] transition-colors disabled:opacity-50">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
