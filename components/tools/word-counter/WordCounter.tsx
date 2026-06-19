"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import {
  getLimitProgress,
  type WordCounterStats,
} from "@/lib/calculators/word-counter";
import { cn } from "@/lib/utils";

const limits = [
  { label: "Twitter", limit: 280, key: "characters" as const },
  { label: "Meta description", limit: 160, key: "characters" as const },
  { label: "LinkedIn", limit: 700, key: "characters" as const },
];

const EMPTY_STATS: WordCounterStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTimeMinutes: 0,
  readingLevel: "N/A",
  fleschKincaidGrade: null,
};

export default function WordCounter() {
  const [text, setText] = useState("");

  const requestBody = useMemo(
    () => (text.length > 0 ? { text } : null),
    [text]
  );

  const { data, error } = useToolApi<WordCounterStats>(
    "word-counter",
    requestBody
  );

  const stats = data ?? EMPTY_STATS;

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "No spaces", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    {
      label: "Reading time",
      value: stats.words > 0 ? `${stats.readingTimeMinutes} min` : "—",
    },
    {
      label: "Reading level",
      value:
        stats.fleschKincaidGrade !== null
          ? `Grade ${stats.fleschKincaidGrade}`
          : "—",
    },
    { label: "Difficulty", value: stats.readingLevel },
  ];

  return (
    <>
      <label htmlFor="word-counter-text" className="sr-only">
        Text to analyze
      </label>
      <textarea
        id="word-counter-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={8}
        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all resize-y min-h-[200px] mb-xl"
      />

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center"
          >
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
              {item.label}
            </p>
            <p className="font-h2 text-h2 text-primary-container">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-md">
        <p className="font-label text-label text-on-surface-variant uppercase font-bold">
          Character limits
        </p>
        {limits.map((item) => {
          const count = stats.characters;
          const progress = getLimitProgress(count, item.limit);
          const over = count > item.limit;
          return (
            <div key={item.label}>
              <div className="flex justify-between font-small text-small mb-xs">
                <span className="text-on-surface-variant">{item.label}</span>
                <span className={cn(over ? "text-error" : "text-on-surface")}>
                  {count} / {item.limit}
                </span>
              </div>
              <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    over ? "bg-error" : "bg-primary-container"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
