import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingSocials } from "@/components/layout/FloatingSocials";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const agatho = localFont({
  src: [
    {
      path: "../../public/font/Agatho/Agatho_ Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/Agatho/Agatho_Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Agatho/Agatho_ Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Agatho/Agatho_ Bold.otf",
      weight: "700",
      style: "normal",
    }
  ],
  variable: "--font-agatho",
  display: "swap",
});

const noyh = localFont({
  src: [
    {
      path: "../../public/font/Noyh/Noyh-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Noyh/Noyh-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Noyh/Noyh-Bold.woff2",
      weight: "700",
      style: "normal",
    }
  ],
  variable: "--font-noyh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Totemood | Premium Illustrated Canvas Totes",
  description: "Editorial, warm, and minimal premium canvas tote bags.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${agatho.variable} ${noyh.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className="min-h-full flex flex-col font-sans text-foreground bg-background antialiased selection:bg-accent selection:text-foreground"
        suppressHydrationWarning
      >
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
          <FloatingSocials />
        </SmoothScroll>
      </body>
    </html>
  );
}
