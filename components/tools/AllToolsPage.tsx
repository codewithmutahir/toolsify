"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/constants/categories";
import { tools } from "@/constants/tools";
import { searchTools } from "@/lib/search-tools";
import { ToolCategory } from "@/types/tool";
import { cn } from "@/lib/utils";
import ToolCard from "./ToolCard";

export default function AllToolsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);

  const activeCategory = searchParams.get("category") as ToolCategory | null;

  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim();

    const categoryFiltered = tools.filter(
      (tool) => !activeCategory || tool.category === activeCategory
    );

    if (!query) return categoryFiltered;

    const searched = searchTools(query);
    const searchedSlugs = new Set(searched.map((tool) => tool.slug));

    return categoryFiltered.filter((tool) => searchedSlugs.has(tool.slug));
  }, [activeCategory, searchTerm]);

  function updateCategory(category: ToolCategory | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    const query = params.toString();
    router.replace(query ? `/tools?${query}` : "/tools", { scroll: false });
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const query = params.toString();
    router.replace(query ? `/tools?${query}` : "/tools", { scroll: false });
  }

  return (
    <main>
      <section className="max-w-container-max mx-auto px-gutter pt-xl pb-lg text-center">
        <h1 className="font-display text-h1-mobile md:text-h1 text-on-surface mb-md">
          All Free Online Tools
        </h1>
        <p className="font-body text-body text-on-surface-variant max-w-2xl mx-auto">
          Browse {tools.length}+ free calculators, converters, and text tools.
          Filter by category or search to find exactly what you need — no signup
          required.
        </p>
      </section>

      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-gutter py-md space-y-md">
          <div className="flex gap-sm overflow-x-auto pb-xs scrollbar-hide">
            <button
              type="button"
              onClick={() => updateCategory(null)}
              className={cn(
                "shrink-0 px-lg py-sm rounded-full font-label text-label transition-all",
                !activeCategory
                  ? "category-pill-active"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              All Tools
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => updateCategory(category.slug)}
                className={cn(
                  "shrink-0 px-lg py-sm rounded-full font-label text-label transition-all",
                  activeCategory === category.slug
                    ? "category-pill-active"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                )}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="relative search-glow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search tools by name or keyword..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <section className="max-w-container-max mx-auto px-gutter py-xl">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="browse" />
            ))}
          </div>
        ) : (
          <div className="text-center py-2xl">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-md">
              search_off
            </span>
            <p className="font-h3 text-h3 text-on-surface mb-xs">No tools found</p>
            <p className="font-body text-body text-on-surface-variant">
              Try a different search term or category filter.
            </p>
          </div>
        )}
      </section>

      <section className="max-w-container-max mx-auto px-gutter pb-2xl">
        <div className="relative overflow-hidden bg-inverse-surface rounded-2xl p-xl flex flex-col md:flex-row items-center justify-between gap-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="font-h2 text-h2 text-inverse-on-surface mb-sm">
              Missing a tool?
            </h2>
            <p className="font-body text-body text-inverse-on-surface/70 max-w-md">
              Tell us what calculator or converter you need and we will build it
              for the community.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative z-10 bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            Request a Tool
          </Link>
        </div>
      </section>
    </main>
  );
}
