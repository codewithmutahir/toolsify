export type PercentageMode = "of" | "what-percent" | "change";

export interface PercentageResult {
  value: number;
  label: string;
}

export function calculatePercentage(
  mode: PercentageMode,
  a: number,
  b: number
): PercentageResult | null {
  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  switch (mode) {
    case "of": {
      if (b === 0 && a === 0) return null;
      const value = (a / 100) * b;
      return {
        value: Math.round(value * 100) / 100,
        label: `${a}% of ${b} is ${Math.round(value * 100) / 100}`,
      };
    }
    case "what-percent": {
      if (b === 0) return null;
      const value = (a / b) * 100;
      return {
        value: Math.round(value * 100) / 100,
        label: `${a} is ${Math.round(value * 100) / 100}% of ${b}`,
      };
    }
    case "change": {
      if (a === 0) return null;
      const value = ((b - a) / a) * 100;
      return {
        value: Math.round(value * 100) / 100,
        label: `Change from ${a} to ${b} is ${Math.round(value * 100) / 100}%`,
      };
    }
    default:
      return null;
  }
}
