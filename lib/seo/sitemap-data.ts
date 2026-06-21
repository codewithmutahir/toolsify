import { categories } from "@/constants/categories";
import { getImplementedTools } from "@/constants/tools";
import { locales, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import {
  getCategoryLastmod,
  getStaticPageLastmod,
  getSitemapIndexLastmod,
  getToolLastmod,
} from "@/lib/seo/lastmod";
import {
  buildLocaleToolEntries,
  buildMultilingualPageEntries,
  type SitemapIndexEntry,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-xml";

export const INDEXABLE_STATIC_PATHS = [
  "/",
  "/tools",
  "/tools/categories",
  "/contact",
  "/privacy-policy",
  "/terms",
] as const;

export function getImplementedToolSlugs(): string[] {
  return getImplementedTools().map((tool) => tool.slug);
}

export function getPagesSitemapEntries(): SitemapUrlEntry[] {
  return buildMultilingualPageEntries(
    [...INDEXABLE_STATIC_PATHS],
    getStaticPageLastmod
  );
}

export function getCategoriesSitemapEntries(): SitemapUrlEntry[] {
  const lastmod = getCategoryLastmod();

  return locales.flatMap((locale) =>
    categories.map((category) => ({
      pathname: `/tools/${category.slug}`,
      locale,
      lastmod,
      includeHreflang: true,
    }))
  );
}

export function getToolsSitemapEntries(locale: Locale): SitemapUrlEntry[] {
  return buildLocaleToolEntries(
    locale,
    getImplementedToolSlugs(),
    getToolLastmod
  );
}

export function getSitemapIndexEntries(): SitemapIndexEntry[] {
  const lastmod = getSitemapIndexLastmod();

  const childSitemaps = [
    `${SITE_URL}/sitemap-pages.xml`,
    `${SITE_URL}/sitemap-categories.xml`,
    ...locales.map((locale) => `${SITE_URL}/sitemap-tools-${locale}.xml`),
  ];

  return childSitemaps.map((loc) => ({
    loc,
    ...(lastmod ? { lastmod } : {}),
  }));
}

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
} as const;
