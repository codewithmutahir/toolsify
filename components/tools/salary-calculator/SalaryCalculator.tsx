"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateSalary } from "@/lib/calculators/salary";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("salary-calculator")!;

export default function SalaryCalculator() {
  const [annual, setAnnual] = useState("60000");

  const result = useMemo(
    () => calculateSalary(parseFloat(annual)),
    [annual]
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

  const breakdown = result
    ? [
        { label: "Monthly", value: result.monthly },
        { label: "Weekly", value: result.weekly },
        { label: "Daily", value: result.daily },
        { label: "Hourly", value: result.hourly },
      ]
    : [];

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Convert annual salary to other periods</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Enter your annual salary to see equivalent monthly, weekly, daily, and
              hourly rates. Hourly rate assumes a 40-hour work week and 52 weeks per year.
            </p>
          </>
        }
      >
        <div className="space-y-sm mb-xl">
          <label htmlFor="salary-annual" className="font-label text-label font-bold text-on-surface uppercase">
            Annual salary
          </label>
          <input
            id="salary-annual"
            type="number"
            min="0"
            value={annual}
            onChange={(e) => setAnnual(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>

        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center"
              >
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{item.label}</p>
                <p className="font-h2 text-h2 text-primary-container">{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
