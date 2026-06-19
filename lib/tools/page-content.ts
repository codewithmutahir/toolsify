import { getToolBySlug } from "@/constants/tools";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";
import type { Tool } from "@/types/tool";
import type { ToolPageContent } from "@/types/tool-content";

function defaultHowToSteps(tool: Tool) {
  return [
    {
      name: `Open ${tool.title}`,
      text: `Navigate to the ${tool.title} page on Toolsify.`,
    },
    {
      name: "Enter your values",
      text: "Fill in the required inputs in the tool interface above.",
    },
    {
      name: "View results",
      text: "Results update instantly. Copy or use the output as needed.",
    },
  ];
}

function defaultFaqs(tool: Tool) {
  return [
    {
      question: `Is the ${tool.title} free?`,
      answer:
        "Yes. Every tool on Toolsify is free to use with no signup required.",
    },
    {
      question: "Do you store my data?",
      answer:
        "Most Toolsify tools run in your browser. When an API is used, inputs are processed to return a result and are not stored.",
    },
    {
      question: `How accurate is this ${tool.title.toLowerCase()}?`,
      answer: `${tool.description} Results are intended for general use; verify critical calculations independently.`,
    },
  ];
}

function defaultExamples(tool: Tool) {
  return [
    {
      title: "Quick start",
      description: `Use the ${tool.title.toLowerCase()} with typical values for your scenario and review the output above.`,
    },
  ];
}

