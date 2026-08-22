import { Droplets, ShieldCheck, Feather } from "lucide-react";

export function ProductFeatures({ productName }: { productName: string }) {
  return (
    <section className="pt-8 pb-20 md:pb-24 border-b border-[#E8E5DC]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          
          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#B55E5B]">
              <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#B55E5B] uppercase tracking-widest mb-2">Premium Quality</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              300 GSM cotton, built for lasting strength and everyday use.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#B55E5B]">
              <Droplets className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#B55E5B] uppercase tracking-widest mb-2">Durable print</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              Premium DTF printing designed to stay vibrant, even after gentle hand washing.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 text-[#B55E5B]">
              <Feather className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#B55E5B] uppercase tracking-widest mb-2">Your Design, Your Approval</h3>
            <p className="text-[15px] text-[#686B59] leading-[1.6]">
              Create your design your way, we'll share it with you on WhatsApp for approval before we start printing.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
