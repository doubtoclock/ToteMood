import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Rokkitt } from 'next/font/google';

const logoFont = Rokkitt({ 
  weight: ['600'],
  subsets: ['latin'],
});

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EAECE3] flex flex-col items-center justify-center relative overflow-hidden">
      <AmbientGlow color="bg-[#C4C9B3]" opacity={0.3} position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" width="w-[30vw]" height="h-[30vw]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Pulsing Logo Text */}
        <h1 className={`${logoFont.className} uppercase text-4xl md:text-5xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-400 drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)] animate-pulse`}>
          TOTEMOOD
        </h1>
        
        {/* Minimalist Spinner */}
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#757D5C] animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-[#757D5C] animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-[#757D5C] animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
}
