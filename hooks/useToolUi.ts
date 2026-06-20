import { useTranslations } from "next-intl";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";

export function useToolUi(slug: ImplementedToolSlug) {
  return useTranslations(`tools.${slug}.ui`);
}
