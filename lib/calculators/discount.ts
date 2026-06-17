export interface DiscountResult {
  finalPrice: number;
  savings: number;
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): DiscountResult | null {
  if (Number.isNaN(originalPrice) || Number.isNaN(discountPercent)) {
    return null;
  }
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    return null;
  }

  const savings = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - savings;

  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    savings: Math.round(savings * 100) / 100,
  };
}
