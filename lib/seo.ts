import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { Category, Tool } from "@/types/tool";

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function generateCategoryMetadata(category: Category): Metadata {
  return {
    title: `Free ${category.title} — ${category.toolCount} Tools | Toolsify`,
    description: `${category.toolCount} free ${category.title.toLowerCase()} for everyone. No signup required.`,
    keywords: [
      category.title,
      `free ${category.title.toLowerCase()}`,
      "online tools",
      "toolsify",
    ],
    openGraph: {
      title: `${category.title} Tools | Toolsify`,
      description: category.description,
      url: `${SITE_URL}/tools/${category.slug}`,
      siteName: "Toolsify",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Toolsify" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} Tools | Toolsify`,
      description: category.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: `${SITE_URL}/tools/${category.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${SITE_URL}/${tool.slug}`;
  const description = `Use our free online ${tool.title.toLowerCase()}. ${tool.description} No signup required. Fast and accurate.`;

  return {
    title: `${tool.title} — Free Online Tool | Toolsify`,
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
      url,
      siteName: "Toolsify",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | Toolsify`,
      description: tool.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
    robots: { index: true, follow: true },
  };
}
