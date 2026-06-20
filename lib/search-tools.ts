import Fuse from "fuse.js";
import { tools } from "@/constants/tools";
import { getCategoryTitle } from "@/lib/category-colors";
import { Tool, ToolCategory } from "@/types/tool";

type SearchDocument = Tool & {
  categoryLabel: string;
};

export interface SearchToolsOptions {
  limit?: number;
  implementedOnly?: boolean;
}

export type SearchToolsFn = (
  query: string,
  options?: SearchToolsOptions
) => Tool[];

function buildSearchDocuments(
  toolList: Tool[],
  categoryLabelFor: (category: ToolCategory) => string
): SearchDocument[] {
  return toolList.map((tool) => ({
    ...tool,
    categoryLabel: categoryLabelFor(tool.category),
  }));
}

function buildFuse(documents: SearchDocument[]) {
  return new Fuse(documents, {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "shortDesc", weight: 0.3 },
      { name: "description", weight: 0.25 },
      { name: "tags", weight: 0.2 },
      { name: "categoryLabel", weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

export function createToolSearch(
  toolList: Tool[],
  categoryLabelFor: (category: ToolCategory) => string
): SearchToolsFn {
  const fuse = buildFuse(buildSearchDocuments(toolList, categoryLabelFor));

  return (query, options) => {
    const { limit, implementedOnly = false } = options ?? {};
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const results = fuse.search(trimmed, limit ? { limit } : undefined);
    const matched = results.map((result) => result.item);

    if (!implementedOnly) {
      return matched;
    }

    return matched.filter((tool) => tool.implemented);
  };
}

const defaultFuse = buildFuse(
  buildSearchDocuments(tools, (category) => getCategoryTitle(category))
);

/** English catalog search (WebMCP, scripts). */
export function searchTools(
  query: string,
  options?: SearchToolsOptions
): Tool[] {
  const { limit, implementedOnly = false } = options ?? {};
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const results = defaultFuse.search(trimmed, limit ? { limit } : undefined);
  const matched = results.map((result) => result.item);

  if (!implementedOnly) {
    return matched;
  }

  return matched.filter((tool) => tool.implemented);
}
