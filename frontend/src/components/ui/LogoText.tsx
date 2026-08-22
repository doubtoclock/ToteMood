import React from 'react';
import { Rokkitt } from 'next/font/google';

const logoFont = Rokkitt({ 
  weight: ['600'],
  subsets: ['latin'],
});

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <span className={`${logoFont.className} uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-400 drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)] ${className}`}>
      TOTEMOOD
    </span>
  );
}
