"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { AgeResult } from "@/lib/calculators/age";

function toInputDate(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}

export default function AgeCalculator() {
  const t = useToolUi("age-calculator");
  const [birthDate, setBirthDate] = useState("1990-01-15");
  const [asOfDate, setAsOfDate] = useState(toInputDate(new Date()));

  const requestBody = useMemo(() => {
    if (!birthDate || !asOfDate) return null;
    const birth = new Date(birthDate);
    const asOf = new Date(asOfDate);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) return null;
    if (birth > asOf) return null;
    return { birthDate, asOfDate };
  }, [birthDate, asOfDate]);

  const { data: result, error } = useToolApi<AgeResult>(
    "age-calculator",
    requestBody
  );

  const nextBirthdayLabel = result
    ? result.nextBirthdayDays === 0
      ? t("nextBirthdayToday")
      : t("nextBirthdayIn", { days: result.nextBirthdayDays })
    : "";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
        <div className="space-y-sm">
          <label
            htmlFor="birth-date"
            className="font-label text-label font-bold text-on-surface uppercase"
          >
            {t("dateOfBirth")}
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
            {t("asOfDate")}
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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result ? (
        <>
          <div className="tool-result mb-xl">
            <p className="tool-result-label mb-sm">{t("yourAge")}</p>
            <p className="font-display text-h1 text-primary-container mb-md">
              {t("ageSummary", {
                years: result.years,
                months: result.months,
                days: result.days,
              })}
            </p>
            <p className="font-body text-body text-on-surface-variant">
              {nextBirthdayLabel}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                {t("years")}
              </p>
              <p className="font-h2 text-h2 text-on-surface">{result.years}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                {t("months")}
              </p>
              <p className="font-h2 text-h2 text-on-surface">{result.months}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                {t("days")}
              </p>
              <p className="font-h2 text-h2 text-on-surface">{result.days}</p>
            </div>
          </div>

          <p className="mt-xl font-body text-body text-on-surface-variant text-center">
            {t("livedSummary", {
              days: result.totalDays.toLocaleString(),
              hours: result.totalHours.toLocaleString(),
            })}
          </p>
        </>
      ) : (
        !error && (
          <p className="font-body text-body text-error text-center">
            {t("invalidDateRange")}
          </p>
        )
      )}
    </>
  );
}
