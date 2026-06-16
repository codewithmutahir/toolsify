import { notFound } from "next/navigation";
import { getToolBySlug } from "@/constants/tools";
import { generateToolMetadata } from "@/lib/seo";
import {
  implementedToolSlugs,
  isImplementedToolSlug,
  toolComponents,
} from "@/components/tools/tool-registry";

type ToolPageProps = {
  params: { "tool-slug": string };
};

export async function generateStaticParams() {
  return implementedToolSlugs.map((slug) => ({ "tool-slug": slug }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const tool = getToolBySlug(params["tool-slug"]);
  if (!tool || !isImplementedToolSlug(params["tool-slug"])) {
    return {};
  }
  return generateToolMetadata(tool);
}

export default function ToolPage({ params }: ToolPageProps) {
  const slug = params["tool-slug"];

  if (!isImplementedToolSlug(slug)) {
    notFound();
  }

  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const Component = toolComponents[slug];
  return <Component />;
}
