"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateTip } from "@/lib/calculators/tip";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("tip-calculator")!;

const quickTips = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("2");

  const result = useMemo(
    () =>
      calculateTip(
        parseFloat(bill),
        parseFloat(tipPercent),
        parseInt(people, 10)
      ),
    [bill, tipPercent, people]
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Calculate tips and split bills</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Enter the bill amount, tip percentage, and number of people to see the tip
              amount, total bill, and cost per person.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
          <div className="space-y-sm">
            <label htmlFor="tip-bill" className="font-label text-label font-bold text-on-surface uppercase">
              Bill amount
            </label>
            <input
              id="tip-bill"
              type="number"
              min="0"
              step="0.01"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="tip-percent" className="font-label text-label font-bold text-on-surface uppercase">
              Tip (%)
            </label>
            <input
              id="tip-percent"
              type="number"
              min="0"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="tip-people" className="font-label text-label font-bold text-on-surface uppercase">
              People
            </label>
            <input
              id="tip-people"
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-sm mb-xl">
          {quickTips.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setTipPercent(String(pct))}
              className={cn(
                "px-md py-sm rounded-lg font-label text-label transition-all",
                tipPercent === String(pct)
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              {pct}%
            </button>
          ))}
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Tip</p>
              <p className="font-h2 text-h2 text-primary-container">{result.tipAmount.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Total</p>
              <p className="font-h2 text-h2 text-on-surface">{result.totalBill.toLocaleString()}</p>
            </div>
            <div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Per person</p>
              <p className="font-h2 text-h2 text-tertiary-container">{result.perPerson.toLocaleString()}</p>
            </div>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
