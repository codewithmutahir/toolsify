"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import {
  compoundingOptions,
  type CompoundingFrequency,
  type CompoundInterestResult,
} from "@/lib/calculators/compound-interest";

const frequencyKey: Record<CompoundingFrequency, string> = {
  annually: "frequencyAnnually",
  semiannually: "frequencySemiannually",
  quarterly: "frequencyQuarterly",
  monthly: "frequencyMonthly",
  daily: "frequencyDaily",
};

export default function CompoundInterestCalculator() {
  const t = useToolUi("compound-interest-calculator");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState<CompoundingFrequency>("annually");

  const requestBody = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(y)) return null;
    if (p < 0 || r < 0 || y < 0) return null;
    return { principal: p, rate: r, years: y, frequency };
  }, [principal, rate, years, frequency]);

  const { data: result, error } = useToolApi<CompoundInterestResult>(
    "compound-interest-calculator",
    requestBody
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
        <div className="space-y-sm">
          <label htmlFor="ci-principal" className="font-label text-label font-bold text-on-surface uppercase">
            {t("principal")}
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
            {t("annualRate")}
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
            {t("timeYears")}
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
            {t("compounding")}
          </label>
          <select
            id="ci-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as CompoundingFrequency)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
          >
            {compoundingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(frequencyKey[opt.value])}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("totalAmount")}</p>
              <p className="font-display text-h1 text-primary-container">{result.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("totalInterest")}</p>
              <p className="font-display text-h1 text-tertiary-container">{result.totalInterest.toLocaleString()}</p>
            </div>
          </div>

          {result.yearByYear.length > 0 && (
            <div className="overflow-x-auto">
              <p className="font-label text-label text-on-surface-variant uppercase font-bold mb-md">
                {t("yearByYearBreakdown")}
              </p>
              <table className="w-full font-small text-small">
                <thead>
                  <tr className="border-b border-outline-variant text-left">
                    <th className="py-sm pr-md text-on-surface-variant">{t("year")}</th>
                    <th className="py-sm pr-md text-on-surface-variant">{t("balance")}</th>
                    <th className="py-sm text-on-surface-variant">{t("interestEarned")}</th>
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
    </>
  );
}
