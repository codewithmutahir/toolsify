"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculatePercentageChange } from "@/lib/calculators/percentage-change";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("percentage-change-calculator")!;

export default function PercentageChangeCalculator() {
  const [original, setOriginal] = useState("100");
  const [newValue, setNewValue] = useState("125");

  const result = useMemo(
    () =>
      calculatePercentageChange(
        parseFloat(original),
        parseFloat(newValue)
      ),
    [original, newValue]
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "FinanceApplication",
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Measure percent increase or decrease</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Compare an original value to a new value and see the percentage change.
              Green indicates an increase; red indicates a decrease.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div className="space-y-sm">
            <label htmlFor="pc-original" className="font-label text-label font-bold text-on-surface uppercase">
              Original value
            </label>
            <input
              id="pc-original"
              type="number"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="pc-new" className="font-label text-label font-bold text-on-surface uppercase">
              New value
            </label>
            <input
              id="pc-new"
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
        </div>

        {result && (
          <div
            className={cn(
              "rounded-2xl p-xl text-center border",
              result.isIncrease
                ? "bg-tertiary-container/10 border-tertiary-container/30"
                : "bg-error-container/30 border-error/30"
            )}
          >
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
              Percentage change
            </p>
            <p
              className={cn(
                "font-display text-display mb-sm",
                result.isIncrease ? "text-tertiary-container" : "text-error"
              )}
            >
              {result.isIncrease ? "+" : ""}
              {result.percentChange}%
            </p>
            <p className="font-body text-body text-on-surface-variant">
              Absolute change: {result.isIncrease ? "+" : ""}
              {result.absoluteChange}
            </p>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
