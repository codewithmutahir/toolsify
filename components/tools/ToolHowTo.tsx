"use client";

import { useTranslations } from "next-intl";
import type { HowToStep } from "@/types/tool-content";

interface ToolHowToProps {
  steps: HowToStep[];
}

export default function ToolHowTo({ steps }: ToolHowToProps) {
  const t = useTranslations("toolPage");

  if (steps.length === 0) return null;

  return (
    <section aria-label={t("howToUse")} className="mt-2xl">
      <h2 className="font-h2 text-h2 text-on-surface mb-md">{t("howToUse")}</h2>
      <ol className="list-decimal list-inside space-y-sm font-body text-body text-on-surface-variant leading-relaxed">
        {steps.map((step, index) => (
          <li key={index}>
            <span className="font-medium text-on-surface">{step.name}.</span>{" "}
            {step.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
