"use client";

import { Link } from "@/i18n/navigation";
import { Category } from "@/types/tool";
import { categoryHomeStyles } from "@/lib/category-colors";
import { useMessages } from "next-intl";
import { getLocalizedCategoryShortName } from "@/lib/i18n/localize";
import { categoryShortNames } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({
  category,
  className,
}: CategoryCardProps) {
  const messages = useMessages();
  const styles = categoryHomeStyles[category.slug];
  const shortName = getLocalizedCategoryShortName(
    category.slug,
    messages,
    categoryShortNames[category.slug]
  );

  return (
    <Link
      href={`/tools/${category.slug}`}
      className={cn(
        "bg-surface-container-lowest border border-outline-variant p-lg rounded-xl card-hover cursor-pointer text-center group block",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-md transition-colors",
          styles.iconBg,
          styles.iconHover
        )}
      >
        <span className={cn("material-symbols-outlined", styles.iconText)}>
          {category.icon}
        </span>
      </div>
      <h3 className="font-h3 text-small font-bold mb-xs text-on-background">
        {shortName}
      </h3>
      <span
        className={cn(
          "inline-block px-sm py-1 rounded-full font-label text-[10px] font-medium",
          styles.badgeBg,
          styles.badgeCountText
        )}
      >
        {category.toolCount} Tools
      </span>
    </Link>
  );
}
