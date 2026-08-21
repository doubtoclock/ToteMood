"use client";

const shimmer =
  "bg-[length:400%_100%] bg-gradient-to-r from-[#EDE9E0] via-[#F5F3EC] to-[#EDE9E0] animate-skeleton-shimmer";

export function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-[#F8F6EF] pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-[1200px] mx-auto">
          {/* Left: Image */}
          <div className={`w-full aspect-[4/5] lg:aspect-square rounded-[24px] ${shimmer}`} />

          {/* Right: Details */}
          <div className="flex flex-col gap-5 py-4 lg:py-8">
            {/* Category */}
            <div className={`w-20 h-3 rounded-[4px] ${shimmer}`} />
            {/* Title */}
            <div className="space-y-3">
              <div className={`w-3/4 h-10 rounded-[8px] ${shimmer}`} />
              <div className={`w-1/2 h-6 rounded-[6px] ${shimmer}`} />
            </div>
            {/* Price */}
            <div className="flex gap-3">
              <div className={`w-24 h-7 rounded-[6px] ${shimmer}`} />
              <div className={`w-16 h-7 rounded-[6px] ${shimmer}`} />
            </div>
            {/* Rating */}
            <div className={`w-36 h-4 rounded-[4px] ${shimmer}`} />
            {/* Description */}
            <div className="space-y-2.5 mt-2">
              <div className={`w-full h-4 rounded-[4px] ${shimmer}`} />
              <div className={`w-full h-4 rounded-[4px] ${shimmer}`} />
              <div className={`w-4/5 h-4 rounded-[4px] ${shimmer}`} />
            </div>
            {/* Details box */}
            <div className="mt-2 p-5 rounded-[16px] bg-[#EDE9E0]/40 space-y-4">
              <div className="flex gap-3">
                <div className={`w-5 h-5 rounded-full ${shimmer}`} />
                <div className="flex-1 space-y-1.5">
                  <div className={`w-1/2 h-3.5 rounded-[4px] ${shimmer}`} />
                  <div className={`w-2/3 h-3 rounded-[4px] ${shimmer}`} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className={`w-5 h-5 rounded-full ${shimmer}`} />
                <div className="flex-1 space-y-1.5">
                  <div className={`w-1/2 h-3.5 rounded-[4px] ${shimmer}`} />
                  <div className={`w-2/3 h-3 rounded-[4px] ${shimmer}`} />
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="space-y-3 mt-4">
              <div className={`w-full h-14 rounded-[14px] ${shimmer}`} />
              <div className={`w-full h-14 rounded-[14px] ${shimmer}`} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
