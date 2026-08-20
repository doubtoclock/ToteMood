"use client";

import { Hero } from "@/components/home/Hero";
import { MadeToCarry } from "@/components/home/MadeToCarry";
import { MomentsWeCarry } from "@/components/home/MomentsWeCarry";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CustomerStories } from "@/components/home/CustomerStories";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";
import { ProductMockup } from "@/components/home/ProductMockup";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <MadeToCarry />
      <MomentsWeCarry />
      <FeaturedCollection />
      <CustomerStories />
      <FAQ />
      <CTA />
      <ProductMockup />
    </main>
  );
}
