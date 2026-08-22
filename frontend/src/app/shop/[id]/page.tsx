"use client";

import { useParams } from "next/navigation";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { ProductTop } from "@/components/product/ProductTop";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { ProductRelated } from "@/components/product/ProductRelated";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useProducts } from "@/lib/useProducts";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);

  if (loading && !product) {
    return (
      <>
        <ScrollToTop />
        <ProductSkeleton />
      </>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F8F6EF] pt-32 px-6 text-center">
        <ScrollToTop />
        <h1 className="text-[32px] font-title text-[#252A1A] mb-4">
          Product unavailable
        </h1>
        <Link href="/shop" className="text-[13px] font-bold uppercase tracking-widest text-[#757D5C]">
          Return to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] pt-0 relative overflow-hidden">
      <ScrollToTop />
      {/* Background Ambience for top section */}
      <AmbientGlow
        color="bg-[#C4C9B3]"
        opacity={0.15}
        position="top-[-5%] left-[-10%]"
        width="w-[80vw] md:w-[60vw]"
        height="h-[80vw] md:h-[60vw]"
        shape="organic1"
        animationDelay={0}
      />
      <AmbientGlow
        color="bg-[#E6DEC4]"
        opacity={0.2}
        position="top-[20%] right-[-15%]"
        width="w-[80vw] md:w-[50vw]"
        height="h-[80vw] md:h-[50vw]"
        shape="organic2"
        animationDelay={3}
      />

      <div className="relative z-10">
        {/* 1. Top Section (Gallery + Details) */}
        <ProductTop product={product} />

        {/* 2. Why Product? Section */}
        <ProductFeatures productName={product.name} />

        {/* 3. Customer Reviews */}
        <ProductReviews />

        {/* 4. Frequently Asked Questions */}
        <ProductFAQ />

        {/* 5. Related Products */}
        <ProductRelated currentProductId={product.id} products={products} />
      </div>
    </main>
  );
}
