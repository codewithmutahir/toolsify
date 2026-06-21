import { locales } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { MetadataRoute } from "next";

const LOCALE_PROTECTED_PATHS = ["/dashboard", "/sign-in", "/sign-up"] as const;

const localeDisallowPaths = locales.flatMap((locale) =>
  LOCALE_PROTECTED_PATHS.map((path) => `/${locale}${path}`),
);

const DISALLOW = ["/api/", ...localeDisallowPaths, "/__clerk/"];

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
