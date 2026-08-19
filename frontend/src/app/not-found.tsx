import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EAECE3] flex flex-col items-center justify-center relative overflow-hidden px-6">
      <AmbientGlow color="bg-[#C4C9B3]" opacity={0.3} position="top-[20%] left-[30%]" width="w-[40vw]" height="h-[40vw]" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-[120px] md:text-[180px] font-serif text-[#1C1C1A] leading-none mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1A] mb-6">
          Page Not Found
        </h2>
        <p className="text-[#5A5A55] text-lg mb-10 max-w-md mx-auto">
          It looks like the page you are looking for has been moved or doesn't exist. Let's get you back on track.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-[#757D5C] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#5C6348] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
