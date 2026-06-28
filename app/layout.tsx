import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { buildOgImages, OG_IMAGE_URL } from "@/lib/seo/og";
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
import { Toaster } from "sonner";
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
  title: {
    default: "AI-Powered Digital Tools for Productivity",
    template: "%s | Toolsify",
  },
  description:
    "AI-powered, fast, and privacy-first digital tools to simplify work, boost productivity, and solve everyday tasks—all in one place.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Toolsify",
    type: "website",
    url: SITE_URL,
    title: "AI-Powered Digital Tools for Productivity | Toolsify",
    description:
      "AI-powered, fast, and privacy-first digital tools to simplify work, boost productivity, and solve everyday tasks—all in one place.",
    images: buildOgImages("Toolsify Preview"),
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Digital Tools for Productivity | Toolsify",
    description:
      "AI-powered, fast, and privacy-first digital tools to simplify work, boost productivity, and solve everyday tasks—all in one place.",
    images: [OG_IMAGE_URL],
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
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
