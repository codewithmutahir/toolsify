import { Metadata } from "next";
import { Category, Tool } from "@/types/tool";

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
      url: `https://toolsify.online/tools/${category.slug}`,
      siteName: "Toolsify",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${category.title} Tools | Toolsify`,
      description: category.description,
    },
    alternates: {
      canonical: `https://toolsify.online/tools/${category.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: `${tool.title} — Free Online ${tool.title} | Toolsify`,
    description: `Use our free online ${tool.title.toLowerCase()}. ${tool.description} No signup required. Fast and accurate.`,
    keywords: [
      tool.title,
      `free ${tool.title}`,
      `online ${tool.title} calculator`,
      "toolsify",
    ],
    openGraph: {
      title: `${tool.title} | Toolsify`,
      description: tool.description,
      url: `https://toolsify.online/${tool.slug}`,
      siteName: "Toolsify",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tool.title} | Toolsify`,
      description: tool.description,
    },
    alternates: {
      canonical: `https://toolsify.online/${tool.slug}`,
    },
    robots: { index: true, follow: true },
  };
}
