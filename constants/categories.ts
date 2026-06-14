import { Category } from "@/types/tool";
import { tools } from "./tools";

function countToolsByCategory(slug: Category["slug"]): number {
  return tools.filter((tool) => tool.category === slug).length;
}

export const categories: Category[] = [
  {
    slug: "math",
    title: "Math & Calculators",
    description:
      "Free online math calculators for percentages, fractions, averages, and more. Fast, accurate results with no signup.",
    icon: "functions",
    color: "primary",
    image: "math",
    toolCount: countToolsByCategory("math"),
  },
  {
    slug: "finance",
    title: "Finance",
    description:
      "Calculate EMI, compound interest, loans, SIP, and more with our free finance calculators.",
    icon: "account_balance_wallet",
    color: "secondary",
    image: "finance",
    toolCount: countToolsByCategory("finance"),
  },
  {
    slug: "fitness",
    title: "Fitness & Health",
    description:
      "Track your health with BMI, BMR, calorie, body fat, and ideal weight calculators.",
    icon: "fitness_center",
    color: "tertiary",
    image: "fitness",
    toolCount: countToolsByCategory("fitness"),
  },
  {
    slug: "text",
    title: "Text Tools",
    description:
      "Count words, convert case, generate lorem ipsum, and manipulate text with free online tools.",
    icon: "subject",
    color: "primary",
    image: "text",
    toolCount: countToolsByCategory("text"),
  },
  {
    slug: "color",
    title: "Color & Design",
    description:
      "Pick colors, convert hex to RGB, and work with color formats for design projects.",
    icon: "palette",
    color: "secondary",
    image: "color",
    toolCount: countToolsByCategory("color"),
  },
  {
    slug: "converter",
    title: "Unit Converters",
    description:
      "Convert length, weight, temperature, and more between metric and imperial units.",
    icon: "sync_alt",
    color: "tertiary",
    image: "converter",
    toolCount: countToolsByCategory("converter"),
  },
  {
    slug: "developer",
    title: "Developer Tools",
    description:
      "Format JSON, encode Base64, generate passwords, and other utilities for developers.",
    icon: "code",
    color: "primary",
    image: "developer",
    toolCount: countToolsByCategory("developer"),
  },
];
