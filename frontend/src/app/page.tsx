"use client";

import { Hero } from "@/components/home/Hero";
import { MomentsWeCarry } from "@/components/home/MomentsWeCarry";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CustomerStories } from "@/components/home/CustomerStories";
import { FAQ } from "@/components/home/FAQ";
import { ProductMockup } from "@/components/home/ProductMockup";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <MomentsWeCarry />
      <Hero />
      <FeaturedCollection />
      <CustomerStories />
      <FAQ />
      <ProductMockup />
    </main>
  );
}
