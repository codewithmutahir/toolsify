export type TenureUnit = "months" | "years";

export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principalRatio: number;
  interestRatio: number;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenure: number,
  tenureUnit: TenureUnit
): EMIResult | null {
  if (principal <= 0 || annualRate < 0 || tenure <= 0) return null;

  const months = tenureUnit === "years" ? tenure * 12 : tenure;
  const monthlyRate = annualRate / 12 / 100;

  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  const principalRatio = (principal / totalPayment) * 100;
  const interestRatio = (totalInterest / totalPayment) * 100;

  return {
    emi: Math.round(emi * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principalRatio: Math.round(principalRatio * 10) / 10,
    interestRatio: Math.round(interestRatio * 10) / 10,
  };
}
