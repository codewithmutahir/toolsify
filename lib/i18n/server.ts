import { getMessages } from "next-intl/server";
import { getToolBySlug } from "@/constants/tools";
import {
  localizeCategory,
  localizeTool,
  localizeTools,
} from "@/lib/i18n/localize";
import { getCategoryBySlug } from "@/constants/categories";
import type { Tool } from "@/types/tool";

export async function getLocalizedToolBySlug(slug: string): Promise<Tool | undefined> {
  const tool = getToolBySlug(slug);
  if (!tool) return undefined;
  const messages = await getMessages();
  return localizeTool(tool, messages);
}

export async function getLocalizedTools(toolList: Tool[]): Promise<Tool[]> {
  const messages = await getMessages();
  return localizeTools(toolList, messages);
}

export async function getLocalizedCategoryBySlug(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category) return undefined;
  const messages = await getMessages();
  return localizeCategory(category, messages);
}
