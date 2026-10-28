"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/useCartStore";
import { offerSignInIfSignedOut } from "@/lib/store/useSignInPrompt";
import type { StoreCategory } from "@/lib/useCategories";

type Pagination = { page: number; pageSize: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
type CategoryDetail = StoreCategory & { products: Product[]; pagination: Pagination };

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [page, setPage] = useState(1);
  const [activeSlug, setActiveSlug] = useState(slug);
  const addItem = useCartStore((store) => store.addItem);

  if (slug !== activeSlug) {
    setActiveSlug(slug);
    setPage(1);
  }

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) setState("loading");
      return apiFetch<CategoryDetail>(`/api/categories/${encodeURIComponent(slug)}?page=${page}&pageSize=10`);
    })
      .then((result) => {
        if (!active) return;
        setCategory(result);
        setState("ready");
      })
      .catch((error: Error) => {
        if (!active) return;
        setState(error.message === "Category not found." ? "missing" : "error");
      });
    return () => { active = false; };
  }, [slug, page]);

  if (state === "loading") {
    return <main className="min-h-screen bg-[#FAF9F8] px-6 py-28"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-64 rounded-[28px] bg-[#E8E5DC]" /><div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-72 rounded-2xl bg-[#F0EEE7]" />)}</div></div></main>;
  }

  if (state === "missing") {
    return <main className="min-h-screen bg-[#FAF9F8] px-6 py-32 text-center"><h1 className="font-title text-4xl text-[#252A1A]">Collection unavailable</h1><p className="mt-3 text-[#686B59]">This collection may have been removed.</p><Link href="/shop" className="mt-8 inline-flex rounded-full bg-[#252A1A] px-6 py-3 text-sm font-bold text-white">Browse all totes</Link></main>;
  }

  if (state === "error" || !category) {
    return <main className="min-h-screen bg-[#FAF9F8] px-6 py-32 text-center"><h1 className="font-title text-4xl text-[#252A1A]">We couldn&apos;t load this collection</h1><p className="mt-3 text-[#686B59]">Please try again in a moment.</p><Link href="/shop" className="mt-8 inline-flex rounded-full bg-[#252A1A] px-6 py-3 text-sm font-bold text-white">Browse all totes</Link></main>;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F8] pb-20">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative min-h-[260px] overflow-hidden rounded-[28px] bg-[#252A1A] px-6 py-12 sm:px-12">
          <Image src={category.coverImage} alt="" fill priority className="object-cover opacity-40" sizes="(max-width: 1280px) 100vw, 1280px" />
          <div className="relative z-10 max-w-xl text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Totemood collection</p><h1 className="mt-3 font-title text-4xl leading-none sm:text-6xl">{category.name}</h1><p className="mt-5 text-sm text-white/85">{category.productCount} {category.productCount === 1 ? "tote" : "totes"} in this collection</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        {category.products.length === 0 ? (
          <div className="rounded-[24px] border border-[#E8E5DC] bg-white px-6 py-16 text-center"><h2 className="font-title text-3xl text-[#252A1A]">This collection is getting ready</h2><p className="mt-3 text-[#686B59]">There are no tote bags here just yet.</p><Link href="/shop" className="mt-7 inline-flex text-sm font-bold text-[#757D5C] underline underline-offset-4">Explore all totes</Link></div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product) => (
              <article key={product.id} className="group flex flex-col"><div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[20px] border border-[#E8E5DC] bg-[#F5F3EC]"><Link href={`/shop/${product.id}`} className="absolute inset-0"><Image src={product.image} alt={product.name} fill loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" /></Link><button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => { addItem(product); offerSignInIfSignedOut(); }} className="absolute bottom-3 right-3 rounded-full bg-white p-2.5 text-[#252A1A] shadow-sm transition hover:bg-[#252A1A] hover:text-white"><ShoppingCart className="h-4 w-4" /></button></div><Link href={`/shop/${product.id}`}><h2 className="text-sm font-bold leading-snug text-[#252A1A] sm:text-base">{product.name}</h2><p className="mt-1 font-bold text-[#252A1A]">₹{product.price.toFixed(2)}</p></Link></article>
            ))}
          </div>
        )}
        {category.pagination.totalPages > 1 && (
          <nav aria-label="Collection product pages" className="mt-12 flex items-center justify-center gap-3">
            <button type="button" disabled={!category.pagination.hasPreviousPage} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-full border border-[#1C1C1A]/20 px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span className="text-sm text-[#686B59]">Page {category.pagination.page} of {category.pagination.totalPages}</span>
            <button type="button" disabled={!category.pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-full bg-[#252A1A] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </nav>
        )}
      </section>
    </main>
  );
}
