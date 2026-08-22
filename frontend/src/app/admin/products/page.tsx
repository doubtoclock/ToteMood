"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload, ImageIcon } from "lucide-react";
import { apiFetch, ENABLE_REALTIME, SOCKET_URL } from "@/lib/api";
import { io } from "socket.io-client";
import { compressImageForUpload } from "@/lib/imageCompression";

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  gallery?: string[];
  isCustomizable: boolean;
  label: "bestseller" | "new" | "premium";
  category: string;
  inventoryCount: number;
}

const normalizeAdminLabel = (product: AdminProduct): AdminProduct["label"] => {
  const value = String(product.label || product.category || "").trim().toLowerCase();
  return value === "bestseller" || value === "premium" || value === "new" ? value : "new";
};

const normalizeAdminCategory = (product: AdminProduct) => {
  const value = String(product.category || "").trim().toLowerCase().replace(/\s*\+\s*/g, "+");
  if (value === "image" || value === "image+text" || value === "no customization") return value;
  if (!product.isCustomizable) return "no customization";

  const searchable = `${product.id} ${product.name} ${product.description}`.toLowerCase();
  return searchable.includes("text") || searchable.includes("emoji") ? "image+text" : "image";
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(() => {
    apiFetch<AdminProduct[]>('/api/products')
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
    if (!ENABLE_REALTIME) return;

    const socket = io(SOCKET_URL);
    socket.on("products_updated", fetchProducts);
    return () => {
      socket.disconnect();
    };
  }, [fetchProducts]);

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

      setGallery((current) => {
        const next = [...current];
        for (const result of results) {
          if (!next.includes(result)) next.push(result);
        }
        return next;
      });
      if (!image && results[0]) {
        setImage(results[0]);
        setImagePreview(results[0]);
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
    setImage("");
    setImagePreview("");
    setGallery([]);
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
    setImage(product.image);
    setImagePreview(product.image);
    setGallery(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image].filter(Boolean));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Cannot delete product: it may be tied to existing orders.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const coverImage = image || gallery[0] || "/images/product_mockup.png";
    const payload = {
      name,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      label,
      category,
      inventoryCount: parseInt(inventoryCount, 10),
      isCustomizable: category !== "no customization",
      image: coverImage,
      gallery: [coverImage, ...gallery.filter((item) => item !== coverImage)]
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      await apiFetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-[#5A5A55]">Loading products...</div>;
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
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1C1C1A]">{product.name}</div>
                      <div className="text-xs text-[#5A5A55]">
                        {(product.label || "new").charAt(0).toUpperCase() + (product.label || "new").slice(1)} · {product.category} · {(product.gallery?.length || 1)} image{(product.gallery?.length || 1) === 1 ? "" : "s"}
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
                <td colSpan={5} className="p-8 text-center text-[#5A5A55]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Category</label>
                    <select
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C] cursor-pointer"
                    >
                      <option value="image">Image</option>
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
                          <Image src={imagePreview} alt="Preview" fill className="object-contain p-2" />
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
                          <Image src={galleryImage} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
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
                <button type="submit" disabled={isSubmitting} className="bg-[#757D5C] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#5C6348] transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
