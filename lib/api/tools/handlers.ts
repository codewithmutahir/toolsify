import { calculateAge } from "@/lib/calculators/age";
import { calculateAverage } from "@/lib/calculators/average";
import { calculateBMI } from "@/lib/calculators/bmi";
import { convertCase } from "@/lib/calculators/case-converter";
import { calculateCalories } from "@/lib/calculators/calorie";
import { analyzeCharacters } from "@/lib/calculators/character-counter";
import {
  colorFromHex,
  colorFromHsl,
  colorFromRgb,
} from "@/lib/calculators/color-converter";
import {
  calculateCompoundInterest,
  type CompoundingFrequency,
} from "@/lib/calculators/compound-interest";
import { calculateDiscount } from "@/lib/calculators/discount";
import { calculateEMI } from "@/lib/calculators/emi";
import { calculateIdealWeight } from "@/lib/calculators/ideal-weight";
import { generateLoremIpsum } from "@/lib/calculators/lorem-ipsum";
import { calculatePercentage } from "@/lib/calculators/percentage";
import { calculatePercentageChange } from "@/lib/calculators/percentage-change";
import { calculateSalary } from "@/lib/calculators/salary";
import { calculateSimpleInterest } from "@/lib/calculators/simple-interest";
import { repeatText } from "@/lib/calculators/text-repeater";
import { calculateTip } from "@/lib/calculators/tip";
import {
  convertUnit,
  getCategoryUnits,
  type UnitCategory,
} from "@/lib/calculators/unit-converter";
import { analyzeText } from "@/lib/calculators/word-counter";
import {
  describeCronExpression,
  getNextCronRuns,
  parseCronExpression,
} from "@/lib/developer/cron";
import { generatePalettes } from "@/lib/developer/color-palette";
import { hashAll } from "@/lib/developer/hash";
import { formatJson, minifyJson, parseJson } from "@/lib/developer/json";
import { decodeJwt } from "@/lib/developer/jwt";
import { evaluateRegex, type RegexFlag } from "@/lib/developer/regex";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";

export type ToolApiHandler = (
  body: Record<string, unknown>
) => Promise<unknown> | unknown;

function requireNumber(value: unknown, field: string): number {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) {
    throw new Error(`"${field}" must be a valid number.`);
  }
  return num;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`"${field}" is required.`);
  }
  return value;
}

