"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import type { PercentageChangeResult } from "@/lib/calculators/percentage-change";
import { cn } from "@/lib/utils";

export default function PercentageChangeCalculator() {
  const [original, setOriginal] = useState("100");
  const [newValue, setNewValue] = useState("125");

  const requestBody = useMemo(() => {
    const from = parseFloat(original);
    const to = parseFloat(newValue);
    if (Number.isNaN(from) || Number.isNaN(to)) return null;
    if (from === 0) return null;
    return { from, to };
  }, [original, newValue]);

  const { data: result, error } = useToolApi<PercentageChangeResult>(
    "percentage-change-calculator",
    requestBody
  );

  return (
    <>
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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

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
    </>
  );
}
