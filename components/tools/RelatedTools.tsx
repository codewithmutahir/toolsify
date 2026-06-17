import Link from "next/link";
import { ToolCategory } from "@/types/tool";
import { getToolsByCategory } from "@/constants/tools";
import ToolCard from "./ToolCard";

interface RelatedToolsProps {
  category: ToolCategory;
  currentSlug?: string;
}

export default function RelatedTools({
  category,
  currentSlug,
}: RelatedToolsProps) {
  const related = getToolsByCategory(category)
    .filter((tool) => tool.implemented && tool.slug !== currentSlug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-2xl">
      <div className="flex items-center justify-between mb-lg">
        <h2 className="font-h2 text-h2 text-on-surface">You might also like</h2>
        <Link
          href="/tools"
          className="text-primary font-label text-label flex items-center gap-xs hover:underline"
        >
          View all tools
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} variant="related" />
        ))}
      </div>
    </section>
  );
}
