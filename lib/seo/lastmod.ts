import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

const ROOT = process.cwd();

const mtimeCache = new Map<string, Date | undefined>();

async function getFileLastModified(
  relativePath: string
): Promise<Date | undefined> {
  if (mtimeCache.has(relativePath)) {
    return mtimeCache.get(relativePath);
  }

  let mtime: Date | undefined;
  try {
    const stat = await fs.stat(path.join(ROOT, relativePath));
    mtime = stat.mtime;
  } catch {
    mtime = undefined;
  }

  mtimeCache.set(relativePath, mtime);
  return mtime;
}

async function getLatestMtime(
  relativePaths: string[]
): Promise<Date | undefined> {
  const dates = await Promise.all(relativePaths.map(getFileLastModified));
  const validDates = dates.filter((date): date is Date => date !== undefined);

  if (validDates.length === 0) return undefined;

  return new Date(Math.max(...validDates.map((date) => date.getTime())));
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

export async function getStaticPageLastmod(
  pathname: string
): Promise<string | undefined> {
  const sources = STATIC_PAGE_SOURCES[pathname];
  if (!sources) return undefined;

  const mtime = await getLatestMtime([...sources, ...MESSAGE_FILES]);
  return mtime ? formatLastmod(mtime) : undefined;
}

export async function getCategoryLastmod(): Promise<string | undefined> {
  const mtime = await getLatestMtime([
    "constants/categories.ts",
    "app/[locale]/(site)/tools/[category]/page.tsx",
    ...MESSAGE_FILES,
  ]);
  return mtime ? formatLastmod(mtime) : undefined;
}

export async function getToolLastmod(
  slug: string,
  locale: Locale
): Promise<string | undefined> {
  const mtime = await getLatestMtime([
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

export async function getSitemapIndexLastmod(): Promise<string | undefined> {
  const mtime = await getLatestMtime([
    "constants/tools.ts",
    "constants/categories.ts",
    "lib/seo/sitemap-data.ts",
    ...MESSAGE_FILES,
  ]);
  return mtime ? formatLastmod(mtime) : undefined;
}
