import { getTranslations } from "next-intl/server";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";
import type { ToolPageContent } from "@/types/tool-content";
import type { Tool } from "@/types/tool";

export async function getLocalizedToolPageContent(
  slug: ImplementedToolSlug,
  tool: Tool
): Promise<ToolPageContent> {
  const t = await getTranslations(`tools.${slug}.content`);
  const tCommon = await getTranslations("toolCommon");

  const hasContent = t.has("introduction");

  if (hasContent) {
    const howToSteps = t.has("howToSteps")
      ? (t.raw("howToSteps") as ToolPageContent["howToSteps"])
      : [];
    const examples = t.has("examples")
      ? (t.raw("examples") as ToolPageContent["examples"])
      : [];
    const faqs = t.has("faqs")
      ? (t.raw("faqs") as ToolPageContent["faqs"])
      : [];

    return {
      introduction: t("introduction"),
      howToSteps,
      examples,
      faqs,
      ...(t.has("article") ? { article: t("article") } : {}),
    };
  }

  const toolTitle = tool.title;
  const toolTitleLower = tool.title.toLowerCase();

  return {
    introduction: tool.description,
    howToSteps: [
      {
        name: tCommon("defaultHowTo.open", { tool: toolTitle }),
        text: tCommon("defaultHowTo.openText", { tool: toolTitle }),
      },
      {
        name: tCommon("defaultHowTo.enterValues"),
        text: tCommon("defaultHowTo.enterValuesText"),
      },
      {
        name: tCommon("defaultHowTo.viewResults"),
        text: tCommon("defaultHowTo.viewResultsText"),
      },
    ],
    examples: [
      {
        title: tCommon("defaultExample.title"),
        description: tCommon("defaultExample.description", {
          tool: toolTitleLower,
        }),
      },
    ],
    faqs: [
      {
        question: tCommon("defaultFaqs.isFreeQuestion", { tool: toolTitle }),
        answer: tCommon("defaultFaqs.isFreeAnswer"),
      },
      {
        question: tCommon("defaultFaqs.dataQuestion"),
        answer: tCommon("defaultFaqs.dataAnswer"),
      },
      {
        question: tCommon("defaultFaqs.accuracyQuestion", { tool: toolTitle }),
        answer: tCommon("defaultFaqs.accuracyAnswer", {
          description: tool.description,
        }),
      },
    ],
  };
}
