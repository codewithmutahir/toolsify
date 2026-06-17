"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  analyzeText,
  getLimitProgress,
} from "@/lib/calculators/word-counter";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("word-counter")!;

const limits = [
  { label: "Twitter", limit: 280, key: "characters" as const },
  { label: "Meta description", limit: 160, key: "characters" as const },
  { label: "LinkedIn", limit: 700, key: "characters" as const },
];

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => analyzeText(text), [text]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "No spaces", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: stats.words > 0 ? `${stats.readingTimeMinutes} min` : "—" },
    {
      label: "Reading level",
      value: stats.fleschKincaidGrade !== null
        ? `Grade ${stats.fleschKincaidGrade}`
        : "—",
    },
    { label: "Difficulty", value: stats.readingLevel },
  ];

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Why count words?</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Word counts matter for essays, blog posts, social media captions, and
              SEO meta descriptions. This tool updates in real time as you type or
              paste text.
            </p>
          </>
        }
      >
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
      </ToolWrapper>
    </>
  );
}
