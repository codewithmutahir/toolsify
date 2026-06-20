"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { TipResult } from "@/lib/calculators/tip";
import { cn } from "@/lib/utils";

const quickTips = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const t = useToolUi("tip-calculator");
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("2");

  const requestBody = useMemo(() => {
    const billAmount = parseFloat(bill);
    const tip = parseFloat(tipPercent);
    const numPeople = parseInt(people, 10);
    if (Number.isNaN(billAmount) || Number.isNaN(tip) || Number.isNaN(numPeople)) return null;
    if (billAmount < 0 || tip < 0 || numPeople < 1) return null;
    return { bill: billAmount, tipPercent: tip, people: numPeople };
  }, [bill, tipPercent, people]);

  const { data: result, error } = useToolApi<TipResult>(
    "tip-calculator",
    requestBody
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
        <div className="space-y-sm">
          <label htmlFor="tip-bill" className="font-label text-label font-bold text-on-surface uppercase">
            {t("billAmount")}
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
            {t("tipPercent")}
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
            {t("people")}
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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("tip")}</p>
            <p className="font-h2 text-h2 text-primary-container">{result.tipAmount.toLocaleString()}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("total")}</p>
            <p className="font-h2 text-h2 text-on-surface">{result.totalBill.toLocaleString()}</p>
          </div>
          <div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-lg text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("perPerson")}</p>
            <p className="font-h2 text-h2 text-tertiary-container">{result.perPerson.toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  );
}
