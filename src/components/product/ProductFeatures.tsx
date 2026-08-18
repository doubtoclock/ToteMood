import { Droplets, ShieldCheck, Feather } from "lucide-react";

export function ProductFeatures({ productName }: { productName: string }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-[#1C1C1A] uppercase tracking-wider mb-12 md:mb-16">
          Why {productName}?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[#F8F6EF] flex items-center justify-center shrink-0 border border-[#1C1C1A]/5">
              <ShieldCheck className="w-8 h-8 text-[#1C1C1A] stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C1C1A] mb-2">Premium Quality</h3>
              <p className="text-sm text-[#5A5A55] leading-relaxed">
                Constructed with heavy-weight organic canvas and reinforced stitching for unparalleled durability.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[#F8F6EF] flex items-center justify-center shrink-0 border border-[#1C1C1A]/5">
              <Droplets className="w-8 h-8 text-[#1C1C1A] stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C1C1A] mb-2">Water Resistant</h3>
              <p className="text-sm text-[#5A5A55] leading-relaxed">
                Treated with an eco-friendly coating to keep your belongings safe from unexpected weather.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[#F8F6EF] flex items-center justify-center shrink-0 border border-[#1C1C1A]/5">
              <Feather className="w-8 h-8 text-[#1C1C1A] stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C1C1A] mb-2">Lightweight Design</h3>
              <p className="text-sm text-[#5A5A55] leading-relaxed">
                Designed to distribute weight evenly, ensuring ultimate comfort even on your longest days.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
