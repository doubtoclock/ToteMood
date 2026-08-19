import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F6EF] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#EAECE3] rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Loader2 className="w-10 h-10 text-[#757D5C] animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#5A5A55] animate-pulse">
        Loading Product...
      </p>
    </div>
  );
}
