"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import UnitToggle from "@/components/tools/UnitToggle";
import { calculateEMI, type TenureUnit } from "@/lib/calculators/emi";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("emi-calculator")!;

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");

  const result = useMemo(() => {
    return calculateEMI(
      parseFloat(principal),
      parseFloat(rate),
      parseFloat(tenure),
      tenureUnit
    );
  }, [principal, rate, tenure, tenureUnit]);

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">What is EMI?</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              EMI (Equated Monthly Installment) is the fixed amount you pay each
              month toward a loan. It includes both principal and interest. Use this
              calculator to plan home loans, car loans, and personal loans.
            </p>
          </>
        }
      >
        <div className="space-y-lg mb-xl">
          <div className="space-y-sm">
            <label
              htmlFor="emi-loan-amount"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              Loan amount
            </label>
            <input
              id="emi-loan-amount"
              type="number"
              min="0"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="tool-input font-h3 text-h3 rounded-xl"
            />
          </div>
          <div className="space-y-sm">
            <label
              htmlFor="emi-interest-rate"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              Interest rate (% per year)
            </label>
            <input
              id="emi-interest-rate"
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="tool-input font-h3 text-h3 rounded-xl"
            />
          </div>
          <div className="space-y-sm">
            <div className="flex justify-between items-end">
              <label
                htmlFor="emi-tenure"
                className="font-label text-label font-bold text-on-surface uppercase"
              >
                Tenure
              </label>
              <UnitToggle
                options={["years", "months"] as const}
                value={tenureUnit}
                onChange={setTenureUnit}
              />
            </div>
            <input
              id="emi-tenure"
              type="number"
              min="1"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="tool-input font-h3 text-h3 rounded-xl"
            />
          </div>
        </div>

        {result && (
          <>
            <div className="tool-result mb-xl">
              <p className="tool-result-label mb-sm">Monthly EMI</p>
              <p className="tool-result-value">
                {result.emi.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-xl">
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                  Total interest
                </p>
                <p className="font-h3 text-h3 text-on-surface">
                  {result.totalInterest.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                  Total payment
                </p>
                <p className="font-h3 text-h3 text-on-surface">
                  {result.totalPayment.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-sm">
              <p className="font-label text-label text-on-surface-variant uppercase font-bold">
                Principal vs interest
              </p>
              <div className="flex h-4 w-full rounded-full overflow-hidden">
                <div
                  className="bg-primary-container"
                  style={{ width: `${result.principalRatio}%` }}
                  title={`Principal ${result.principalRatio}%`}
                />
                <div
                  className="bg-secondary-container"
                  style={{ width: `${result.interestRatio}%` }}
                  title={`Interest ${result.interestRatio}%`}
                />
              </div>
              <div className="flex justify-between font-small text-small text-on-surface-variant">
                <span>Principal {result.principalRatio}%</span>
                <span>Interest {result.interestRatio}%</span>
              </div>
            </div>
          </>
        )}
      </ToolWrapper>
    </>
  );
}