const CONTENT_OVERRIDES: Partial<Record<ImplementedToolSlug, ToolPageContent>> = {
  "bmi-calculator": {
    introduction:
      "Calculate your Body Mass Index (BMI) instantly from height and weight. Supports metric and imperial units with a visual category indicator.",
    howToSteps: [
      {
        name: "Enter weight",
        text: "Type your weight and choose kilograms or pounds.",
      },
      {
        name: "Enter height",
        text: "Type your height and choose centimeters or feet.",
      },
      {
        name: "Read your BMI",
        text: "Your BMI value and weight category appear in the results section.",
      },
    ],
    examples: [
      {
        title: "Adult metric example",
        description:
          "Weight 70 kg and height 175 cm gives a BMI of about 22.9 (normal weight).",
      },
      {
        title: "Imperial example",
        description:
          "Weight 154 lbs and height 5 ft 9 in converts to metric internally before calculating BMI.",
      },
    ],
    faqs: [
      {
        question: "What is a healthy BMI range?",
        answer:
          "For most adults, a BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight; 25–29.9 is overweight; 30 and above is obese.",
      },
      {
        question: "Is BMI accurate for athletes?",
        answer:
          "BMI does not distinguish muscle from fat. Athletes with high muscle mass may have a high BMI despite low body fat.",
      },
      {
        question: "Is my health data sent to a server?",
        answer:
          "No. BMI calculation can run in your browser. The public API is available for agents and validates the same formula server-side.",
      },
    ],
    article:
      "Body Mass Index (BMI) is a widely used screening measure for weight categories. It is calculated as weight in kilograms divided by height in meters squared. While useful for population-level trends, BMI should be interpreted alongside other health factors.",
  },
  "percentage-calculator": {
    introduction:
      "Find a percentage of a number, determine what percent one value is of another, or calculate percentage increase and decrease.",
    howToSteps: [
      {
        name: "Choose a mode",
        text: "Select X% of Y, X is what % of Y, or percent change between two values.",
      },
      {
        name: "Enter values",
        text: "Type the two numbers required for your selected mode.",
      },
      {
        name: "Read the result",
        text: "The calculated percentage and a plain-language label appear below.",
      },
    ],
    examples: [
      {
        title: "20% of 150",
        description: "Mode: X% of Y. Enter 20 and 150 to get 30.",
      },
      {
        title: "Percent change",
        description: "From 80 to 100 is a 25% increase.",
      },
    ],
    faqs: [
      {
        question: "Can I calculate percent increase and decrease?",
        answer:
          "Yes. Use the percent change tab and enter the original and new values.",
      },
      {
        question: "What if the second number is zero?",
        answer:
          "Division by zero is undefined. The calculator returns no result when the denominator is zero.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No account or payment is required.",
      },
    ],
  },
  "jwt-decoder": {
    introduction:
      "Decode JSON Web Token headers and payloads, inspect claims, and check expiry — entirely in your browser.",
    howToSteps: [
      {
        name: "Paste a JWT",
        text: "Paste a three-part JWT string into the input field.",
      },
      {
        name: "Review decoded parts",
        text: "Inspect the header, payload, and signature sections.",
      },
      {
        name: "Check time claims",
        text: "Look at exp, iat, and nbf for issuance and expiry timing.",
      },
    ],
    examples: [
      {
        title: "Debug a session token",
        description:
          "Paste an access token to confirm audience, issuer, and expiration before troubleshooting auth.",
      },
    ],
    faqs: [
      {
        question: "Is my token uploaded anywhere?",
        answer:
          "Inputs are sent to the Toolsify API for decoding and are not stored. For maximum privacy, use tokens you are comfortable processing through an online service.",
      },
      {
        question: "Does this verify my JWT signature?",
        answer:
          "No. Signature verification requires the issuer's secret or public key. This tool only decodes the header and payload.",
      },
      {
        question: "Why should I be careful pasting JWTs online?",
        answer:
          "JWTs can contain sensitive session data. Only decode tokens you are comfortable exposing.",
      },
    ],
  },
  "hash-generator": {
    introduction:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files instantly in your browser.",
    howToSteps: [
      { name: "Choose input mode", text: "Select Text or File depending on what you want to hash." },
      { name: "Provide input", text: "Paste text or select a file to hash." },
      { name: "Copy a digest", text: "Copy any generated hash with one click." },
    ],
    examples: [
      {
        title: "Checksum a string",
        description: 'Paste "hello" to compare SHA-256 output against known test vectors.',
      },
    ],
    faqs: [
      {
        question: "Is MD5 secure?",
        answer:
          "MD5 is no longer considered secure for passwords or digital signatures. It is still useful for quick checksums and legacy compatibility.",
      },
      {
        question: "Can I hash a file instead of text?",
        answer:
          "Yes. Switch to File mode and select any file. File hashing runs locally in your browser.",
      },
      {
        question: "Does my data leave my browser?",
        answer:
          "Text mode uses the Toolsify API. File mode hashes locally with the Web Crypto API and an in-browser MD5 implementation.",
      },
    ],
  },
  "json-formatter": {
    introduction:
      "Format, minify, and validate JSON with a collapsible tree view and syntax-aware error messages.",
    howToSteps: [
      { name: "Paste JSON", text: "Paste raw JSON into the editor." },
      { name: "Format or minify", text: "Click Format for readable output or Minify for a single line." },
      { name: "Inspect the tree", text: "Expand nodes in the tree view to explore nested structures." },
    ],
    examples: [
      {
        title: "Pretty-print an API response",
        description: "Paste a compact API JSON payload and click Format to make it readable.",
      },
    ],
    faqs: [
      {
        question: "Is this safe for sensitive JSON data?",
        answer:
          "JSON is processed through the Toolsify API to format and validate. Do not paste secrets you cannot send to a server.",
      },
      {
        question: "Can I minify JSON here too?",
        answer:
          "Yes. Use the Minify button to remove whitespace and produce a compact single-line JSON string.",
      },
      {
        question: "Will invalid JSON show where the error is?",
        answer:
          "When possible, the validator reports the parse error message along with an approximate line and column.",
      },
    ],
  },
  "regex-tester": {
    introduction:
      "Test regular expressions against sample text with live match highlighting and capture groups.",
    howToSteps: [
      { name: "Enter a pattern", text: "Type your regex pattern and select flags." },
      { name: "Add test text", text: "Paste or type the string you want to match against." },
      { name: "Review matches", text: "See highlighted matches and capture group details below." },
    ],
    examples: [
      {
        title: "Validate an email pattern",
        description: "Use the Email preset pattern and paste sample addresses to see which match.",
      },
    ],
    faqs: [
      {
        question: "What regex flavor does this use?",
        answer:
          "This tool uses JavaScript regular expressions, the same flavor supported by modern browsers and Node.js.",
      },
      {
        question: "Does my data leave my browser?",
        answer:
          "Pattern matching is processed through the Toolsify API. Avoid pasting confidential text if that is a concern.",
      },
      {
        question: "What do the regex flags mean?",
        answer:
          "g = global, i = case-insensitive, m = multiline, s = dotAll, u = unicode.",
      },
    ],
  },
  "cron-expression-generator": {
    introduction:
      "Build cron expressions visually with human-readable schedule descriptions and upcoming run times.",
    howToSteps: [
      { name: "Use the builder", text: "Set minute, hour, day, month, and weekday fields visually." },
      { name: "Or edit raw", text: "Switch to Raw Input to type a five-field cron string directly." },
      { name: "Copy the expression", text: "Copy the generated cron string for your scheduler or CI config." },
    ],
    examples: [
      {
        title: "Every weekday at 9 AM",
        description: "Minute 0, hour 9, day-of-month *, month *, weekday 1–5 → 0 9 * * 1-5.",
      },
    ],
    faqs: [
      {
        question: "What does * mean in cron?",
        answer:
          "An asterisk means every value for that field. For example, * in the minute field means every minute.",
      },
      {
        question: "How do I run a job every 15 minutes?",
        answer:
          "Use */15 in the minute field with the other fields set to * (for example: */15 * * * *).",
      },
      {
        question: "Can I type a raw cron expression directly?",
        answer:
          "Yes. Switch to Raw Input mode to edit the expression manually while keeping the visual builder in sync when possible.",
      },
    ],
  },
  "word-counter": {
    introduction:
      "Count words, characters, sentences, and paragraphs with reading time estimates and social character-limit progress bars.",
    howToSteps: [
      { name: "Paste or type", text: "Enter or paste your text into the editor." },
      { name: "Review stats", text: "Word, character, and readability stats update as you type." },
      { name: "Check limits", text: "Compare character count against Twitter, LinkedIn, and meta description limits." },
    ],
    examples: [
      {
        title: "Blog post draft",
        description: "Paste a 800-word article to see reading time and Flesch-Kincaid grade level.",
      },
    ],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time assumes roughly 200 words per minute, a common editorial estimate.",
      },
      {
        question: "Is my text stored?",
        answer:
          "Text is sent to the Toolsify API for analysis and is not stored.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No signup is required.",
      },
    ],
  },
  "emi-calculator": {
    introduction:
      "Calculate monthly EMI for home loans, car loans, and personal loans with total interest and principal breakdown.",
    howToSteps: [
      { name: "Enter loan amount", text: "Type the principal loan amount." },
      { name: "Set rate and tenure", text: "Enter annual interest rate and loan tenure in years or months." },
      { name: "View EMI", text: "See monthly EMI, total payment, and interest vs principal split." },
    ],
    examples: [
      {
        title: "Home loan example",
        description: "₹50,00,000 at 8.5% for 20 years gives a monthly EMI you can compare across lenders.",
      },
    ],
    faqs: [
      {
        question: "What is EMI?",
        answer:
          "EMI (Equated Monthly Installment) is a fixed payment toward principal and interest each month.",
      },
      {
        question: "Does this include fees or insurance?",
        answer:
          "No. This calculator covers principal and interest only. Add processing fees separately.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No account or payment is required.",
      },
    ],
  },
  "age-calculator": {
    introduction:
      "Calculate your exact age in years, months, and days from your date of birth, with total days lived and next birthday countdown.",
    howToSteps: [
      { name: "Enter birth date", text: "Select your date of birth using the date picker." },
      { name: "Set as-of date", text: "Optionally choose a different reference date (defaults to today)." },
      { name: "Read your age", text: "View years, months, days, and lifetime statistics." },
    ],
    examples: [
      {
        title: "Birthday countdown",
        description: "See how many days remain until your next birthday from today's date.",
      },
    ],
    faqs: [
      {
        question: "Can I calculate age as of a past date?",
        answer: "Yes. Change the as-of date to compute age on any historical date.",
      },
      {
        question: "Why does my age show months and days?",
        answer:
          "Partial years are expressed as remaining months and days for precision beyond whole years.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No signup is required.",
      },
    ],
  },
  "simple-interest-calculator": {
    introduction:
      "Calculate simple interest and total amount from principal, annual rate, and time in years.",
    howToSteps: [
      { name: "Enter principal", text: "Type the initial loan or investment amount." },
      { name: "Set rate and time", text: "Enter annual interest rate (%) and duration in years." },
      { name: "View results", text: "See interest earned and total amount." },
    ],
    examples: [
      {
        title: "$10,000 at 5% for 3 years",
        description: "Principal 10000, rate 5, time 3 yields $1,500 interest and $11,500 total.",
      },
    ],
    faqs: [
      {
        question: "What is simple interest?",
        answer:
          "Simple interest is calculated only on the original principal, not on accumulated interest.",
      },
      {
        question: "When should I use compound interest instead?",
        answer:
          "Use compound interest when earnings are reinvested and interest accrues on prior interest.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No account is required.",
      },
    ],
  },
  "compound-interest-calculator": {
    introduction:
      "Project how investments grow with compound interest, including year-by-year balance breakdown.",
    howToSteps: [
      { name: "Enter principal", text: "Type your starting investment amount." },
      { name: "Set rate and duration", text: "Enter annual rate, years, and compounding frequency." },
      { name: "Review growth", text: "See total amount, interest earned, and yearly breakdown." },
    ],
    examples: [
      {
        title: "Monthly compounding",
        description: "$10,000 at 8% for 10 years with monthly compounding grows faster than annual compounding.",
      },
    ],
    faqs: [
      {
        question: "What compounding frequencies are supported?",
        answer: "Annually, semi-annually, quarterly, monthly, and daily.",
      },
      {
        question: "Are taxes or fees included?",
        answer: "No. Results show gross growth before taxes, fees, or withdrawals.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No signup is required.",
      },
    ],
  },
  "discount-calculator": {
    introduction:
      "Find the final sale price and total savings from an original price and discount percentage.",
    howToSteps: [
      { name: "Enter original price", text: "Type the full price before discount." },
      { name: "Enter discount percent", text: "Type the discount as a percentage (e.g. 20 for 20% off)." },
      { name: "See savings", text: "View final price and amount saved." },
    ],
    examples: [
      {
        title: "20% off $100",
        description: "Original price 100 with 20% discount gives a final price of $80 and $20 saved.",
      },
    ],
    faqs: [
      {
        question: "Can I enter discounts over 100%?",
        answer: "No. Discounts are limited to 0–100% for valid results.",
      },
      {
        question: "Does this include tax?",
        answer: "No. Tax is calculated on the final price separately depending on your region.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "average-calculator": {
    introduction:
      "Calculate mean, median, mode, minimum, and maximum from any list of numbers.",
    howToSteps: [
      { name: "Enter numbers", text: "Paste or type numbers separated by commas, spaces, or new lines." },
      { name: "Review statistics", text: "Mean, median, mode, min, max, and count appear instantly." },
      { name: "Copy results", text: "Use the stats for homework, spreadsheets, or data summaries." },
    ],
    examples: [
      {
        title: "Test scores",
        description: "Enter 85, 90, 78, 92, 88 to get mean 86.6 and median 88.",
      },
    ],
    faqs: [
      {
        question: "How is the mode calculated?",
        answer: "The mode is the most frequently occurring value. Multiple modes may be listed.",
      },
      {
        question: "What number formats are accepted?",
        answer: "Integers and decimals separated by commas, spaces, or line breaks.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "salary-calculator": {
    introduction:
      "Convert an annual salary into monthly, weekly, daily, and hourly equivalents.",
    howToSteps: [
      { name: "Enter annual salary", text: "Type your yearly gross salary." },
      { name: "View breakdown", text: "See monthly, weekly, daily, and hourly amounts." },
      { name: "Compare offers", text: "Use hourly and monthly figures to compare job offers." },
    ],
    examples: [
      {
        title: "$60,000 per year",
        description: "Equals about $5,000/month, $1,154/week, or $28.85/hour at 40 hours/week.",
      },
    ],
    faqs: [
      {
        question: "What hours per week are assumed?",
        answer: "Hourly rate assumes a 40-hour work week and 52 weeks per year.",
      },
      {
        question: "Is tax deducted?",
        answer: "No. Figures are gross (pre-tax) salary conversions.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "tip-calculator": {
    introduction:
      "Calculate tip amount, total bill, and per-person share when splitting with friends.",
    howToSteps: [
      { name: "Enter bill amount", text: "Type the pre-tip bill total." },
      { name: "Set tip and party size", text: "Choose tip percentage and number of people." },
      { name: "Split the bill", text: "See tip, total, and amount per person." },
    ],
    examples: [
      {
        title: "$50 bill, 18% tip, 2 people",
        description: "Tip $9, total $59, and $29.50 per person.",
      },
    ],
    faqs: [
      {
        question: "Are quick tip buttons available?",
        answer: "Yes. Tap 10%, 15%, 18%, 20%, or 25% for common tip rates.",
      },
      {
        question: "Is tip calculated before or after tax?",
        answer: "Tip is calculated on the bill amount you enter (typically pre-tax).",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "percentage-change-calculator": {
    introduction:
      "Find the percent increase or decrease between an original value and a new value.",
    howToSteps: [
      { name: "Enter original value", text: "Type the starting amount." },
      { name: "Enter new value", text: "Type the updated amount." },
      { name: "Read percent change", text: "See percentage change and absolute difference." },
    ],
    examples: [
      {
        title: "Price increase",
        description: "From $80 to $100 is a +25% change with an absolute increase of $20.",
      },
    ],
    faqs: [
      {
        question: "What if the original value is zero?",
        answer: "Percent change from zero is undefined; the calculator returns no result.",
      },
      {
        question: "Can this show decreases?",
        answer: "Yes. Negative percent change indicates a decrease from the original.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "calorie-calculator": {
    introduction:
      "Estimate daily calorie needs (BMR and TDEE) using the Mifflin-St Jeor equation and activity level.",
    howToSteps: [
      { name: "Enter body stats", text: "Provide age, gender, weight (kg), and height (cm)." },
      { name: "Select activity level", text: "Choose how active you are day to day." },
      { name: "View calorie targets", text: "See maintenance, weight loss, and weight gain targets." },
    ],
    examples: [
      {
        title: "Moderately active adult",
        description: "A 30-year-old at 70 kg and 175 cm with moderate activity gets a TDEE estimate for meal planning.",
      },
    ],
    faqs: [
      {
        question: "What formula is used?",
        answer: "The Mifflin-St Jeor equation for BMR, multiplied by an activity factor for TDEE.",
      },
      {
        question: "Are these medical recommendations?",
        answer:
          "No. Results are estimates. Consult a healthcare provider for personalized nutrition advice.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "ideal-weight-calculator": {
    introduction:
      "Estimate ideal body weight using Devine, Robinson, Miller, and Hamwi formulas based on height and gender.",
    howToSteps: [
      { name: "Enter height", text: "Type your height in centimeters." },
      { name: "Select gender", text: "Choose male or female for formula selection." },
      { name: "Compare formulas", text: "Review each formula result and the suggested weight range." },
    ],
    examples: [
      {
        title: "175 cm male",
        description: "Compare four clinical formulas to see a recommended weight range in kg and lbs.",
      },
    ],
    faqs: [
      {
        question: "Which formula is most accurate?",
        answer:
          "Each formula was developed for different populations. The range across all four is often more useful than any single result.",
      },
      {
        question: "Does this account for muscle mass?",
        answer: "No. Athletes and muscular individuals may weigh more than these estimates suggest.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "unit-converter": {
    introduction:
      "Convert length, weight, temperature, speed, and area between metric and imperial units instantly.",
    howToSteps: [
      { name: "Pick a category", text: "Select length, weight, temperature, speed, or area." },
      { name: "Choose units", text: "Set from and to units (e.g. miles to kilometers)." },
      { name: "Enter a value", text: "Type the amount to convert and copy the result." },
    ],
    examples: [
      {
        title: "Miles to kilometers",
        description: "Convert 26.2 miles (marathon distance) to approximately 42.16 km.",
      },
    ],
    faqs: [
      {
        question: "How precise are conversions?",
        answer: "Results use standard conversion factors with up to six decimal places.",
      },
      {
        question: "Does temperature use Celsius or Fahrenheit?",
        answer: "Both. Select °C, °F, or Kelvin in the temperature category.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "color-converter": {
    introduction:
      "Convert colors between HEX, RGB, and HSL with a live preview swatch.",
    howToSteps: [
      { name: "Pick a format", text: "Edit HEX, RGB, or HSL — other formats update automatically." },
      { name: "Adjust values", text: "Fine-tune channels with inputs or the color preview." },
      { name: "Copy values", text: "Use converted values in CSS, design tools, or code." },
    ],
    examples: [
      {
        title: "Brand orange #FF6B35",
        description: "Converts to rgb(255, 107, 53) and hsl(18, 100%, 60%).",
      },
    ],
    faqs: [
      {
        question: "Which color formats are supported?",
        answer: "HEX (#RRGGBB), RGB (0–255), and HSL (hue 0–360, saturation and lightness 0–100%).",
      },
      {
        question: "Can I paste CSS color values?",
        answer: "Paste hex codes directly. RGB and HSL values can be entered in the respective fields.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "color-palette-generator": {
    introduction:
      "Generate complementary, analogous, triadic, and monochromatic palettes from a base color.",
    howToSteps: [
      { name: "Choose a base color", text: "Pick or type a hex color as your starting point." },
      { name: "Browse harmonies", text: "Review complementary, analogous, triadic, and monochromatic sets." },
      { name: "Copy swatches", text: "Click any swatch to copy its hex code." },
    ],
    examples: [
      {
        title: "Design system seed color",
        description: "Start from #FF6B35 to build a cohesive palette for a landing page.",
      },
    ],
    faqs: [
      {
        question: "What is a complementary palette?",
        answer: "Colors opposite on the color wheel — high contrast for accents and CTAs.",
      },
      {
        question: "Can I randomize the base color?",
        answer: "Yes. Use the random color control to explore new combinations.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "gradient-generator": {
    introduction:
      "Create CSS linear gradients with live preview, draggable color stops, and copy-ready code.",
    howToSteps: [
      { name: "Add color stops", text: "Set two or more colors and their positions on the gradient." },
      { name: "Adjust angle", text: "Change gradient direction in degrees." },
      { name: "Copy CSS", text: "Copy the generated linear-gradient() rule for your stylesheet." },
    ],
    examples: [
      {
        title: "Sunset hero background",
        description: "Blend #FF6B35 to #0058BE at 135deg for a vibrant header gradient.",
      },
    ],
    faqs: [
      {
        question: "What CSS syntax is generated?",
        answer: "Standard linear-gradient() with degree angle and color-stop percentages.",
      },
      {
        question: "Can I use more than two colors?",
        answer: "Yes. Add multiple stops for richer multi-color gradients.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "markdown-editor": {
    introduction:
      "Write Markdown in a split-pane editor with live HTML preview powered by a secure sanitizer.",
    howToSteps: [
      { name: "Write Markdown", text: "Type headings, lists, links, and code blocks in the editor pane." },
      { name: "Preview live", text: "See rendered HTML update as you type." },
      { name: "Copy output", text: "Copy Markdown source or use the preview for documentation drafts." },
    ],
    examples: [
      {
        title: "README draft",
        description: "Write a project README with headings and bullet lists, then preview before publishing.",
      },
    ],
    faqs: [
      {
        question: "Is GitHub Flavored Markdown supported?",
        answer: "Common Markdown syntax is supported. Some GFM extensions may vary.",
      },
      {
        question: "Is the preview sanitized?",
        answer: "Yes. HTML output is sanitized before rendering to reduce XSS risk.",
      },
      {
        question: "Is my content stored?",
        answer: "No. Editing and preview happen in your browser; content is not saved on our servers.",
      },
    ],
  },
  "character-counter": {
    introduction:
      "Count characters with and without spaces, plus platform-specific limit progress for social posts.",
    howToSteps: [
      { name: "Paste text", text: "Type or paste your caption, meta description, or post." },
      { name: "Review counts", text: "See characters, words, lines, and bytes." },
      { name: "Check limits", text: "Progress bars show proximity to Twitter, LinkedIn, and SMS limits." },
    ],
    examples: [
      {
        title: "Tweet draft",
        description: "Verify a post stays within 280 characters before publishing.",
      },
    ],
    faqs: [
      {
        question: "Are emojis counted as one character?",
        answer: "Emojis may count as multiple Unicode code units depending on the platform.",
      },
      {
        question: "What limits are shown?",
        answer: "Common limits for Twitter/X, LinkedIn, Instagram, and SMS are included.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "case-converter": {
    introduction:
      "Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, or kebab-case.",
    howToSteps: [
      { name: "Paste text", text: "Enter the string you want to transform." },
      { name: "Pick a case style", text: "Select from seven common naming and formatting conventions." },
      { name: "Copy output", text: "Copy the converted text for code, titles, or data cleanup." },
    ],
    examples: [
      {
        title: "Variable naming",
        description: 'Convert "user profile id" to userProfileId (camelCase) or user_profile_id (snake_case).',
      },
    ],
    faqs: [
      {
        question: "What is title case?",
        answer: "Capitalizes the first letter of each major word, common for headings.",
      },
      {
        question: "Does camelCase handle spaces?",
        answer: "Yes. Words are split on spaces and punctuation before casing rules are applied.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "text-repeater": {
    introduction:
      "Repeat any text a specified number of times with a custom separator between copies.",
    howToSteps: [
      { name: "Enter text", text: "Type the string to repeat." },
      { name: "Set count and separator", text: "Choose how many times to repeat and what goes between copies." },
      { name: "Copy output", text: "Copy the repeated result for testing or bulk data." },
    ],
    examples: [
      {
        title: "Generate test lines",
        description: 'Repeat "test" 5 times with newline separator for mock log data.',
      },
    ],
    faqs: [
      {
        question: "Is there a maximum repeat count?",
        answer: "Very large counts may be slow or hit API limits. Use reasonable values for testing.",
      },
      {
        question: "Can I use a custom separator?",
        answer: "Yes. Use comma, newline, space, or any custom separator string.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
  "lorem-ipsum-generator": {
    introduction:
      "Generate placeholder Lorem Ipsum paragraphs for mockups, wireframes, and design comps.",
    howToSteps: [
      { name: "Choose paragraph count", text: "Select how many paragraphs to generate (1–20)." },
      { name: "Optional HTML wrap", text: "Enable <p> tags for direct use in HTML prototypes." },
      { name: "Generate and copy", text: "Click Generate, then copy the placeholder text." },
    ],
    examples: [
      {
        title: "Landing page mockup",
        description: "Generate 3 paragraphs of filler text for a hero and feature section layout.",
      },
    ],
    faqs: [
      {
        question: "Is the text random each time?",
        answer: "Yes. Each generation produces varied Lorem Ipsum-style placeholder content.",
      },
      {
        question: "What does HTML wrap do?",
        answer: "Wraps each paragraph in <p> tags for quick HTML prototyping.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes.",
      },
    ],
  },
};

function buildDefaultContent(tool: Tool): ToolPageContent {
  return {
    introduction: tool.description,
    howToSteps: defaultHowToSteps(tool),
    examples: defaultExamples(tool),
    faqs: defaultFaqs(tool),
  };
}

export function getToolPageContent(slug: ImplementedToolSlug): ToolPageContent {
  const tool = getToolBySlug(slug);
  if (!tool) {
    throw new Error(`Unknown tool slug: ${slug}`);
  }

  const override = CONTENT_OVERRIDES[slug];
  if (!override) {
    return buildDefaultContent(tool);
  }

  const defaults = buildDefaultContent(tool);
  return {
    introduction: override.introduction ?? defaults.introduction,
    howToSteps: override.howToSteps ?? defaults.howToSteps,
    examples: override.examples ?? defaults.examples,
    faqs: override.faqs ?? defaults.faqs,
    article: override.article,
  };
}
