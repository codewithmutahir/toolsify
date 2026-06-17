"use client";

import { ReactNode } from "react";
import AdBanner from "@/components/ads/AdBanner";
import { areAdsEnabled } from "@/lib/ads";
import ToolHeader from "./ToolHeader";
import RelatedTools from "./RelatedTools";
import ToolUsageProvider from "./ToolUsageProvider";
import FavoriteButton from "./FavoriteButton";
import { ToolCategory } from "@/types/tool";
import { cn } from "@/lib/utils";

interface ToolWrapperProps {
  title: string;
  description: string;
  category: ToolCategory;
  slug: string;
  children: ReactNode;
  seoContent?: ReactNode;
}

export default function ToolWrapper({
  title,
  description,
  category,
  slug,
  children,
  seoContent,
}: ToolWrapperProps) {
  const adsEnabled = areAdsEnabled();

  return (
    <main className="max-w-container-max mx-auto px-gutter md:px-xl py-lg">
      <ToolHeader title={title} description={description} category={category} />

      <div className="flex justify-end -mt-md mb-md">
        <FavoriteButton slug={slug} />
      </div>

      {adsEnabled && (
        <AdBanner slot="leaderboard-top" format="leaderboard" className="mb-xl" />
      )}

      <div
        className={cn(
          "grid grid-cols-1 w-full items-start gap-xl",
          adsEnabled && "lg:grid-cols-[1fr_160px]"
        )}
      >
        <div className="w-full max-w-[700px] mx-auto lg:mx-0 lg:max-w-none">
          <ToolUsageProvider slug={slug}>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm">
              {children}
            </div>
          </ToolUsageProvider>

          {adsEnabled && (
            <AdBanner
              slot="rectangle-result"
              format="rectangle"
              className="mt-xl w-full max-w-none"
            />
          )}

          {seoContent && (
            <section className="mt-2xl bg-surface-container-low rounded-2xl p-xl border border-outline-variant/30">
              {seoContent}
            </section>
          )}
        </div>

        {adsEnabled && (
          <aside className="hidden lg:block w-[160px] shrink-0 sticky top-24">
            <AdBanner slot="skyscraper-side" format="skyscraper" className="w-full" />
          </aside>
        )}
      </div>

      <RelatedTools category={category} currentSlug={slug} />
    </main>
  );
}
