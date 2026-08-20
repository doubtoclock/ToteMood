import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-28 pb-20">
      <Section className="relative pt-0 md:pt-0">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-[1200px] mx-auto">
            {/* Left: Image Skeleton */}
            <div className="w-full aspect-[4/5] lg:aspect-square bg-[#F5F3EC] animate-pulse rounded-[24px]"></div>

            {/* Right: Info Skeleton */}
            <div className="flex flex-col gap-6 py-4 lg:py-8">
              {/* Breadcrumbs */}
              <div className="w-32 h-4 bg-[#F5F3EC] animate-pulse rounded-[4px]"></div>
              
              {/* Title & Price */}
              <div className="space-y-4">
                <div className="w-3/4 h-12 bg-[#F5F3EC] animate-pulse rounded-[8px]"></div>
                <div className="w-1/4 h-8 bg-[#F5F3EC] animate-pulse rounded-[6px]"></div>
              </div>
              
              {/* Rating */}
              <div className="w-40 h-5 bg-[#F5F3EC] animate-pulse rounded-[4px]"></div>
              
              {/* Description */}
              <div className="space-y-3 mt-4">
                <div className="w-full h-4 bg-[#F5F3EC] animate-pulse rounded-[4px]"></div>
                <div className="w-full h-4 bg-[#F5F3EC] animate-pulse rounded-[4px]"></div>
                <div className="w-5/6 h-4 bg-[#F5F3EC] animate-pulse rounded-[4px]"></div>
              </div>
              
              {/* CTA */}
              <div className="space-y-4 mt-8">
                <div className="w-full h-14 bg-[#F5F3EC] animate-pulse rounded-[14px]"></div>
                <div className="w-full h-14 bg-[#F5F3EC] animate-pulse rounded-[14px]"></div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
