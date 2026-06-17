"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateDiscount } from "@/lib/calculators/discount";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("discount-calculator")!;

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discountPercent, setDiscountPercent] = useState("20");

  const result = useMemo(
    () =>
      calculateDiscount(
        parseFloat(originalPrice),
        parseFloat(discountPercent)
      ),
    [originalPrice, discountPercent]
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description={tool.description}
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Calculate discounts instantly</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Enter the original price and discount percentage to find the final sale
              price and how much you save. Perfect for shopping, sales, and pricing
              decisions.
            </p>
          </>
        }
      >
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
      </ToolWrapper>
    </>
  );
}
