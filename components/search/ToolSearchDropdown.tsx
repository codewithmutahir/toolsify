"use client";

import { useEffect, useRef } from "react";
import CategoryBadge from "@/components/tools/CategoryBadge";
import { categoryColorMap } from "@/lib/category-colors";
import { cn } from "@/lib/utils";
import { Tool } from "@/types/tool";

interface ToolSearchDropdownProps {
  results: Tool[];
  activeIndex: number;
  query: string;
  listboxId?: string;
  onSelect: (tool: Tool) => void;
  onViewAll: () => void;
  className?: string;
}

export default function ToolSearchDropdown({
  results,
  activeIndex,
  query,
  listboxId,
  onSelect,
  onViewAll,
  className,
}: ToolSearchDropdownProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const activeItem = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (results.length === 0) {
    return (
      <div
        className={cn(
          "absolute left-0 right-0 top-full mt-1 z-50 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl max-h-[min(60vh,320px)] overflow-y-auto",
          className
        )}
        id={listboxId}
      >
        <p className="px-lg py-md font-body text-small text-on-surface-variant text-center">
          No tools found for &ldquo;{query}&rdquo;
        </p>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onViewAll}
          className="w-full px-lg py-md font-body text-small text-primary-container font-semibold border-t border-outline-variant hover:bg-surface-container-low transition-colors"
        >
          Search all tools
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full mt-1 z-50 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl max-h-[min(60vh,320px)] overflow-y-auto",
        className
      )}
      id={listboxId}
      role="listbox"
      aria-label="Search results"
    >
      <ul ref={listRef}>
        {results.map((tool, index) => {
          const colors = categoryColorMap[tool.category];
          const isActive = index === activeIndex;

          return (
            <li key={tool.slug} role="option" aria-selected={isActive}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(tool)}
                className={cn(
                  "w-full flex items-center gap-sm sm:gap-md px-md sm:px-lg py-md text-left transition-colors",
                  isActive
                    ? "bg-surface-container-low"
                    : "hover:bg-surface-container-low"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-h3 shrink-0",
                    colors.iconBg.split(" ")[1]
                  )}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {tool.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-body text-body font-semibold text-on-surface truncate">
                    {tool.title}
                  </span>
                </span>
                <CategoryBadge category={tool.category} className="shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
      {results.length >= 6 && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onViewAll}
          className="w-full px-lg py-sm font-body text-small text-primary-container font-semibold border-t border-outline-variant hover:bg-surface-container-low transition-colors"
        >
          View all results for &ldquo;{query}&rdquo;
        </button>
      )}
    </div>
  );
}
