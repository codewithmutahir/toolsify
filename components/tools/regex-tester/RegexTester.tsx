"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useToolApi } from "@/hooks/useToolApi";
import {
  buildHighlightSegments,
  COMMON_REGEX_PATTERNS,
  type RegexEvaluation,
  type RegexFlag,
} from "@/lib/developer/regex";
import { cn } from "@/lib/utils";

const FLAGS: RegexFlag[] = ["g", "i", "m", "s", "u"];

export default function RegexTester() {
  const [pattern, setPattern] = useState(String.raw`\w+`);
  const [flags, setFlags] = useState<RegexFlag[]>(["g"]);
  const [testString, setTestString] = useState(
    "Contact us at hello@toolsify.online or visit https://toolsify.online"
  );

  const debouncedPattern = useDebouncedValue(pattern, 150);
  const debouncedTestString = useDebouncedValue(testString, 150);

  const requestBody = useMemo(
    () => ({
      pattern: debouncedPattern,
      flags,
      text: debouncedTestString,
    }),
    [debouncedPattern, flags, debouncedTestString]
  );

  const { data: evaluation, error } = useToolApi<RegexEvaluation>(
    "regex-tester",
    requestBody,
    150
  );

  const segments =
    evaluation && debouncedTestString
      ? buildHighlightSegments(debouncedTestString, evaluation.matches)
      : [{ text: debouncedTestString, highlighted: false }];

  function toggleFlag(flag: RegexFlag) {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag]
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-end gap-md mb-md">
        <div className="flex-1 min-w-[240px]">
          <label
            htmlFor="regex-pattern"
            className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
          >
            Pattern
          </label>
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
            <span className="px-md font-mono text-small text-on-surface-variant">
              /
            </span>
            <input
              id="regex-pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="flex-1 bg-transparent py-md font-mono text-small outline-none"
            />
            <span className="px-md font-mono text-small text-on-surface-variant">
              /{flags.join("")}
            </span>
          </div>
        </div>

        <label className="min-w-[180px]">
          <span className="font-label text-label font-bold text-on-surface uppercase block mb-sm">
            Common patterns
          </span>
          <select
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) setPattern(event.target.value);
            }}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-md font-body text-small outline-none"
          >
            <option value="" disabled>
              Insert pattern...
            </option>
            {COMMON_REGEX_PATTERNS.map((item) => (
              <option key={item.label} value={item.pattern}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-sm mb-sm">
        {FLAGS.map((flag) => (
          <button
            key={flag}
            type="button"
            onClick={() => toggleFlag(flag)}
            className={cn(
              "px-md py-sm rounded-full font-label text-label transition-all",
              flags.includes(flag)
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            {flag}
          </button>
        ))}
      </div>

      {error && debouncedPattern.trim() && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      <label
        htmlFor="regex-test-string"
        className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
      >
        Test string
      </label>
      <textarea
        id="regex-test-string"
        value={testString}
        onChange={(event) => setTestString(event.target.value)}
        rows={5}
        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-small focus:ring-2 focus:ring-primary-container outline-none resize-y mb-lg"
      />

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg mb-xl">
        <p className="font-label text-label font-bold text-on-surface uppercase mb-sm">
          Highlighted matches
        </p>
        <p className="font-mono text-small text-on-surface whitespace-pre-wrap break-words">
          {segments.map((segment, index) =>
            segment.highlighted ? (
              <mark
                key={index}
                className="bg-primary-fixed text-on-surface rounded px-0.5"
              >
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            )
          )}
        </p>
      </div>

      <div>
        <h3 className="font-h3 text-h3 text-on-surface mb-md">Matches</h3>
        {evaluation && evaluation.matches.length === 0 ? (
          <p className="font-body text-body text-on-surface-variant">
            {debouncedPattern.trim() ? "No matches" : "Enter a pattern to test"}
          </p>
        ) : (
          evaluation && (
            <div className="space-y-md">
              {evaluation.matches.map((match, index) => (
                <div
                  key={`${match.index}-${index}`}
                  className="bg-surface-container-low border border-outline-variant rounded-xl p-md"
                >
                  <p className="font-body text-body text-on-surface mb-xs">
                    Match {index + 1}:{" "}
                    <span className="font-mono">{match.match}</span>
                  </p>
                  <p className="font-small text-small text-on-surface-variant">
                    Index {match.index}–{match.end}
                  </p>
                  {match.groups.length > 0 && (
                    <div className="mt-sm space-y-xs">
                      {match.groups.map((group, groupIndex) => (
                        <p
                          key={groupIndex}
                          className="font-mono text-small text-on-surface-variant"
                        >
                          Group {groupIndex + 1}: {group || "(empty)"}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}
