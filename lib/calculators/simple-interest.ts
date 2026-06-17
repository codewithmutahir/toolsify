export interface SimpleInterestResult {
  interest: number;
  total: number;
}

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): SimpleInterestResult | null {
  if (Number.isNaN(principal) || Number.isNaN(rate) || Number.isNaN(time)) {
    return null;
  }
  if (principal < 0 || rate < 0 || time < 0) return null;

  const interest = (principal * rate * time) / 100;
  const total = principal + interest;

  return {
    interest: Math.round(interest * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
