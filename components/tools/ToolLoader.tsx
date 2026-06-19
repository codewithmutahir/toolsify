"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import ToolInteractiveSkeleton from "@/components/tools/ToolInteractiveSkeleton";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";

const toolComponents: Record<ImplementedToolSlug, ComponentType> = {
  "bmi-calculator": dynamic(
    () => import("@/components/tools/bmi-calculator/BMICalculator")
  ),
  "percentage-calculator": dynamic(
    () => import("@/components/tools/percentage-calculator/PercentageCalculator")
  ),
  "word-counter": dynamic(
    () => import("@/components/tools/word-counter/WordCounter")
  ),
  "emi-calculator": dynamic(
    () => import("@/components/tools/emi-calculator/EMICalculator")
  ),
  "age-calculator": dynamic(
    () => import("@/components/tools/age-calculator/AgeCalculator")
  ),
  "simple-interest-calculator": dynamic(
    () =>
      import("@/components/tools/simple-interest-calculator/SimpleInterestCalculator")
  ),
  "compound-interest-calculator": dynamic(
    () =>
      import("@/components/tools/compound-interest-calculator/CompoundInterestCalculator")
  ),
  "discount-calculator": dynamic(
    () => import("@/components/tools/discount-calculator/DiscountCalculator")
  ),
  "average-calculator": dynamic(
    () => import("@/components/tools/average-calculator/AverageCalculator")
  ),
  "character-counter": dynamic(
    () => import("@/components/tools/character-counter/CharacterCounter")
  ),
  "case-converter": dynamic(
    () => import("@/components/tools/case-converter/CaseConverter")
  ),
  "text-repeater": dynamic(
    () => import("@/components/tools/text-repeater/TextRepeater")
  ),
  "lorem-ipsum-generator": dynamic(
    () => import("@/components/tools/lorem-ipsum-generator/LoremIpsumGenerator")
  ),
  "salary-calculator": dynamic(
    () => import("@/components/tools/salary-calculator/SalaryCalculator")
  ),
  "tip-calculator": dynamic(
    () => import("@/components/tools/tip-calculator/TipCalculator")
  ),
  "percentage-change-calculator": dynamic(
    () =>
      import("@/components/tools/percentage-change-calculator/PercentageChangeCalculator")
  ),
  "calorie-calculator": dynamic(
    () => import("@/components/tools/calorie-calculator/CalorieCalculator")
  ),
  "ideal-weight-calculator": dynamic(
    () => import("@/components/tools/ideal-weight-calculator/IdealWeightCalculator")
  ),
  "unit-converter": dynamic(
    () => import("@/components/tools/unit-converter/UnitConverter"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "color-converter": dynamic(
    () => import("@/components/tools/color-converter/ColorConverter"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "hash-generator": dynamic(
    () => import("@/components/tools/hash-generator/HashGenerator"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "json-formatter": dynamic(
    () => import("@/components/tools/json-formatter/JsonFormatter"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "jwt-decoder": dynamic(
    () => import("@/components/tools/jwt-decoder/JwtDecoder")
  ),
  "markdown-editor": dynamic(
    () => import("@/components/tools/markdown-editor/MarkdownEditor"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "color-palette-generator": dynamic(
    () => import("@/components/tools/color-palette-generator/ColorPaletteGenerator"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "gradient-generator": dynamic(
    () => import("@/components/tools/gradient-generator/GradientGenerator"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "regex-tester": dynamic(
    () => import("@/components/tools/regex-tester/RegexTester"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
  "cron-expression-generator": dynamic(
    () =>
      import("@/components/tools/cron-expression-generator/CronExpressionGenerator"),
    { loading: () => <ToolInteractiveSkeleton /> }
  ),
};

interface ToolLoaderProps {
  slug: ImplementedToolSlug;
}

export default function ToolLoader({ slug }: ToolLoaderProps) {
  const Component = toolComponents[slug];
  return <Component />;
}
