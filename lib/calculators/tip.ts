export interface TipResult {
  tipAmount: number;
  totalBill: number;
  perPerson: number;
}

export function calculateTip(
  billAmount: number,
  tipPercent: number,
  people: number
): TipResult | null {
  if (
    Number.isNaN(billAmount) ||
    Number.isNaN(tipPercent) ||
    Number.isNaN(people)
  ) {
    return null;
  }
  if (billAmount < 0 || tipPercent < 0 || people < 1) return null;

  const tipAmount = (billAmount * tipPercent) / 100;
  const totalBill = billAmount + tipAmount;
  const perPerson = totalBill / people;

  const round = (n: number) => Math.round(n * 100) / 100;

  return {
    tipAmount: round(tipAmount),
    totalBill: round(totalBill),
    perPerson: round(perPerson),
  };
}
