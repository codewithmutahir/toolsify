import { SITE_URL } from "@/lib/config";
import type { FaqItem, HowToStep } from "@/types/tool-content";
import type { Tool } from "@/types/tool";

const CATEGORY_APPLICATION_TYPE: Record<Tool["category"], string> = {
  math: "UtilitiesApplication",
  finance: "FinanceApplication",
  fitness: "HealthApplication",
  text: "UtilitiesApplication",
  color: "DesignApplication",
  converter: "UtilitiesApplication",
  developer: "DeveloperApplication",
};

export function buildSoftwareApplicationSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}/${tool.slug}`,
    applicationCategory: CATEGORY_APPLICATION_TYPE[tool.category],
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildFaqPageSchema(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToSchema(
  tool: Tool,
  steps: HowToStep[]
) {
  if (steps.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title}`,
    description: tool.description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function buildToolPageJsonLd(tool: Tool, faqs: FaqItem[], howToSteps: HowToStep[]) {
  return [
    buildSoftwareApplicationSchema(tool),
    buildFaqPageSchema(faqs),
    buildHowToSchema(tool, howToSteps),
  ].filter(Boolean);
}
