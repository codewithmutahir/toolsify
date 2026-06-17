"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  calculateCompoundInterest,
  compoundingOptions,
  type CompoundingFrequency,
} from "@/lib/calculators/compound-interest";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("compound-interest-calculator")!;

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState<CompoundingFrequency>("annually");

  const result = useMemo(
    () =>
      calculateCompoundInterest(
        parseFloat(principal),
        parseFloat(rate),
        parseFloat(years),
        frequency
      ),
    [principal, rate, years, frequency]
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              How compound interest works
            </h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Compound interest earns interest on both principal and accumulated
              interest. More frequent compounding grows your balance faster. Use the
              year-by-year table to see how your investment grows over time.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
          <div className="space-y-sm">
            <label htmlFor="ci-principal" className="font-label text-label font-bold text-on-surface uppercase">
              Principal
            </label>
            <input
              id="ci-principal"
              type="number"
              min="0"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="ci-rate" className="font-label text-label font-bold text-on-surface uppercase">
              Annual rate (%)
            </label>
            <input
              id="ci-rate"
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="ci-years" className="font-label text-label font-bold text-on-surface uppercase">
              Time (years)
            </label>
            <input
              id="ci-years"
              type="number"
              min="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="ci-frequency" className="font-label text-label font-bold text-on-surface uppercase">
              Compounding
            </label>
            <select
              id="ci-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as CompoundingFrequency)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            >
              {compoundingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Total amount</p>
                <p className="font-display text-h1 text-primary-container">{result.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Total interest</p>
                <p className="font-display text-h1 text-tertiary-container">{result.totalInterest.toLocaleString()}</p>
              </div>
            </div>

            {result.yearByYear.length > 0 && (
              <div className="overflow-x-auto">
                <p className="font-label text-label text-on-surface-variant uppercase font-bold mb-md">
                  Year-by-year breakdown
                </p>
                <table className="w-full font-small text-small">
                  <thead>
                    <tr className="border-b border-outline-variant text-left">
                      <th className="py-sm pr-md text-on-surface-variant">Year</th>
                      <th className="py-sm pr-md text-on-surface-variant">Balance</th>
                      <th className="py-sm text-on-surface-variant">Interest earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row) => (
                      <tr key={row.year} className="border-b border-outline-variant/50">
                        <td className="py-sm pr-md">{row.year}</td>
                        <td className="py-sm pr-md">{row.balance.toLocaleString()}</td>
                        <td className="py-sm">{row.interestEarned.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </ToolWrapper>
    </>
  );
}
