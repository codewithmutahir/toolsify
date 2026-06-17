import BMICalculator from "@/components/tools/bmi-calculator/BMICalculator";
import PercentageCalculator from "@/components/tools/percentage-calculator/PercentageCalculator";
import WordCounter from "@/components/tools/word-counter/WordCounter";
import EMICalculator from "@/components/tools/emi-calculator/EMICalculator";
import AgeCalculator from "@/components/tools/age-calculator/AgeCalculator";
import SimpleInterestCalculator from "@/components/tools/simple-interest-calculator/SimpleInterestCalculator";
import CompoundInterestCalculator from "@/components/tools/compound-interest-calculator/CompoundInterestCalculator";
import DiscountCalculator from "@/components/tools/discount-calculator/DiscountCalculator";
import AverageCalculator from "@/components/tools/average-calculator/AverageCalculator";
import CharacterCounter from "@/components/tools/character-counter/CharacterCounter";
import CaseConverter from "@/components/tools/case-converter/CaseConverter";
import TextRepeater from "@/components/tools/text-repeater/TextRepeater";
import LoremIpsumGenerator from "@/components/tools/lorem-ipsum-generator/LoremIpsumGenerator";
import SalaryCalculator from "@/components/tools/salary-calculator/SalaryCalculator";
import TipCalculator from "@/components/tools/tip-calculator/TipCalculator";
import PercentageChangeCalculator from "@/components/tools/percentage-change-calculator/PercentageChangeCalculator";
import CalorieCalculator from "@/components/tools/calorie-calculator/CalorieCalculator";
import IdealWeightCalculator from "@/components/tools/ideal-weight-calculator/IdealWeightCalculator";
import UnitConverter from "@/components/tools/unit-converter/UnitConverter";
import ColorConverter from "@/components/tools/color-converter/ColorConverter";
import HashGenerator from "@/components/tools/hash-generator/HashGenerator";
import JsonFormatter from "@/components/tools/json-formatter/JsonFormatter";
import JwtDecoder from "@/components/tools/jwt-decoder/JwtDecoder";
import MarkdownEditor from "@/components/tools/markdown-editor/MarkdownEditor";
import ColorPaletteGenerator from "@/components/tools/color-palette-generator/ColorPaletteGenerator";
import GradientGenerator from "@/components/tools/gradient-generator/GradientGenerator";
import RegexTester from "@/components/tools/regex-tester/RegexTester";
import CronExpressionGenerator from "@/components/tools/cron-expression-generator/CronExpressionGenerator";

export const toolComponents = {
  "bmi-calculator": BMICalculator,
  "percentage-calculator": PercentageCalculator,
  "word-counter": WordCounter,
  "emi-calculator": EMICalculator,
  "age-calculator": AgeCalculator,
  "simple-interest-calculator": SimpleInterestCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "discount-calculator": DiscountCalculator,
  "average-calculator": AverageCalculator,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "text-repeater": TextRepeater,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "salary-calculator": SalaryCalculator,
  "tip-calculator": TipCalculator,
  "percentage-change-calculator": PercentageChangeCalculator,
  "calorie-calculator": CalorieCalculator,
  "ideal-weight-calculator": IdealWeightCalculator,
  "unit-converter": UnitConverter,
  "color-converter": ColorConverter,
  "hash-generator": HashGenerator,
  "json-formatter": JsonFormatter,
  "jwt-decoder": JwtDecoder,
  "markdown-editor": MarkdownEditor,
  "color-palette-generator": ColorPaletteGenerator,
  "gradient-generator": GradientGenerator,
  "regex-tester": RegexTester,
  "cron-expression-generator": CronExpressionGenerator,
} as const;

export type ImplementedToolSlug = keyof typeof toolComponents;

export const implementedToolSlugs = Object.keys(
  toolComponents
) as ImplementedToolSlug[];

export function isImplementedToolSlug(
  slug: string
): slug is ImplementedToolSlug {
  return slug in toolComponents;
}
