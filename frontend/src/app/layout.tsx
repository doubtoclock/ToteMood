import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingSocials } from "@/components/layout/FloatingSocials";
import { Footer } from "@/components/layout/Footer";
import { GlobalSignInToast } from "@/components/InlineSignIn";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.totemood.com";
const previewImages = [
  {
    url: "/images/t1.jpeg",
    width: 1360,
    height: 1600,
    alt: "Totemood illustrated tote bag preview",
  },
  {
    url: "/images/t2.jpeg",
    width: 1080,
    height: 1271,
    alt: "Totemood custom tote bag preview",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Totemood | Premium Illustrated Totes",
  description: "Editorial, warm, and minimal premium tote bags.",
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Totemood | Premium Illustrated Totes",
    description: "Editorial, warm, and minimal premium tote bags.",
    url: siteUrl,
    siteName: "Totemood",
    images: previewImages,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Totemood | Premium Illustrated Totes",
    description: "Editorial, warm, and minimal premium tote bags.",
    images: previewImages.map((image) => image.url),
  },
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
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preload" as="script" href="https://accounts.google.com/gsi/client" />
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','936282987930571');fbq('track','PageView');` }} />
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=936282987930571&ev=PageView&noscript=1" />
        </noscript>
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
          <GlobalSignInToast />
        </SmoothScroll>
      </body>
    </html>
  );
}
