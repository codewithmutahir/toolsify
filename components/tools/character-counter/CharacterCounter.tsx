"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  analyzeCharacters,
  getCharacterLimitProgress,
  platformLimits,
} from "@/lib/calculators/character-counter";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("character-counter")!;

export default function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => analyzeCharacters(text), [text]);

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
    { label: "Characters", value: stats.characters },
    { label: "No spaces", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Lines", value: stats.lines },
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Count characters in real time</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Track character counts for social media posts and SEO meta descriptions.
              Progress bars show how close you are to platform limits for Twitter, LinkedIn,
              and Meta.
            </p>
          </>
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={8}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none resize-y min-h-[200px] mb-xl"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center"
            >
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{item.label}</p>
              <p className="font-h2 text-h2 text-primary-container">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-md">
          <p className="font-label text-label text-on-surface-variant uppercase font-bold">
            Platform limits
          </p>
          {platformLimits.map((item) => {
            const count = stats.characters;
            const progress = getCharacterLimitProgress(count, item.limit);
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
