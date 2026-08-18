import { notFound } from "next/navigation";
import { products } from "@/lib/data/products";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { ProductTop } from "@/components/product/ProductTop";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { ProductRelated } from "@/components/product/ProductRelated";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] pt-20 md:pt-24 relative overflow-hidden">
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
        <ProductRelated currentProductId={product.id} />
      </div>
    </main>
  );
}
