import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: "Custom Totes", image: "/images/product_mockup.png", link: "#custom" },
  { name: "Essentials", image: "/images/collection_everyday.png", link: "#essentials" },
  { name: "Premium Leather", image: "/images/feature_premium_canvas.png", link: "#premium" },
  { name: "Accessories", image: "/images/feature_photo_art.png", link: "#accessories" },
  { name: "Artist Series", image: "/images/collection_weekend.png", link: "#artist" },
  { name: "Gifts", image: "/images/collection_everyday.png", link: "#gifts" },
];

export function ShopCategories() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1C1A]">Shop by Category</h2>
          <Link 
            href="#all-products" 
            className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest text-[#1C1C1A] hover:text-[#757D5C] transition-colors group"
          >
            View all collections
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 md:gap-8 pb-4">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.name} 
              href={category.link}
              className="flex flex-col items-center gap-4 group min-w-[140px] md:min-w-[160px]"
            >
              <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-2xl bg-[#F8F6EF] overflow-hidden flex items-center justify-center p-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                <div className="relative w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                    sizes="160px"
                  />
                </div>
              </div>
              <span className="text-sm md:text-base font-medium text-[#1C1C1A]">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
