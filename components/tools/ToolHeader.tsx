import Link from "next/link";
import { ToolCategory } from "@/types/tool";
import { getCategoryTitle } from "@/lib/category-colors";
import CategoryBadge from "./CategoryBadge";

interface ToolHeaderProps {
  title: string;
  description: string;
  category: ToolCategory;
}

export default function ToolHeader({
  title,
  description,
  category,
}: ToolHeaderProps) {
  const categoryTitle = getCategoryTitle(category);

  return (
    <header className="mb-xl">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-xs font-small text-small text-on-surface-variant mb-md flex-wrap"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link
          href={`/tools/${category}`}
          className="hover:text-primary transition-colors"
        >
          {categoryTitle}
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">{title}</span>
      </nav>

      <div className="flex items-center gap-sm mb-sm">
        <CategoryBadge category={category} />
      </div>

      <h1 className="font-h1 text-h1 text-on-surface mb-xs">{title}</h1>
      <p className="font-body text-body text-on-surface-variant max-w-2xl">
        {description}
      </p>
    </header>
  );
}
