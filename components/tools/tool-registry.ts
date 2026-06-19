export const IMPLEMENTED_TOOL_SLUGS = [
  "bmi-calculator",
  "percentage-calculator",
  "word-counter",
  "emi-calculator",
  "age-calculator",
  "simple-interest-calculator",
  "compound-interest-calculator",
  "discount-calculator",
  "average-calculator",
  "character-counter",
  "case-converter",
  "text-repeater",
  "lorem-ipsum-generator",
  "salary-calculator",
  "tip-calculator",
  "percentage-change-calculator",
  "calorie-calculator",
  "ideal-weight-calculator",
  "unit-converter",
  "color-converter",
  "hash-generator",
  "json-formatter",
  "jwt-decoder",
  "markdown-editor",
  "color-palette-generator",
  "gradient-generator",
  "regex-tester",
  "cron-expression-generator",
] as const;

export type ImplementedToolSlug = (typeof IMPLEMENTED_TOOL_SLUGS)[number];

export const implementedToolSlugs = [...IMPLEMENTED_TOOL_SLUGS];

export function isImplementedToolSlug(
  slug: string
): slug is ImplementedToolSlug {
  return (IMPLEMENTED_TOOL_SLUGS as readonly string[]).includes(slug);
}

/** Tools with larger client bundles — lazy-loaded with a loading skeleton. */
export const HEAVY_TOOL_SLUGS = new Set<ImplementedToolSlug>([
  "markdown-editor",
  "json-formatter",
  "cron-expression-generator",
  "hash-generator",
  "regex-tester",
  "unit-converter",
  "gradient-generator",
  "color-palette-generator",
  "color-converter",
]);
