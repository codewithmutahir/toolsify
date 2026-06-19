import { getImplementedTools, getToolBySlug } from "@/constants/tools";
import { SITE_URL } from "@/lib/config";
import type { ToolAgentMetadata } from "@/types/tool-content";
import { implementedToolSlugs } from "@/components/tools/tool-registry";

export function getToolApiEndpoint(slug: string): string {
  return `${SITE_URL}/api/tools/${slug}`;
}

export function getToolAgentMetadata(slug: string): ToolAgentMetadata | null {
  const tool = getToolBySlug(slug);
  if (!tool?.implemented) return null;

  return {
    name: tool.title,
    slug: tool.slug,
    description: tool.description,
    category: tool.category,
    apiEndpoint: getToolApiEndpoint(slug),
    url: `${SITE_URL}/${tool.slug}`,
  };
}

export function getAllToolAgentMetadata(): ToolAgentMetadata[] {
  return implementedToolSlugs
    .map((slug) => getToolAgentMetadata(slug))
    .filter((item): item is ToolAgentMetadata => item !== null);
}

export function getImplementedToolCount(): number {
  return getImplementedTools().length;
}
