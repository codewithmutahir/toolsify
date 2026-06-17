import type { ComponentType } from "react";
import BMICalculator from "@/components/tools/bmi-calculator/BMICalculator";
import PercentageCalculator from "@/components/tools/percentage-calculator/PercentageCalculator";
import WordCounter from "@/components/tools/word-counter/WordCounter";
import EMICalculator from "@/components/tools/emi-calculator/EMICalculator";
import AgeCalculator from "@/components/tools/age-calculator/AgeCalculator";

export const implementedToolSlugs = [
  "bmi-calculator",
  "percentage-calculator",
  "word-counter",
  "emi-calculator",
  "age-calculator",
] as const;

export type ImplementedToolSlug = (typeof implementedToolSlugs)[number];

export const toolComponents: Record<
  ImplementedToolSlug,
  ComponentType
> = {
  "bmi-calculator": BMICalculator,
  "percentage-calculator": PercentageCalculator,
  "word-counter": WordCounter,
  "emi-calculator": EMICalculator,
  "age-calculator": AgeCalculator,
};

export function isImplementedToolSlug(
  slug: string
): slug is ImplementedToolSlug {
  return implementedToolSlugs.includes(slug as ImplementedToolSlug);
}
