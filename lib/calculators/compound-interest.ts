export type CompoundingFrequency =
  | "annually"
  | "semiannually"
  | "quarterly"
  | "monthly"
  | "daily";

export const compoundingOptions: {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: "annually", label: "Annually", periodsPerYear: 1 },
  { value: "semiannually", label: "Semi-annually", periodsPerYear: 2 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "daily", label: "Daily", periodsPerYear: 365 },
];

export interface CompoundInterestYearRow {
  year: number;
  balance: number;
  interestEarned: number;
}

export interface CompoundInterestResult {
  totalAmount: number;
  totalInterest: number;
  yearByYear: CompoundInterestYearRow[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: CompoundingFrequency
): CompoundInterestResult | null {
  if (
    Number.isNaN(principal) ||
    Number.isNaN(annualRate) ||
    Number.isNaN(years)
  ) {
    return null;
  }
  if (principal < 0 || annualRate < 0 || years < 0) return null;

  const option = compoundingOptions.find((o) => o.value === frequency);
  if (!option) return null;

  const n = option.periodsPerYear;
  const r = annualRate / 100;
  const yearByYear: CompoundInterestYearRow[] = [];
  let previousBalance = principal;

  for (let y = 1; y <= Math.floor(years); y++) {
    const balance = principal * Math.pow(1 + r / n, n * y);
    const rounded = Math.round(balance * 100) / 100;
    yearByYear.push({
      year: y,
      balance: rounded,
      interestEarned: Math.round((rounded - previousBalance) * 100) / 100,
    });
    previousBalance = rounded;
  }

  const totalAmount = principal * Math.pow(1 + r / n, n * years);
  const roundedTotal = Math.round(totalAmount * 100) / 100;

  return {
    totalAmount: roundedTotal,
    totalInterest: Math.round((roundedTotal - principal) * 100) / 100,
    yearByYear,
  };
}
