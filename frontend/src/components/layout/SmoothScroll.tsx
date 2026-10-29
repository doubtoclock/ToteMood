"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { ADMIN_PATH } from "@/lib/admin-route";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lenis owns wheel input for the document. The admin panel scrolls inside
  // its own container, where a mounted Lenis swallows the wheel and leaves
  // only the scrollbar usable, so leave it off for admin routes.
  if (pathname?.startsWith(ADMIN_PATH)) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
