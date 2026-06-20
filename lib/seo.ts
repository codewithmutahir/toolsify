import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/config";
import {
  buildAlternateLanguages,
  buildOpenGraphLocale,
} from "@/lib/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { Category, Tool } from "@/types/tool";

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export async function generateCategoryMetadata(
  category: Category,
  locale: Locale,
  pathname: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const categoryTitle = category.title;
  const categoryLower = categoryTitle.toLowerCase();
  const alternates = buildAlternateLanguages(locale, pathname);

  return {
    title: t("categoryTitle", {
      category: categoryTitle,
      count: category.toolCount,
    }),
    description: t("categoryDescription", {
      count: category.toolCount,
      category: categoryLower,
    }),
    keywords: [
      categoryTitle,
      `free ${categoryLower}`,
      "online tools",
      "toolsify",
    ],
    openGraph: {
      title: `${categoryTitle} Tools | Toolsify`,
      description: category.description,
      url: alternates.canonical,
      siteName: "Toolsify",
      type: "website",
      locale: buildOpenGraphLocale(locale),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Toolsify" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Tools | Toolsify`,
      description: category.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    robots: { index: true, follow: true },
  };
}

export async function generateToolMetadata(
  tool: Tool,
  locale: Locale,
  pathname: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternateLanguages(locale, pathname);
  const description = t("toolDescription", {
    title: tool.title.toLowerCase(),
    description: tool.description,
  });

  return {
    title: t("toolTitle", { title: tool.title }),
    description,
    keywords: [
      tool.title,
      `free ${tool.title}`,
      `online ${tool.title}`,
      "toolsify",
      ...tool.tags,
    ],
    openGraph: {
      title: `${tool.title} | Toolsify`,
      description: tool.description,
      url: alternates.canonical,
      siteName: "Toolsify",
      type: "website",
      locale: buildOpenGraphLocale(locale),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | Toolsify`,
      description: tool.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    robots: { index: true, follow: true },
  };
}

export async function generatePageMetadata(
  locale: Locale,
  pathname: string,
  namespace: "home" | "tools" | "categories" | "contact" | "privacy" | "terms"
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternateLanguages(locale, pathname);
  const keywords = t.has(`${namespace}.keywords`)
    ? (t.raw(`${namespace}.keywords`) as string[])
    : undefined;

  return {
    title: t(`${namespace}.title`),
    description: t(`${namespace}.description`),
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title: t(`${namespace}.title`),
      description: t(`${namespace}.description`),
      url: alternates.canonical,
      siteName: "Toolsify",
      type: "website",
      locale: buildOpenGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t(`${namespace}.title`),
      description: t(`${namespace}.description`),
    },
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    robots: { index: true, follow: true },
  };
}
