import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over ₹5,000"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day return policy"
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure checkout"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Dedicated support team"
  }
];

export function ShopValueProps() {
  return (
    <div className="w-full border-t border-[#E8E5DC] bg-[#FAF9F8] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 max-w-[1000px] mx-auto">
          {VALUE_PROPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center px-2">
                <div className="text-[#252A1A] mb-4">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#252A1A] mb-1.5">
                  {item.title}
                </span>
                <span className="text-[14px] text-[#686B59]">
                  {item.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
