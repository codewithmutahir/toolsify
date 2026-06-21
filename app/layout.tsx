import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { getLocale } from "next-intl/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PostHogProvider from "@/components/analytics/PostHogProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ReCaptchaProvider from "@/components/recaptcha/ReCaptchaProvider";
import WebMcpProvider from "@/components/webmcp/WebMcpProvider";
import "@fontsource-variable/material-symbols-outlined/full.css";
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
  metadataBase: new URL(SITE_URL),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    // API routes and non-locale paths
  }

  const dir = locale === "ur" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${plusJakarta.variable} ${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-background text-on-background min-h-screen">
        <ClerkProvider>
          <WebMcpProvider />
          <GoogleAnalytics />
          {adsenseClientId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
          <Suspense fallback={null}>
            <PostHogProvider>
              <ReCaptchaProvider>{children}</ReCaptchaProvider>
            </PostHogProvider>
          </Suspense>
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
