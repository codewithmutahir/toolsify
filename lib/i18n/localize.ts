import type { Tool } from "@/types/tool";
import type { Category } from "@/types/tool";
import type { AbstractIntlMessages } from "next-intl";

type ToolMessages = {
  title?: string;
  description?: string;
  shortDesc?: string;
};

type CategoryMessages = {
  title?: string;
  description?: string;
  shortLabel?: string;
  shortName?: string;
};

function getToolMessages(
  messages: AbstractIntlMessages,
  slug: string
): ToolMessages {
  const tools = messages.tools as Record<string, ToolMessages> | undefined;
  return tools?.[slug] ?? {};
}

function getCategoryMessages(
  messages: AbstractIntlMessages,
  slug: string
): CategoryMessages {
  const categories = messages.categories as
    | Record<string, CategoryMessages>
    | undefined;
  return categories?.[slug] ?? {};
}

export function localizeTool(
  tool: Tool,
  messages: AbstractIntlMessages
): Tool {
  const localized = getToolMessages(messages, tool.slug);
  return {
    ...tool,
    title: localized.title ?? tool.title,
    description: localized.description ?? tool.description,
    shortDesc: localized.shortDesc ?? tool.shortDesc,
  };
}

export function localizeTools(
  toolList: Tool[],
  messages: AbstractIntlMessages
): Tool[] {
  return toolList.map((tool) => localizeTool(tool, messages));
}

export function localizeCategory(
  category: Category,
  messages: AbstractIntlMessages
): Category {
  const localized = getCategoryMessages(messages, category.slug);
  return {
    ...category,
    title: localized.title ?? category.title,
    description: localized.description ?? category.description,
  };
}

export function localizeCategories(
  categoryList: Category[],
  messages: AbstractIntlMessages
): Category[] {
  return categoryList.map((category) =>
    localizeCategory(category, messages)
  );
}

export function getLocalizedCategoryTitle(
  categorySlug: Tool["category"],
  messages: AbstractIntlMessages,
  fallback: string
): string {
  return getCategoryMessages(messages, categorySlug).title ?? fallback;
}

export function getLocalizedCategoryShortName(
  categorySlug: Tool["category"],
  messages: AbstractIntlMessages,
  fallback: string
): string {
  return getCategoryMessages(messages, categorySlug).shortName ?? fallback;
}

export function getLocalizedCategoryShortLabel(
  categorySlug: Tool["category"],
  messages: AbstractIntlMessages,
  fallback: string
): string {
  return getCategoryMessages(messages, categorySlug).shortLabel ?? fallback;
}

