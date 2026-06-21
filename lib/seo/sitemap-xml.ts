import { SITE_URL } from "@/lib/config";
import { locales, type Locale } from "@/i18n/routing";
import { buildAlternateLanguages, localePath } from "@/lib/i18n/metadata";

export interface SitemapUrlEntry {
  pathname: string;
  locale?: Locale;
  lastmod?: string;
  includeHreflang?: boolean;
}

export interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildHreflangLinks(pathname: string): string {
  const alternates = buildAlternateLanguages("en", pathname);

  return Object.entries(alternates.languages)
    .map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`
    )
    .join("\n");
}

export function buildUrlsetXml(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const loc = entry.locale
        ? `${SITE_URL}${localePath(entry.locale, entry.pathname)}`
        : `${SITE_URL}${entry.pathname.startsWith("/") ? entry.pathname : `/${entry.pathname}`}`;

      const lastmodLine = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : "";

      const hreflangBlock =
        entry.includeHreflang !== false
          ? `\n${buildHreflangLinks(entry.pathname)}`
          : "";

      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}${hreflangBlock}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

export function buildSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const sitemaps = entries
    .map((entry) => {
      const lastmodLine = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : "";

      return `  <sitemap>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmodLine}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

export function buildLocaleToolEntries(
  locale: Locale,
  slugs: string[],
  getLastmod: (slug: string, locale: Locale) => string | undefined
): SitemapUrlEntry[] {
  return slugs.map((slug) => ({
    pathname: `/${slug}`,
    locale,
    lastmod: getLastmod(slug, locale),
    includeHreflang: true,
  }));
}

export function buildMultilingualPageEntries(
  pathnames: string[],
  getLastmod: (pathname: string) => string | undefined
): SitemapUrlEntry[] {
  return locales.flatMap((locale) =>
    pathnames.map((pathname) => ({
      pathname,
      locale,
      lastmod: getLastmod(pathname),
      includeHreflang: true,
    }))
  );
}
