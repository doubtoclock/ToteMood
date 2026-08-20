import { Star, CheckCircle2 } from "lucide-react";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Sarah J.",
    date: "August 12, 2026",
    rating: 5,
    title: "Incredible print quality!",
    text: "I was worried the print might fade after a few washes, but it looks exactly like the day I bought it. The canvas is thick and feels very premium.",
    verified: true,
  },
  {
    id: 2,
    name: "Michael T.",
    date: "July 28, 2026",
    rating: 5,
    title: "Best everyday tote ever!",
    text: "This fits my 15-inch laptop, a water bottle, and all my chargers without losing its shape. The strap length is perfect for wearing over a jacket.",
    verified: true,
  },
  {
    id: 3,
    name: "Emily R.",
    date: "July 15, 2026",
    rating: 5,
    title: "A wonderful gift",
    text: "I got this customized for my sister's birthday and she absolutely loved it. The packaging was beautiful and it arrived exactly on time.",
    verified: true,
  }
];

export function ProductReviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-title text-[#252A1A] tracking-tight mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex text-[#D94F3C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[16px] h-[16px] fill-current" strokeWidth={0} />
                ))}
              </div>
              <span className="text-[14px] font-bold text-[#252A1A]">4.9 / 5</span>
              <span className="text-[14px] text-[#8C867C]">(128 reviews)</span>
            </div>
          </div>
          <button className="text-[13px] font-bold uppercase tracking-widest text-[#252A1A] border-b border-[#252A1A] pb-0.5 hover:text-[#686B59] hover:border-[#686B59] transition-colors self-start md:self-end">
            Write a review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div 
              key={review.id} 
              className="bg-[#FAF9F8] rounded-[20px] p-8 border border-[#E8E5DC]"
            >
              <div className="flex items-center gap-1 text-[#D94F3C] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-[14px] h-[14px] ${i < review.rating ? 'fill-current' : 'fill-transparent stroke-current'}`} strokeWidth={i < review.rating ? 0 : 1.5} />
                ))}
              </div>
              <h3 className="text-[16px] font-bold text-[#252A1A] mb-3">
                "{review.title}"
              </h3>
              <p className="text-[15px] text-[#5A5A55] leading-[1.6] mb-6">
                {review.text}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-[#E8E5DC]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#252A1A] flex items-center gap-1.5">
                    {review.name}
                    {review.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8E9476]" />
                    )}
                  </span>
                  <span className="text-[12px] text-[#8C867C]">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
