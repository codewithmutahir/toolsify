import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ToolCategory } from "@/types/tool";
import { getToolsByCategory } from "@/constants/tools";
import { getLocalizedTools } from "@/lib/i18n/server";
import ToolCard from "./ToolCard";

interface RelatedToolsProps {
  category: ToolCategory;
  currentSlug?: string;
}

export default async function RelatedTools({
  category,
  currentSlug,
}: RelatedToolsProps) {
  const t = await getTranslations("toolPage");
  const tNav = await getTranslations("nav");

  const related = await getLocalizedTools(
    getToolsByCategory(category)
      .filter((tool) => tool.implemented && tool.slug !== currentSlug)
      .slice(0, 4)
  );

  if (related.length === 0) return null;

  return (
    <section className="mt-2xl">
      <div className="flex items-center justify-between mb-lg">
        <h2 className="font-h2 text-h2 text-on-surface">
          {t("relatedTools")}
        </h2>
        <Link
          href="/tools"
          className="text-primary font-label text-label flex items-center gap-xs hover:underline"
        >
          {tNav("allTools")}
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
