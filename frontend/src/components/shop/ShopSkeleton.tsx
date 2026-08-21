"use client";

const COUNT = 8;

const shimmer =
  "bg-[length:400%_100%] bg-gradient-to-r from-[#EDE9E0] via-[#F5F3EC] to-[#EDE9E0] animate-skeleton-shimmer";

export function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
      {Array.from({ length: COUNT }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Image */}
          <div className={`relative aspect-[4/5] w-full rounded-[20px] ${shimmer} mb-5`} />
          {/* Title */}
          <div className={`h-4 w-3/4 rounded-[4px] ${shimmer} mb-2`} />
          {/* Price */}
          <div className={`h-3.5 w-1/4 rounded-[4px] ${shimmer} mb-3`} />
          {/* Stars */}
          <div className="flex gap-1 mt-auto">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className={`w-3 h-3 rounded-full ${shimmer}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
