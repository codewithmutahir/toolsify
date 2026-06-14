import { ToolCategory } from "@/types/tool";
import { getToolsByCategory } from "@/constants/tools";
import ToolCard from "./ToolCard";
import SectionTitle from "@/components/ui/SectionTitle";

interface RelatedToolsProps {
  category: ToolCategory;
  currentSlug?: string;
}

export default function RelatedTools({
  category,
  currentSlug,
}: RelatedToolsProps) {
  const related = getToolsByCategory(category)
    .filter((tool) => tool.slug !== currentSlug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-2xl">
      <SectionTitle
        title="Related Tools"
        subtitle="More free tools in this category"
        className="mb-lg"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
