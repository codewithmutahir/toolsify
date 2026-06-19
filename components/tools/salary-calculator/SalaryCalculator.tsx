"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import type { SalaryBreakdown } from "@/lib/calculators/salary";

export default function SalaryCalculator() {
  const [annual, setAnnual] = useState("60000");

  const requestBody = useMemo(() => {
    const salary = parseFloat(annual);
    if (Number.isNaN(salary) || salary < 0) return null;
    return { annualSalary: salary };
  }, [annual]);

  const { data: result, error } = useToolApi<SalaryBreakdown>(
    "salary-calculator",
    requestBody
  );

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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

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
    </>
  );
}
