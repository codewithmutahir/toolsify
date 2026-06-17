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
    { name: "categoryLabel", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

export function searchTools(query: string, limit?: number): Tool[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const results = fuse.search(trimmed, limit ? { limit } : undefined);
  return results.map((result) => result.item);
}
