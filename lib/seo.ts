import { Metadata } from "next";
import { Tool } from "@/types/tool";

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
