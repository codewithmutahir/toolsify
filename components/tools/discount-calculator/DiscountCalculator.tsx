"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import type { DiscountResult } from "@/lib/calculators/discount";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discountPercent, setDiscountPercent] = useState("20");

  const requestBody = useMemo(() => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    if (Number.isNaN(price) || Number.isNaN(discount)) return null;
    if (price < 0 || discount < 0 || discount > 100) return null;
    return { originalPrice: price, discountPercent: discount };
  }, [originalPrice, discountPercent]);

  const { data: result, error } = useToolApi<DiscountResult>(
    "discount-calculator",
    requestBody
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
        <div className="space-y-sm">
          <label htmlFor="discount-original" className="font-label text-label font-bold text-on-surface uppercase">
            Original price
          </label>
          <input
            id="discount-original"
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
        <div className="space-y-sm">
          <label htmlFor="discount-percent" className="font-label text-label font-bold text-on-surface uppercase">
            Discount (%)
          </label>
          <input
            id="discount-percent"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-xl text-center">
          <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Final price</p>
          <p className="font-display text-display text-primary-container mb-lg">
            {result.finalPrice.toLocaleString()}
          </p>
          <p className="font-body text-body text-tertiary-container font-bold">
            You save {result.savings.toLocaleString()}
          </p>
        </div>
      )}
    </>
  );
}
