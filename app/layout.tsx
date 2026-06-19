import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PostHogProvider from "@/components/analytics/PostHogProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MaterialSymbolsStylesheet from "@/components/fonts/MaterialSymbolsStylesheet";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toolsify.online"),
  title: "Toolsify — Free Online Tools",
  description:
    "Free online calculators, converters, and utility tools. Fast, accurate, and no signup required.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    siteName: "Toolsify",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakarta.variable} ${inter.variable} scroll-smooth`}
      >
        <head>
          {adsenseClientId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
        </head>
        <body className="font-body antialiased bg-background text-on-background min-h-screen">
          <MaterialSymbolsStylesheet />
          <GoogleAnalytics />
          <Suspense fallback={null}>
            <PostHogProvider>{children}</PostHogProvider>
          </Suspense>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
