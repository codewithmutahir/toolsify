"use client";

import { useMessages } from "next-intl";
import { useMemo } from "react";
import { categories } from "@/constants/categories";
import { tools } from "@/constants/tools";
import { getCategoryTitle } from "@/lib/category-colors";
import {
  localizeCategories,
  localizeTools,
  getLocalizedCategoryTitle,
} from "@/lib/i18n/localize";
import { createToolSearch } from "@/lib/search-tools";
import type { ToolCategory } from "@/types/tool";

export function useLocalizedToolCatalog() {
  const messages = useMessages();

  return useMemo(() => {
    const localizedTools = localizeTools(tools, messages);
    const localizedCategories = localizeCategories(categories, messages);
    const categoryLabel = (category: ToolCategory) =>
      getLocalizedCategoryTitle(category, messages, getCategoryTitle(category));
    const searchTools = createToolSearch(localizedTools, categoryLabel);

    return {
      tools: localizedTools,
      categories: localizedCategories,
      searchTools,
    };
  }, [messages]);
}
