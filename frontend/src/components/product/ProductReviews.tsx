import { Star } from "lucide-react";
import Image from "next/image";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Sarah J.",
    avatar: "/images/feature_photo_art.png", // Reusing existing image as mock avatar
    rating: 5,
    text: "Incredible print quality!",
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/images/feature_premium_canvas.png", // Reusing existing image as mock avatar
    rating: 5,
    text: "Best everyday tote ever!",
  },
  {
    id: 3,
    name: "Emily R.",
    avatar: "/images/collection_weekend.png", // Reusing existing image as mock avatar
    rating: 5,
    text: "Material lasts for days!",
  }
];

export function ProductReviews() {
  return (
    <section className="py-12 md:py-16 bg-[#F8F6EF]">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-xl md:text-2xl font-sans font-bold text-[#1C1C1A] uppercase tracking-wider mb-8">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-[16px] p-6 border border-[#1C1C1A]/10 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#EAECE3]">
                  <Image 
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 text-[#F5C518]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-sm font-bold text-[#1C1C1A] ml-1">{review.rating}</span>
                </div>
              </div>
              <p className="text-[#1C1C1A] font-medium text-base">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
