"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateAge, formatAgeSummary } from "@/lib/calculators/age";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("age-calculator")!;

function toInputDate(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1990-01-15");
  const [asOfDate, setAsOfDate] = useState(toInputDate(new Date()));

  const result = useMemo(() => {
    return calculateAge(new Date(birthDate), new Date(asOfDate));
  }, [birthDate, asOfDate]);

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              Calculate your exact age
            </h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Enter your date of birth and optionally choose an &quot;as of&quot; date
              to calculate your age in years, months, and days — plus fun stats like
              total days lived and your next birthday countdown.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div className="space-y-sm">
            <label
              htmlFor="birth-date"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              Date of birth
            </label>
            <input
              id="birth-date"
              type="date"
              value={birthDate}
              max={asOfDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="tool-input rounded-xl"
            />
          </div>
          <div className="space-y-sm">
            <label
              htmlFor="as-of-date"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              As of date
            </label>
            <input
              id="as-of-date"
              type="date"
              value={asOfDate}
              min={birthDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="tool-input rounded-xl"
            />
          </div>
        </div>

        {result ? (
          <>
            <div className="tool-result mb-xl">
              <p className="tool-result-label mb-sm">Your age</p>
              <p className="font-display text-h1 text-primary-container mb-md">
                {formatAgeSummary(result)}
              </p>
              <p className="font-body text-body text-on-surface-variant">
                {result.nextBirthdayLabel}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                  Years
                </p>
                <p className="font-h2 text-h2 text-on-surface">{result.years}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                  Months
                </p>
                <p className="font-h2 text-h2 text-on-surface">{result.months}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                  Days
                </p>
                <p className="font-h2 text-h2 text-on-surface">{result.days}</p>
              </div>
            </div>

            <p className="mt-xl font-body text-body text-on-surface-variant text-center">
              You&apos;ve lived{" "}
              <span className="font-bold text-on-surface">
                {result.totalDays.toLocaleString()} days
              </span>
              , or approximately{" "}
              <span className="font-bold text-on-surface">
                {result.totalHours.toLocaleString()} hours
              </span>
              .
            </p>
          </>
        ) : (
          <p className="font-body text-body text-error text-center">
            Please enter a valid birth date that is before the &quot;as of&quot; date.
          </p>
        )}
      </ToolWrapper>
    </>
  );
}