const handlers: Record<ImplementedToolSlug, ToolApiHandler> = {
  "bmi-calculator": (body) => {
    const weight = requireNumber(body.weight, "weight");
    const height = requireNumber(body.height, "height");
    const weightUnit = body.weightUnit === "lbs" ? "lbs" : "kg";
    const heightUnit = body.heightUnit === "ft" ? "ft" : "cm";
    const result = calculateBMI(weight, height, weightUnit, heightUnit);
    if (!result) throw new Error("Invalid weight or height values.");
    return result;
  },

  "percentage-calculator": (body) => {
    const mode = body.mode as "of" | "what-percent" | "change";
    if (!["of", "what-percent", "change"].includes(mode)) {
      throw new Error('Invalid mode. Use "of", "what-percent", or "change".');
    }
    const a = requireNumber(body.a, "a");
    const b = requireNumber(body.b, "b");
    const result = calculatePercentage(mode, a, b);
    if (!result) throw new Error("Could not calculate percentage with the given values.");
    return result;
  },

  "word-counter": (body) => {
    const text = requireString(body.text, "text");
    return analyzeText(text);
  },

  "emi-calculator": (body) => {
    const principal = requireNumber(body.principal, "principal");
    const annualRate = requireNumber(body.annualRate, "annualRate");
    const tenure = requireNumber(body.tenure, "tenure");
    const tenureUnit = body.tenureUnit === "years" ? "years" : "months";
    const result = calculateEMI(principal, annualRate, tenure, tenureUnit);
    if (!result) throw new Error("Invalid loan parameters.");
    return result;
  },

  "age-calculator": (body) => {
    const birthDate = new Date(requireString(body.birthDate, "birthDate"));
    const asOfDate = body.asOfDate
      ? new Date(requireString(body.asOfDate, "asOfDate"))
      : new Date();
    const result = calculateAge(birthDate, asOfDate);
    if (!result) throw new Error("Invalid birth date or as-of date.");
    return result;
  },

  "simple-interest-calculator": (body) => {
    const principal = requireNumber(body.principal, "principal");
    const rate = requireNumber(body.rate, "rate");
    const time = requireNumber(body.time, "time");
    const result = calculateSimpleInterest(principal, rate, time);
    if (!result) throw new Error("Invalid simple interest parameters.");
    return result;
  },

  "compound-interest-calculator": (body) => {
    const principal = requireNumber(body.principal, "principal");
    const rate = requireNumber(body.rate, "rate");
    const years = requireNumber(body.years, "years");
    const frequency = requireString(body.frequency, "frequency") as CompoundingFrequency;
    const result = calculateCompoundInterest(principal, rate, years, frequency);
    if (!result) throw new Error("Invalid compound interest parameters.");
    return result;
  },

  "discount-calculator": (body) => {
    const originalPrice = requireNumber(body.originalPrice, "originalPrice");
    const discountPercent = requireNumber(body.discountPercent, "discountPercent");
    const result = calculateDiscount(originalPrice, discountPercent);
    if (!result) throw new Error("Invalid discount parameters.");
    return result;
  },

  "average-calculator": (body) => {
    const values = body.values;
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('"values" must be a non-empty array of numbers.');
    }
    const numbers = values.map((v, i) => requireNumber(v, `values[${i}]`));
    const result = calculateAverage(numbers);
    if (!result) throw new Error("Could not calculate average.");
    return result;
  },

  "character-counter": (body) => {
    const text = requireString(body.text, "text");
    return analyzeCharacters(text);
  },

  "case-converter": (body) => {
    const text = requireString(body.text, "text");
    const mode = requireString(body.mode, "mode");
    return convertCase(text, mode as Parameters<typeof convertCase>[1]);
  },

  "text-repeater": (body) => {
    const text = requireString(body.text, "text");
    const count = requireNumber(body.count, "count");
    const separator = typeof body.separator === "string" ? body.separator : "\n";
    return { output: repeatText(text, count, separator) };
  },

  "lorem-ipsum-generator": (body) => {
    const paragraphs = requireNumber(body.paragraphs, "paragraphs");
    const wrapHtml = body.wrapHtml === true;
    return { text: generateLoremIpsum(paragraphs, wrapHtml) };
  },

  "salary-calculator": (body) => {
    const annualSalary = requireNumber(body.annualSalary, "annualSalary");
    const result = calculateSalary(annualSalary);
    if (!result) throw new Error("Invalid annual salary.");
    return result;
  },

  "tip-calculator": (body) => {
    const bill = requireNumber(body.bill, "bill");
    const tipPercent = requireNumber(body.tipPercent, "tipPercent");
    const people = requireNumber(body.people, "people");
    const result = calculateTip(bill, tipPercent, people);
    if (!result) throw new Error("Invalid tip calculation parameters.");
    return result;
  },

  "percentage-change-calculator": (body) => {
    const from = requireNumber(body.from, "from");
    const to = requireNumber(body.to, "to");
    const result = calculatePercentageChange(from, to);
    if (!result) throw new Error("Invalid percentage change values.");
    return result;
  },

  "calorie-calculator": (body) => {
    const age = requireNumber(body.age, "age");
    const weightKg = requireNumber(body.weightKg, "weightKg");
    const heightCm = requireNumber(body.heightCm, "heightCm");
    const gender = body.gender === "female" ? "female" : "male";
    const activity = requireString(body.activity, "activity");
    const result = calculateCalories(
      age,
      gender,
      weightKg,
      heightCm,
      activity as Parameters<typeof calculateCalories>[4]
    );
    if (!result) throw new Error("Invalid calorie calculation parameters.");
    return result;
  },

  "ideal-weight-calculator": (body) => {
    const heightCm = requireNumber(body.heightCm, "heightCm");
    const gender = body.gender === "female" ? "female" : "male";
    const result = calculateIdealWeight(heightCm, gender);
    if (!result) throw new Error("Invalid ideal weight parameters.");
    return result;
  },

  "unit-converter": (body) => {
    const value = requireNumber(body.value, "value");
    const from = requireString(body.from, "from");
    const to = requireString(body.to, "to");
    const category = requireString(body.category, "category") as UnitCategory;
    const units = getCategoryUnits(category);
    const fromUnit = units.find((unit) => unit.id === from);
    const toUnit = units.find((unit) => unit.id === to);
    if (!fromUnit || !toUnit) {
      throw new Error("Invalid unit or category.");
    }
    const result = convertUnit(value, fromUnit, toUnit);
    if (result === null) throw new Error("Invalid unit conversion parameters.");
    return { value: result, from, to, category };
  },

  "color-converter": (body) => {
    const format = requireString(body.format, "format");
    if (format === "hex") {
      const result = colorFromHex(requireString(body.hex, "hex"));
      if (!result) throw new Error("Invalid hex color.");
      return result;
    }
    if (format === "rgb") {
      const result = colorFromRgb(
        requireNumber(body.r, "r"),
        requireNumber(body.g, "g"),
        requireNumber(body.b, "b")
      );
      if (!result) throw new Error("Invalid RGB color.");
      return result;
    }
    if (format === "hsl") {
      const result = colorFromHsl(
        requireNumber(body.h, "h"),
        requireNumber(body.s, "s"),
        requireNumber(body.l, "l")
      );
      if (!result) throw new Error("Invalid HSL color.");
      return result;
    }
    throw new Error('Invalid format. Use "hex", "rgb", or "hsl".');
  },

  "hash-generator": async (body) => {
    const text = requireString(body.text, "text");
    return hashAll(text);
  },

  "json-formatter": (body) => {
    const input = requireString(body.input, "input");
    const action = body.action === "minify" ? "minify" : "format";
    const parsed = parseJson(input);
    if (!parsed.ok) {
      throw new Error(parsed.message);
    }
    return {
      valid: true,
      output: action === "minify" ? minifyJson(parsed.data) : formatJson(parsed.data),
      data: parsed.data,
    };
  },

  "jwt-decoder": (body) => {
    const token = requireString(body.token, "token");
    const decoded = decodeJwt(token);
    if (!decoded.ok) throw new Error(decoded.message);
    return decoded;
  },

  "markdown-editor": (body) => {
    const markdown = requireString(body.markdown, "markdown");
    return { markdown };
  },

  "color-palette-generator": (body) => {
    const baseColor = requireString(body.baseColor, "baseColor");
    const result = generatePalettes(baseColor);
    if (!result) throw new Error("Invalid base color.");
    return result;
  },

  "gradient-generator": (body) => {
    const colors = body.colors;
    if (!Array.isArray(colors) || colors.length < 2) {
      throw new Error('"colors" must be an array with at least two color values.');
    }
    const angle = body.angle ? requireNumber(body.angle, "angle") : 90;
    const colorList = colors.map((c, i) => requireString(c, `colors[${i}]`));
    const css = `linear-gradient(${angle}deg, ${colorList.join(", ")})`;
    return { css };
  },

  "regex-tester": (body) => {
    const pattern = requireString(body.pattern, "pattern");
    const flags = Array.isArray(body.flags)
      ? (body.flags as RegexFlag[])
      : [];
    const text = requireString(body.text, "text");
    const result = evaluateRegex(pattern, flags, text);
    if (!result.ok) throw new Error(result.message);
    return result;
  },

  "cron-expression-generator": (body) => {
    const expression = requireString(body.expression, "expression");
    const parsed = parseCronExpression(expression);
    if (parsed.error || !parsed.state) {
      throw new Error(parsed.error ?? "Invalid cron expression.");
    }
    return {
      expression,
      description: describeCronExpression(expression),
      nextRuns: getNextCronRuns(expression, 5),
    };
  },
};

export function isToolApiSlug(slug: string): slug is ImplementedToolSlug {
  return slug in handlers;
}

export function getToolApiHandler(slug: string): ToolApiHandler | null {
  if (!isToolApiSlug(slug)) return null;
  return handlers[slug];
}
