"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { SimpleInterestResult } from "@/lib/calculators/simple-interest";

export default function SimpleInterestCalculator() {
  const t = useToolUi("simple-interest-calculator");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("3");

  const requestBody = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const tVal = parseFloat(time);
    if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(tVal)) return null;
    if (p < 0 || r < 0 || tVal < 0) return null;
    return { principal: p, rate: r, time: tVal };
  }, [principal, rate, time]);

  const { data: result, error } = useToolApi<SimpleInterestResult>(
    "simple-interest-calculator",
    requestBody
  );

  const fields = [
    {
      id: "principal",
      label: t("principal"),
      value: principal,
      set: setPrincipal,
      suffix: "",
    },
    {
      id: "rate",
      label: t("rate"),
      value: rate,
      set: setRate,
      suffix: "%",
    },
    {
      id: "time",
      label: t("timeYears"),
      value: time,
      set: setTime,
      suffix: t("yearShort"),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        {fields.map((field) => (
          <div key={field.id} className="space-y-sm">
            <label
              htmlFor={field.id}
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type="number"
                min="0"
                step="0.01"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none"
              />
              {field.suffix && (
                <span className="absolute right-lg top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                  {field.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
              {t("interestEarned")}
            </p>
            <p className="font-display text-h1 text-primary-container">
              {result.interest.toLocaleString()}
            </p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
              {t("totalAmount")}
            </p>
            <p className="font-display text-h1 text-tertiary-container">
              {result.total.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
