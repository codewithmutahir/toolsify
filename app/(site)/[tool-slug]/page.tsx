import { notFound } from "next/navigation";
import { getToolBySlug } from "@/constants/tools";
import { generateToolMetadata } from "@/lib/seo";
import ToolLoader from "@/components/tools/ToolLoader";
import ToolPageShell from "@/components/tools/ToolPageShell";
import {
  implementedToolSlugs,
  isImplementedToolSlug,
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

  return (
    <ToolPageShell tool={tool} slug={slug}>
      <ToolLoader slug={slug} />
    </ToolPageShell>
  );
}
