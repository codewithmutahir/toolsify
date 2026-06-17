import type { Gender } from "./calorie";

export interface IdealWeightFormula {
  name: string;
  weightKg: number;
  weightLbs: number;
}

export interface IdealWeightResult {
  formulas: IdealWeightFormula[];
  rangeKg: { min: number; max: number };
  rangeLbs: { min: number; max: number };
}

function toLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function calculateIdealWeight(
  heightCm: number,
  gender: Gender
): IdealWeightResult | null {
  if (Number.isNaN(heightCm) || heightCm <= 0) return null;

  const heightIn = heightCm / 2.54;
  const baseIn = heightIn - 60;
  const extra = Math.max(0, baseIn);

  let devine: number;
  let robinson: number;
  let miller: number;
  let hamwi: number;

  if (gender === "male") {
    devine = 50 + 2.3 * extra;
    robinson = 52 + 1.9 * extra;
    miller = 56.2 + 1.41 * extra;
    hamwi = 48 + 2.7 * extra;
  } else {
    devine = 45.5 + 2.3 * extra;
    robinson = 49 + 1.7 * extra;
    miller = 53.1 + 1.36 * extra;
    hamwi = 45.5 + 2.2 * extra;
  }

  const round = (n: number) => Math.round(n * 10) / 10;

  const formulas: IdealWeightFormula[] = [
    { name: "Devine", weightKg: round(devine), weightLbs: toLbs(devine) },
    { name: "Robinson", weightKg: round(robinson), weightLbs: toLbs(robinson) },
    { name: "Miller", weightKg: round(miller), weightLbs: toLbs(miller) },
    { name: "Hamwi", weightKg: round(hamwi), weightLbs: toLbs(hamwi) },
  ];

  const weights = formulas.map((f) => f.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  return {
    formulas,
    rangeKg: { min: round(min), max: round(max) },
    rangeLbs: { min: toLbs(min), max: toLbs(max) },
  };
}
