import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  // Math & Calculators
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Calculate percentages, percentage increase, decrease, and find what percent one number is of another.",
    shortDesc: "Calculate any percentage instantly",
    category: "math",
    icon: "percent",
    tags: ["percentage", "math", "calculator"],
    implemented: true,
    featured: true,
  },
  {
    slug: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    description:
      "Calculate simple interest and total amount from principal, rate, and time.",
    shortDesc: "Principal, rate, time → interest",
    category: "math",
    icon: "savings",
    tags: ["interest", "math", "finance"],
    implemented: true,
  },
  {
    slug: "discount-calculator",
    title: "Discount Calculator",
    description:
      "Calculate final price and savings from original price and discount percentage.",
    shortDesc: "Find sale price and savings",
    category: "math",
    icon: "sell",
    tags: ["discount", "sale", "math"],
    implemented: true,
  },
  {
    slug: "average-calculator",
    title: "Average Calculator",
    description:
      "Calculate the mean, median, mode, min, and max of a set of numbers quickly.",
    shortDesc: "Mean, median, mode, min, max",
    category: "math",
    icon: "functions",
    tags: ["average", "mean", "statistics", "math"],
    implemented: true,
  },
  {
    slug: "matrix-calculator",
    title: "Matrix Calculator",
    description:
      "Add, multiply, transpose matrices and calculate determinants with step-by-step results.",
    shortDesc: "Add, multiply, transpose, determinant",
    category: "math",
    icon: "grid_on",
    tags: ["matrix", "linear algebra", "math"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Hard",
  },
  {
    slug: "quadratic-solver",
    title: "Quadratic Equation Solver",
    description:
      "Solve quadratic equations with a visual parabola graph and step-by-step solutions.",
    shortDesc: "Solve quadratics with parabola graph",
    category: "math",
    icon: "show_chart",
    tags: ["quadratic", "equation", "graph", "math"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Medium",
  },
  {
    slug: "standard-deviation-calculator",
    title: "Statistics Calculator",
    description:
      "Calculate mean, median, mode, standard deviation, and variance for any dataset.",
    shortDesc: "Mean, median, mode, std dev, variance",
    category: "math",
    icon: "analytics",
    tags: ["statistics", "standard deviation", "variance", "math"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },
  {
    slug: "number-base-converter",
    title: "Number Base Converter",
    description:
      "Convert numbers between binary, octal, decimal, and hexadecimal with live conversion.",
    shortDesc: "Binary, octal, decimal, hex conversion",
    category: "math",
    icon: "pin",
    tags: ["binary", "hexadecimal", "base conversion", "math"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },

  // Finance
  {
    slug: "emi-calculator",
    title: "EMI Calculator",
    description:
      "Calculate your monthly EMI for home loans, car loans, and personal loans.",
    shortDesc: "Calculate monthly loan EMI",
    category: "finance",
    icon: "payments",
    tags: ["emi", "loan", "finance"],
    implemented: true,
    featured: true,
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    description:
      "See how your investments grow over time with compound interest calculations.",
    shortDesc: "Project investment growth",
    category: "finance",
    icon: "trending_up",
    tags: ["compound interest", "investment", "finance"],
    implemented: true,
    featured: true,
  },
  {
    slug: "salary-calculator",
    title: "Salary Calculator",
    description:
      "Convert between annual, monthly, and hourly salary rates.",
    shortDesc: "Convert salary rates",
    category: "finance",
    icon: "attach_money",
    tags: ["salary", "income", "finance"],
    implemented: true,
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator",
    description:
      "Calculate tip amount and split the bill evenly among multiple people.",
    shortDesc: "Tip and split the bill",
    category: "finance",
    icon: "restaurant",
    tags: ["tip", "restaurant", "finance"],
    implemented: true,
  },
  {
    slug: "percentage-change-calculator",
    title: "Percentage Change Calculator",
    description:
      "Calculate the percentage increase or decrease between two values.",
    shortDesc: "Percent increase or decrease",
    category: "finance",
    icon: "trending_up",
    tags: ["percentage change", "growth", "finance"],
    implemented: true,
  },
  {
    slug: "cagr-calculator",
    title: "CAGR Calculator",
    description:
      "Calculate Compound Annual Growth Rate with an interactive growth chart.",
    shortDesc: "Compound annual growth rate + chart",
    category: "finance",
    icon: "trending_up",
    tags: ["cagr", "growth rate", "investment", "finance"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    description:
      "Calculate return on investment with timeline projections and breakdowns.",
    shortDesc: "Return on investment with timeline",
    category: "finance",
    icon: "savings",
    tags: ["roi", "return on investment", "finance"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },
  {
    slug: "break-even-calculator",
    title: "Break-Even Calculator",
    description:
      "Find your break-even point using fixed and variable costs with a visual chart.",
    shortDesc: "Fixed/variable costs, visual chart",
    category: "finance",
    icon: "balance",
    tags: ["break even", "business", "finance"],
    implemented: false,
    searchVolume: "Medium",
    difficulty: "Medium",
  },

  // Fitness & Health
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index and see your weight category based on height and weight.",
    shortDesc: "Check your body mass index",
    category: "fitness",
    icon: "monitor_weight",
    tags: ["bmi", "health", "fitness"],
    implemented: true,
    featured: true,
  },
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    description:
      "Estimate daily calorie needs based on age, weight, height, and activity level.",
    shortDesc: "Daily calorie needs",
    category: "fitness",
    icon: "restaurant",
    tags: ["calories", "diet", "fitness"],
    implemented: true,
  },
  {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    description:
      "Find your ideal body weight range based on height using multiple formulas.",
    shortDesc: "Find your ideal weight",
    category: "fitness",
    icon: "scale",
    tags: ["ideal weight", "health", "fitness"],
    implemented: true,
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days from your date of birth.",
    shortDesc: "Exact age from birth date",
    category: "fitness",
    icon: "cake",
    tags: ["age", "birthday", "date"],
    implemented: true,
    featured: true,
  },
  {
    slug: "macro-calculator",
    title: "Macro Calculator",
    description:
      "Calculate protein, carbs, and fat targets based on your fitness goal and body stats.",
    shortDesc: "Protein, carbs, fat targets by goal",
    category: "fitness",
    icon: "restaurant_menu",
    tags: ["macros", "nutrition", "diet", "fitness"],
    implemented: false,
    searchVolume: "Very High",
    difficulty: "Doable",
  },
  {
    slug: "one-rep-max-calculator",
    title: "One Rep Max Calculator",
    description:
      "Estimate your one-rep max using multiple formulas for all major lifts.",
    shortDesc: "Multiple formulas, all major lifts",
    category: "fitness",
    icon: "fitness_center",
    tags: ["one rep max", "strength", "gym", "fitness"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },

  // Text Tools
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs in your text instantly.",
    shortDesc: "Count words and characters",
    category: "text",
    icon: "text_fields",
    tags: ["word count", "text", "writing"],
    implemented: true,
    featured: true,
  },
  {
    slug: "character-counter",
    title: "Character Counter",
    description:
      "Count characters with and without spaces for social media and SEO limits.",
    shortDesc: "Count characters with spaces",
    category: "text",
    icon: "counter_1",
    tags: ["character count", "text", "seo"],
    implemented: true,
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, and more.",
    shortDesc: "Change text case instantly",
    category: "text",
    icon: "title",
    tags: ["case converter", "text", "uppercase", "lowercase"],
    implemented: true,
  },
  {
    slug: "text-repeater",
    title: "Text Repeater",
    description:
      "Repeat any text multiple times with a custom separator between copies.",
    shortDesc: "Repeat text with separator",
    category: "text",
    icon: "repeat",
    tags: ["text repeater", "duplicate", "text"],
    implemented: true,
  },
  {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description:
      "Generate placeholder lorem ipsum text for design mockups and prototypes.",
    shortDesc: "Generate placeholder text",
    category: "text",
    icon: "article",
    tags: ["lorem ipsum", "placeholder", "text"],
    implemented: true,
  },

  // Color & Design
  {
    slug: "color-converter",
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, HSL, and CMYK color formats.",
    shortDesc: "Convert color formats",
    category: "color",
    icon: "invert_colors",
    tags: ["color", "hex", "rgb", "design"],
    implemented: true,
  },

  // Unit Converters
  {
    slug: "unit-converter",
    title: "Unit Converter",
    description:
      "Convert between common units of length, weight, volume, and more.",
    shortDesc: "Convert any unit",
    category: "converter",
    icon: "sync_alt",
    tags: ["unit converter", "metric", "imperial"],
    implemented: true,
    featured: true,
  },
  {
    slug: "timezone-converter",
    title: "Timezone Converter",
    description:
      "Convert times across world clocks with DST awareness and a meeting planner.",
    shortDesc: "World clock, DST aware, meeting planner",
    category: "converter",
    icon: "public",
    tags: ["timezone", "world clock", "meeting planner"],
    implemented: false,
    searchVolume: "Very High",
    difficulty: "Medium",
  },
  {
    slug: "cooking-converter",
    title: "Cooking Measurement Converter",
    description:
      "Convert cups, tablespoons, milliliters, and grams by ingredient for recipes.",
    shortDesc: "Cups, tbsp, ml, grams by ingredient",
    category: "converter",
    icon: "skillet",
    tags: ["cooking", "recipe", "measurement", "converter"],
    implemented: false,
    searchVolume: "High",
    difficulty: "Doable",
  },

  // Developer Tools
  {
    slug: "regex-tester",
    title: "Regex Tester & Debugger",
    description:
      "Test regular expressions with live match highlighting, capture groups, and flags.",
    shortDesc: "Live match highlighting, capture groups",
    category: "developer",
    icon: "regular_expression",
    tags: ["regex", "regular expression", "developer"],
    implemented: true,
    featured: true,
    searchVolume: "Very High",
    difficulty: "Hard",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    description:
      "Format, minify, validate JSON data with a collapsible tree view and syntax highlighting.",
    shortDesc: "Format, minify, validate, tree view",
    category: "developer",
    icon: "data_object",
    tags: ["json", "formatter", "validator", "developer"],
    implemented: true,
    featured: true,
    searchVolume: "Very High",
    difficulty: "Medium",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder & Inspector",
    description:
      "Decode JWT header and payload, check expiry, and inspect claims instantly.",
    shortDesc: "Decode header/payload, expiry check",
    category: "developer",
    icon: "vpn_key",
    tags: ["jwt", "token", "decode", "developer"],
    implemented: true,
    featured: true,
    searchVolume: "High",
    difficulty: "Medium",
  },
  {
    slug: "cron-expression-generator",
    title: "Cron Expression Generator",
    description:
      "Build cron expressions visually with human-readable schedule translation.",
    shortDesc: "Visual builder + human-readable output",
    category: "developer",
    icon: "schedule",
    tags: ["cron", "schedule", "developer"],
    implemented: true,
    searchVolume: "High",
    difficulty: "Hard",
  },
  {
    slug: "gradient-generator",
    title: "CSS Gradient Generator",
    description:
      "Create CSS gradients with live preview and copy-ready CSS code.",
    shortDesc: "Live preview + copy CSS",
    category: "developer",
    icon: "gradient",
    tags: ["css", "gradient", "design", "developer"],
    implemented: true,
    searchVolume: "High",
    difficulty: "Hard",
  },
  {
    slug: "color-palette-generator",
    title: "Color Palette Generator",
    description:
      "Generate complementary, triadic, and analogous color palettes for design projects.",
    shortDesc: "Complementary, triadic, analogous palettes",
    category: "developer",
    icon: "palette",
    tags: ["color palette", "design", "developer"],
    implemented: true,
    searchVolume: "High",
    difficulty: "Medium",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text input.",
    shortDesc: "MD5, SHA-1, SHA-256, SHA-512",
    category: "developer",
    icon: "tag",
    tags: ["hash", "sha256", "md5", "developer"],
    implemented: true,
    searchVolume: "High",
    difficulty: "Doable",
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor & Preview",
    description:
      "Write markdown in a split-pane editor with live HTML preview.",
    shortDesc: "Split-pane live preview",
    category: "developer",
    icon: "markdown",
    tags: ["markdown", "editor", "preview", "developer"],
    implemented: true,
    searchVolume: "Medium",
    difficulty: "Medium",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getImplementedTools(): Tool[] {
  return tools.filter((tool) => tool.implemented);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured && tool.implemented);
}

export function getCategoriesWithImplementedTools(): Tool["category"][] {
  const categories = new Set<Tool["category"]>();
  for (const tool of tools) {
    if (tool.implemented) {
      categories.add(tool.category);
    }
  }
  return Array.from(categories);
}
