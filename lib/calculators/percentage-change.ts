export interface PercentageChangeResult {
  percentChange: number;
  isIncrease: boolean;
  absoluteChange: number;
}

export function calculatePercentageChange(
  original: number,
  newValue: number
): PercentageChangeResult | null {
  if (Number.isNaN(original) || Number.isNaN(newValue)) return null;
  if (original === 0) return null;

  const absoluteChange = newValue - original;
  const percentChange = (absoluteChange / original) * 100;

  return {
    percentChange: Math.round(percentChange * 100) / 100,
    isIncrease: percentChange >= 0,
    absoluteChange: Math.round(absoluteChange * 100) / 100,
  };
}
