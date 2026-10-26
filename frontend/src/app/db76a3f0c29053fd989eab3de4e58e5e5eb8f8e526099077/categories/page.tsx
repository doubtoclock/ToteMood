"use client";

import Image from "next/image";
import { ImageIcon, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { compressImageForUpload } from "@/lib/imageCompression";
import { useCategories, type StoreCategory } from "@/lib/useCategories";

export default function AdminCollectionsPage() {
  const { categories, loading, error, refetch, upsertCategory, removeCategory } = useCategories();
  const [editing, setEditing] = useState<StoreCategory | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageData, setImageData] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setEditing(null); setName(""); setImageData(""); setPreview(""); setMessage(""); setIsOpen(true); };
  const openEdit = (collection: StoreCategory) => { setEditing(collection); setName(collection.name); setImageData(""); setPreview(collection.coverImage); setMessage(""); setIsOpen(true); };

  const selectImage = async (file?: File) => {
    if (!file) return;
    try {
      const compressed = await compressImageForUpload(file);
      setImageData(compressed);
      setPreview(compressed);
      setMessage("");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not prepare that image.");
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return setMessage("Enter a collection name.");
    if (!editing && !imageData) return setMessage("Choose a cover image before saving.");
    setSaving(true); setMessage("");
    try {
      const saved = await apiFetch<StoreCategory>(editing ? `/api/categories/${editing.id}` : "/api/categories", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({ name: trimmedName, ...(imageData ? { imageData } : {}) }),
      });
      upsertCategory(saved);
      setIsOpen(false);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not save collection.");
    } finally { setSaving(false); }
  };

  const remove = async (collection: StoreCategory) => {
    if (!confirm(`Delete “${collection.name}”? Its product assignments will be removed, but products and orders will stay intact.`)) return;
    setDeletingId(collection.id);
    try {
      await apiFetch(`/api/categories/${collection.id}`, { method: "DELETE" });
      removeCategory(collection.id);
    } catch (cause) { alert(cause instanceof Error ? cause.message : "Could not delete collection."); }
    finally { setDeletingId(null); }
  };

  return <div className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-3xl font-serif text-[#1C1C1A]">Collections</h1><p className="mt-2 text-[#5A5A55]">Create collections and place a tote in more than one collection.</p></div>
      <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1C1A] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-black"><Plus className="h-4 w-4" /> Add Collection</button>
    </div>
    {loading ? <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-[#5A5A55]"><Loader2 className="h-8 w-8 animate-spin text-[#757D5C]" /><p className="text-sm font-medium">Loading collections…</p></div> : error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error} <button onClick={() => void refetch()} className="ml-2 font-bold underline">Retry</button></div> : categories.length === 0 ? <div className="rounded-2xl border border-dashed border-[#1C1C1A]/20 bg-white px-6 py-16 text-center"><ImageIcon className="mx-auto h-10 w-10 text-[#8C867C]" /><h2 className="mt-4 font-title text-2xl text-[#252A1A]">No collections yet</h2><p className="mt-2 text-[#686B59]">Create a collection, then assign products from Product management.</p><button onClick={openCreate} className="mt-6 font-bold text-[#757D5C] underline underline-offset-4">Create your first collection</button></div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{categories.map((collection) => <article key={collection.id} className="overflow-hidden rounded-2xl border border-[#1C1C1A]/10 bg-white shadow-sm"><div className="relative aspect-[16/8] bg-[#F5F3EC]"><Image src={collection.coverImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="flex items-center justify-between gap-3 p-5"><div className="min-w-0"><h2 className="truncate font-serif text-xl text-[#1C1C1A]">{collection.name}</h2><p className="mt-1 text-sm text-[#5A5A55]">{collection.productCount} {collection.productCount === 1 ? "product" : "products"}</p></div><div className="flex shrink-0 gap-1"><button onClick={() => openEdit(collection)} aria-label={`Edit ${collection.name}`} className="rounded-lg p-2 text-[#5A5A55] hover:bg-[#F8F6EF]"><Pencil className="h-4 w-4" /></button><button disabled={deletingId === collection.id} onClick={() => void remove(collection)} aria-label={`Delete ${collection.name}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50">{deletingId === collection.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></div></article>)}</div>}
    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-[#1C1C1A]/10 bg-white p-6"><h2 className="text-2xl font-serif text-[#1C1C1A]">{editing ? "Edit collection" : "Add collection"}</h2><button onClick={() => setIsOpen(false)} aria-label="Close collection form" className="rounded-full p-2 hover:bg-[#F8F6EF]"><X className="h-5 w-5" /></button></div><form onSubmit={save} className="space-y-6 p-6"><div><label htmlFor="collection-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#5A5A55]">Collection name</label><input id="collection-name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-[#1C1C1A]/20 px-4 py-3 text-sm focus:border-[#757D5C] focus:outline-none" /></div><div><div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55]">Cover image</label>{preview && <button type="button" onClick={() => { setImageData(""); setPreview(editing?.coverImage || ""); }} className="text-xs font-bold text-[#B5483B]">{editing ? "Use current image" : "Remove"}</button>}</div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { void selectImage(event.target.files?.[0]); event.currentTarget.value = ""; }} className="hidden" /><button type="button" onClick={() => inputRef.current?.click()} className="relative flex h-52 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#1C1C1A]/20 bg-[#F8F6EF] text-[#5A5A55] hover:border-[#757D5C]">{preview ? <Image src={preview} alt="Collection cover preview" fill className="object-cover" unoptimized={preview.startsWith("data:")} /> : <><Upload className="h-7 w-7" /><span className="mt-2 text-sm font-bold">Choose JPEG, PNG, or WebP</span><span className="mt-1 text-xs">Desktop and mobile file picker supported</span></>} {preview && <span className="relative z-10 rounded-full bg-white/90 px-3 py-2 text-xs font-bold shadow">Replace image</span>}</button></div>{message && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}<div className="flex justify-end gap-3 border-t border-[#1C1C1A]/10 pt-5"><button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-5 py-3 text-sm font-bold text-[#5A5A55]">Cancel</button><button disabled={saving} className="inline-flex items-center rounded-full bg-[#757D5C] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-50">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{saving ? "Saving…" : "Save collection"}</button></div></form></div></div>}
  </div>;
}
