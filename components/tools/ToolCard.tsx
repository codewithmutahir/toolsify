import Link from "next/link";
import { Tool } from "@/types/tool";
import {
  categoryColorMap,
  categoryShortLabels,
} from "@/lib/category-colors";
import { cn } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "category" | "homepage";
  className?: string;
}

export default function ToolCard({
  tool,
  variant = "default",
  className,
}: ToolCardProps) {
  const colors = categoryColorMap[tool.category];

  if (variant === "homepage") {
    return (
      <Link
        href={`/${tool.slug}`}
        className={cn(
          "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg card-hover cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between mb-md">
          <span className="material-symbols-outlined text-primary-container text-display">
            {tool.icon}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-sm py-1 rounded-lg uppercase tracking-wider",
              colors.badge
            )}
          >
            {categoryShortLabels[tool.category]}
          </span>
        </div>
        <h4 className="font-h3 text-h3 text-on-background mb-sm group-hover:text-primary transition-colors">
          {tool.title}
        </h4>
        <p className="font-body text-small text-on-surface-variant">
          {tool.shortDesc}
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg",
        "hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-md">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
            colors.iconBg,
            colors.iconHover
          )}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {tool.icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="mt-xs font-small text-small text-on-surface-variant line-clamp-2">
            {variant === "category" ? tool.description : tool.shortDesc}
          </p>
          <div className="mt-sm">
            <CategoryBadge category={tool.category} />
          </div>
        </div>
      </div>
      {variant === "category" && (
        <p className="mt-md font-small text-small font-bold text-primary-container group-hover:underline">
          Calculate Now →
        </p>
      )}
    </Link>
  );
}
