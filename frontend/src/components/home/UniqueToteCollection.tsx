"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useCategories } from "@/lib/useCategories";

/**
 * Public collection gallery. It reads from the same collection records that
 * are managed in the admin panel, so new owner-created collections show up
 * here automatically.
 */
export function UniqueToteCollection() {
  const { categories, loading } = useCategories();

  return (
    <section
      aria-labelledby="unique-tote-collection-title"
      className="relative overflow-hidden bg-[#F5F1E8] py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#C7C3A4]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-[#B3B99D]/25 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-12 lg:px-20">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#757D5C]">
              Made for your moments
            </p>
            <h2
              id="unique-tote-collection-title"
              className="mt-4 font-heading text-4xl leading-[0.98] tracking-tight text-[#1C1C1A] sm:text-5xl lg:text-[60px]"
            >
              Unique Tote Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1C1A] transition-colors hover:text-[#757D5C]"
          >
            View all totes
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-[28px] border border-[#1C1C1A]/10 bg-white/60">
            <Loader2 aria-label="Loading collections" className="h-6 w-6 animate-spin text-[#757D5C]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-[28px] border border-[#1C1C1A]/10 bg-white/60 px-6 text-center">
            <div>
              <p className="font-heading text-3xl tracking-tight text-[#1C1C1A] sm:text-4xl">
                Collections are coming soon
              </p>
              <p className="mt-3 text-sm text-[#64675D]">
                New one-of-a-kind tote collections will appear here soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
            {categories.map((collection) => (
              <Link
                key={collection.id}
                href={`/categories/${collection.slug}`}
                className="group relative min-h-72 w-[78vw] shrink-0 snap-center overflow-hidden rounded-[28px] bg-[#252A1A] shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#757D5C]/40 sm:w-[46vw] sm:min-h-80 lg:w-[31%]"
              >
                <Image
                  src={collection.coverImage}
                  alt={`Explore ${collection.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-7">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
                      {collection.productCount} {collection.productCount === 1 ? "tote" : "totes"}
                    </p>
                    <h3 className="mt-2 font-heading text-3xl leading-none tracking-tight sm:text-4xl">
                      {collection.name}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1C1C1A] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
