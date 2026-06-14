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
    featured: true,
  },
  {
    slug: "fraction-calculator",
    title: "Fraction Calculator",
    description:
      "Add, subtract, multiply, and divide fractions with step-by-step results.",
    shortDesc: "Add, subtract, multiply fractions",
    category: "math",
    icon: "calculate",
  },
  {
    slug: "average-calculator",
    title: "Average Calculator",
    description:
      "Calculate the mean, median, and average of a set of numbers quickly.",
    shortDesc: "Find mean and median averages",
    category: "math",
    icon: "functions",
  },
  {
    slug: "ratio-calculator",
    title: "Ratio Calculator",
    description:
      "Simplify ratios and solve proportion problems with ease.",
    shortDesc: "Simplify and solve ratios",
    category: "math",
    icon: "compare_arrows",
  },
  {
    slug: "square-root-calculator",
    title: "Square Root Calculator",
    description:
      "Find the square root of any number with precise decimal results.",
    shortDesc: "Calculate square roots",
    category: "math",
    icon: "square_root",
  },
  {
    slug: "lcm-gcd-calculator",
    title: "LCM & GCD Calculator",
    description:
      "Find the least common multiple and greatest common divisor of two or more numbers.",
    shortDesc: "Find LCM and GCD of numbers",
    category: "math",
    icon: "pin",
  },
  {
    slug: "scientific-calculator",
    title: "Scientific Calculator",
    description:
      "Perform advanced math operations including trigonometry, logarithms, and exponents.",
    shortDesc: "Advanced math operations online",
    category: "math",
    icon: "science",
    featured: true,
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
    featured: true,
  },
  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Calculate total interest, monthly payments, and amortization for any loan.",
    shortDesc: "Total interest and payments",
    category: "finance",
    icon: "account_balance",
  },
  {
    slug: "sip-calculator",
    title: "SIP Calculator",
    description:
      "Estimate returns on systematic investment plans with monthly contributions.",
    shortDesc: "Estimate SIP returns",
    category: "finance",
    icon: "savings",
  },
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    description:
      "Calculate monthly mortgage payments including principal and interest.",
    shortDesc: "Monthly mortgage payments",
    category: "finance",
    icon: "home",
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator",
    description:
      "Add or remove GST from any amount and calculate net and gross prices.",
    shortDesc: "Add or remove GST",
    category: "finance",
    icon: "receipt_long",
  },
  {
    slug: "salary-calculator",
    title: "Salary Calculator",
    description:
      "Convert between annual, monthly, and hourly salary rates.",
    shortDesc: "Convert salary rates",
    category: "finance",
    icon: "attach_money",
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
    featured: true,
  },
  {
    slug: "bmr-calculator",
    title: "BMR Calculator",
    description:
      "Calculate your Basal Metabolic Rate — the calories your body burns at rest.",
    shortDesc: "Calories burned at rest",
    category: "fitness",
    icon: "local_fire_department",
  },
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    description:
      "Estimate daily calorie needs based on age, weight, height, and activity level.",
    shortDesc: "Daily calorie needs",
    category: "fitness",
    icon: "restaurant",
  },
  {
    slug: "body-fat-calculator",
    title: "Body Fat Calculator",
    description:
      "Estimate body fat percentage using the US Navy method with body measurements.",
    shortDesc: "Estimate body fat %",
    category: "fitness",
    icon: "fitness_center",
  },
  {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    description:
      "Find your ideal body weight range based on height using multiple formulas.",
    shortDesc: "Find your ideal weight",
    category: "fitness",
    icon: "scale",
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days from your date of birth.",
    shortDesc: "Exact age from birth date",
    category: "fitness",
    icon: "cake",
    featured: true,
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
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, and more.",
    shortDesc: "Change text case instantly",
    category: "text",
    icon: "title",
  },
  {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description:
      "Generate placeholder lorem ipsum text for design mockups and prototypes.",
    shortDesc: "Generate placeholder text",
    category: "text",
    icon: "article",
  },
  {
    slug: "text-diff",
    title: "Text Diff",
    description:
      "Compare two texts side by side and highlight the differences between them.",
    shortDesc: "Compare two texts",
    category: "text",
    icon: "difference",
  },
  {
    slug: "remove-duplicates",
    title: "Remove Duplicates",
    description:
      "Remove duplicate lines from a list of text while preserving order.",
    shortDesc: "Remove duplicate lines",
    category: "text",
    icon: "filter_list",
  },

  // Color & Design
  {
    slug: "color-picker",
    title: "Color Picker",
    description:
      "Pick any color and get its hex, RGB, and HSL values instantly.",
    shortDesc: "Pick and convert colors",
    category: "color",
    icon: "colorize",
    featured: true,
  },
  {
    slug: "hex-to-rgb",
    title: "Hex to RGB Converter",
    description:
      "Convert hex color codes to RGB and RGBA values for web development.",
    shortDesc: "Convert hex to RGB",
    category: "color",
    icon: "palette",
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, HSL, and CMYK color formats.",
    shortDesc: "Convert color formats",
    category: "color",
    icon: "invert_colors",
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
    featured: true,
  },
  {
    slug: "length-converter",
    title: "Length Converter",
    description:
      "Convert between meters, feet, inches, miles, kilometers, and more.",
    shortDesc: "Convert length units",
    category: "converter",
    icon: "straighten",
  },
  {
    slug: "weight-converter",
    title: "Weight Converter",
    description:
      "Convert between kilograms, pounds, ounces, grams, and stones.",
    shortDesc: "Convert weight units",
    category: "converter",
    icon: "scale",
  },
  {
    slug: "temperature-converter",
    title: "Temperature Converter",
    description:
      "Convert between Celsius, Fahrenheit, and Kelvin temperature scales.",
    shortDesc: "Celsius, Fahrenheit, Kelvin",
    category: "converter",
    icon: "thermostat",
  },

  // Developer Tools
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, validate, and beautify JSON data with syntax highlighting.",
    shortDesc: "Format and validate JSON",
    category: "developer",
    icon: "data_object",
    featured: true,
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description:
      "Generate strong, secure random passwords with customizable length and characters.",
    shortDesc: "Generate secure passwords",
    category: "developer",
    icon: "key",
    featured: true,
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    description:
      "Encode and decode text and files to and from Base64 format.",
    shortDesc: "Encode and decode Base64",
    category: "developer",
    icon: "lock",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder",
    description:
      "Encode and decode URLs and query strings for safe web transmission.",
    shortDesc: "Encode and decode URLs",
    category: "developer",
    icon: "link",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured);
}
