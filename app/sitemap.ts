import { getImplementedTools } from "@/constants/tools";
import { categories } from "@/constants/categories";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const liveTools = getImplementedTools();

  const toolUrls = liveTools.map((tool) => ({
    url: `https://toolsify.online/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `https://toolsify.online/tools/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://toolsify.online",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://toolsify.online/tools",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categoryUrls,
    ...toolUrls,
  ];
}
