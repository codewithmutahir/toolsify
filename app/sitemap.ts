import { MetadataRoute } from "next";
import { getImplementedTools } from "@/constants/tools";
import { categories } from "@/constants/categories";
import { locales } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { localePath } from "@/lib/i18n/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const liveTools = getImplementedTools();

  const staticPaths = ["/", "/tools", "/tools/categories", "/contact", "/privacy-policy", "/terms"];

  const staticUrls = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: new Date(),
      changeFrequency:
        path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1.0 : path === "/tools" ? 0.9 : 0.6,
    }))
  );

  const toolUrls = locales.flatMap((locale) =>
    liveTools.map((tool) => ({
      url: `${SITE_URL}${localePath(locale, `/${tool.slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const categoryUrls = locales.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${SITE_URL}${localePath(locale, `/tools/${cat.slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...categoryUrls, ...toolUrls];
}
