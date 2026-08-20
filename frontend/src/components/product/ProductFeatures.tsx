import { Droplets, ShieldCheck, Feather } from "lucide-react";

export function ProductFeatures({ productName }: { productName: string }) {
  return (
    <section className="pt-8 pb-20 md:pb-24 border-b border-[#E8E5DC]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          
          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#8C867C]">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-[14px] font-bold text-[#252A1A] uppercase tracking-widest mb-2">Premium Quality</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              Heavy-weight organic canvas with reinforced stitching for unparalleled durability.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#8C867C]">
              <Droplets className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-[14px] font-bold text-[#252A1A] uppercase tracking-widest mb-2">Water Resistant</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              Eco-friendly coating to keep your belongings safe from unexpected weather.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#8C867C]">
              <Feather className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-[14px] font-bold text-[#252A1A] uppercase tracking-widest mb-2">Lightweight Design</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              Designed to distribute weight evenly, ensuring comfort even on your longest days.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
