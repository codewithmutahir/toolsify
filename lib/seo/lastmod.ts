import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

const ROOT = process.cwd();

function getFileLastModified(relativePath: string): Date | undefined {
  try {
    const stat = fs.statSync(path.join(ROOT, relativePath));
    return stat.mtime;
  } catch {
    return undefined;
  }
}

function getLatestMtime(relativePaths: string[]): Date | undefined {
  const dates = relativePaths
    .map(getFileLastModified)
    .filter((date): date is Date => date !== undefined);

  if (dates.length === 0) return undefined;

  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

const MESSAGE_FILES = locales.map((locale) => `messages/${locale}.json`);

const STATIC_PAGE_SOURCES: Record<string, string[]> = {
  "/": ["app/[locale]/(site)/page.tsx", "components/home/HomeContent.tsx"],
  "/tools": ["app/[locale]/(site)/tools/page.tsx"],
  "/tools/categories": ["app/[locale]/(site)/tools/categories/page.tsx"],
  "/contact": ["app/[locale]/contact/page.tsx"],
  "/privacy-policy": ["app/[locale]/privacy-policy/page.tsx"],
  "/terms": ["app/[locale]/terms/page.tsx"],
};

export function formatLastmod(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

export function getStaticPageLastmod(pathname: string): string | undefined {
  const sources = STATIC_PAGE_SOURCES[pathname];
  if (!sources) return undefined;

  const mtime = getLatestMtime([...sources, ...MESSAGE_FILES]);
  return mtime ? formatLastmod(mtime) : undefined;
}

export function getCategoryLastmod(): string | undefined {
  const mtime = getLatestMtime([
    "constants/categories.ts",
    "app/[locale]/(site)/tools/[category]/page.tsx",
    ...MESSAGE_FILES,
  ]);
  return mtime ? formatLastmod(mtime) : undefined;
}

export function getToolLastmod(slug: string, locale: Locale): string | undefined {
  const mtime = getLatestMtime([
    "constants/tools.ts",
    "lib/tools/page-content.ts",
    "lib/i18n/tool-content.ts",
    "lib/seo/json-ld.ts",
    `messages/${locale}.json`,
    "app/[locale]/(site)/[tool-slug]/page.tsx",
    `components/tools/${slug}`,
    "components/tools/ToolPageShell.tsx",
  ]);
  return mtime ? formatLastmod(mtime) : undefined;
}

export function getSitemapIndexLastmod(): string | undefined {
  const mtime = getLatestMtime([
    "constants/tools.ts",
    "constants/categories.ts",
    "lib/seo/sitemap-data.ts",
    ...MESSAGE_FILES,
  ]);
  return mtime ? formatLastmod(mtime) : undefined;
}
