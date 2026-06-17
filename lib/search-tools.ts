import Fuse from "fuse.js";
import { tools } from "@/constants/tools";
import { getCategoryTitle } from "@/lib/category-colors";
import { Tool } from "@/types/tool";

type SearchDocument = Tool & {
  categoryLabel: string;
};

const searchDocuments: SearchDocument[] = tools.map((tool) => ({
  ...tool,
  categoryLabel: getCategoryTitle(tool.category),
}));

const fuse = new Fuse(searchDocuments, {
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

export interface SearchToolsOptions {
  limit?: number;
  implementedOnly?: boolean;
}

export function searchTools(query: string, options?: SearchToolsOptions): Tool[] {
  const { limit, implementedOnly = false } = options ?? {};
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const results = fuse.search(trimmed, limit ? { limit } : undefined);
  const matched = results.map((result) => result.item);

  if (!implementedOnly) {
    return matched;
  }

  return matched.filter((tool) => tool.implemented);
}
