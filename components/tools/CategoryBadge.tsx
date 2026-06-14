import { ToolCategory } from "@/types/tool";
import { categoryColorMap, getCategoryTitle } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: ToolCategory;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colors = categoryColorMap[category];
  const label = getCategoryTitle(category).split(" ")[0].toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex px-sm py-1 rounded-full font-label text-[10px] uppercase font-bold",
        colors.badge,
        className
      )}
    >
      {label}
    </span>
  );
}
