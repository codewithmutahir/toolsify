"use client";

import { useEffect, useMemo, useState } from "react";
import CopyButton from "@/components/tools/shared/CopyButton";
import { useToolApi } from "@/hooks/useToolApi";
import {
  CRON_FIELD_META,
  cronStateToExpression,
  defaultCronState,
  parseCronExpression,
  type CronFieldMode,
  type CronFieldState,
  type CronState,
} from "@/lib/developer/cron";
import { cn } from "@/lib/utils";

type TabMode = "builder" | "raw";

type CronApiResult = {
  expression: string;
  description: string;
  nextRuns: string[];
};

export default function CronExpressionGenerator() {
  const [tab, setTab] = useState<TabMode>("builder");
  const [state, setState] = useState<CronState>(defaultCronState());
  const [rawExpression, setRawExpression] = useState("0 9 * * 1");
  const [rawError, setRawError] = useState<string | null>(null);

  const builderExpression = useMemo(() => cronStateToExpression(state), [state]);
  const activeExpression = tab === "builder" ? builderExpression : rawExpression;

  const requestBody = useMemo(
    () => (activeExpression.trim() ? { expression: activeExpression } : null),
    [activeExpression]
  );

  const { data: cronResult } = useToolApi<CronApiResult>(
    "cron-expression-generator",
    requestBody
  );

  const description = cronResult?.description ?? "";
  const nextRuns = cronResult?.nextRuns ?? [];

  useEffect(() => {
    if (tab === "builder") {
      setRawExpression(builderExpression);
      setRawError(null);
    }
  }, [builderExpression, tab]);

  function updateField(
    key: keyof CronState,
    patch: Partial<CronFieldState> | CronFieldMode
  ) {
    setState((current) => ({
      ...current,
      [key]:
        typeof patch === "string"
          ? { ...current[key], mode: patch }
          : { ...current[key], ...patch },
    }));
  }

  function handleRawChange(value: string) {
    setRawExpression(value);
    const parsed = parseCronExpression(value);
    setRawError(parsed.error);
    if (parsed.state) {
      setState(parsed.state);
    }
  }

  return (
    <>
      <div className="flex gap-sm mb-lg">
        {(["builder", "raw"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={cn(
              "px-md py-sm rounded-full font-label text-label transition-all capitalize",
              tab === option
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            {option === "builder" ? "Visual Builder" : "Raw Input"}
          </button>
        ))}
      </div>

      {tab === "builder" ? (
        <div className="space-y-lg mb-xl">
          {CRON_FIELD_META.map((meta) => {
            const field = state[meta.key as keyof CronState];
            return (
              <div
                key={meta.key}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-md items-start"
              >
                <p className="font-label text-label font-bold text-on-surface uppercase pt-md">
                  {meta.label}
                </p>
                <div className="space-y-sm">
                  <select
                    value={field.mode}
                    onChange={(event) =>
                      updateField(
                        meta.key as keyof CronState,
                        event.target.value as CronFieldMode
                      )
                    }
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-small outline-none"
                  >
                    <option value="every">Every</option>
                    <option value="specific">Specific value</option>
                    <option value="interval">Every N</option>
                    <option value="range">Range</option>
                    <option value="list">List</option>
                  </select>

                  {field.mode === "specific" && (
                    <input
                      type="number"
                      min={meta.min}
                      max={meta.max}
                      value={field.specific}
                      onChange={(event) =>
                        updateField(meta.key as keyof CronState, {
                          specific: Number(event.target.value),
                        })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-small outline-none"
                    />
                  )}

                  {field.mode === "interval" && (
                    <input
                      type="number"
                      min={1}
                      max={meta.max}
                      value={field.interval}
                      onChange={(event) =>
                        updateField(meta.key as keyof CronState, {
                          interval: Number(event.target.value),
                        })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-small outline-none"
                    />
                  )}

                  {field.mode === "range" && (
                    <div className="grid grid-cols-2 gap-sm">
                      <input
                        type="number"
                        min={meta.min}
                        max={meta.max}
                        value={field.rangeStart}
                        onChange={(event) =>
                          updateField(meta.key as keyof CronState, {
                            rangeStart: Number(event.target.value),
                          })
                        }
                        className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-small outline-none"
                      />
                      <input
                        type="number"
                        min={meta.min}
                        max={meta.max}
                        value={field.rangeEnd}
                        onChange={(event) =>
                          updateField(meta.key as keyof CronState, {
                            rangeEnd: Number(event.target.value),
                          })
                        }
                        className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-small outline-none"
                      />
                    </div>
                  )}

                  {field.mode === "list" && (
                    <input
                      type="text"
                      value={field.list}
                      onChange={(event) =>
                        updateField(meta.key as keyof CronState, {
                          list: event.target.value,
                        })
                      }
                      placeholder={`e.g. ${meta.min},${meta.min + 1}`}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-mono text-small outline-none"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-xl">
          <label
            htmlFor="cron-raw"
            className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
          >
            Cron expression
          </label>
          <input
            id="cron-raw"
            value={rawExpression}
            onChange={(event) => handleRawChange(event.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-body focus:ring-2 focus:ring-primary-container outline-none"
          />
          {rawError && (
            <p className="mt-sm font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm">
              {rawError}
            </p>
          )}
        </div>
      )}

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg mb-lg">
        <div className="flex flex-wrap justify-between items-center gap-md mb-sm">
          <p className="font-label text-label font-bold text-on-surface uppercase">
            Expression
          </p>
          <CopyButton value={activeExpression} label="Copy expression" />
        </div>
        <p className="font-mono text-h3 text-on-surface">{activeExpression}</p>
        <p className="mt-md font-body text-body text-on-surface-variant">
          {description}
        </p>
      </div>

      <div>
        <h3 className="font-h3 text-h3 text-on-surface mb-md">Next 5 run times</h3>
        {nextRuns.length > 0 ? (
          <ul className="space-y-sm">
            {nextRuns.map((run) => (
              <li
                key={run}
                className="font-body text-body text-on-surface-variant bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm"
              >
                {run}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-body text-on-surface-variant">
            Unable to compute upcoming runs for this expression.
          </p>
        )}
      </div>
    </>
  );
}
