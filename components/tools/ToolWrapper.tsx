import { ReactNode } from "react";
import AdBanner from "@/components/ads/AdBanner";
import ToolHeader from "./ToolHeader";
import RelatedTools from "./RelatedTools";
import { ToolCategory } from "@/types/tool";

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
  return (
    <main className="max-w-container-max mx-auto px-gutter md:px-xl py-lg">
      <ToolHeader title={title} description={description} category={category} />

      <AdBanner slot="leaderboard-top" format="leaderboard" className="mb-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-xl w-full items-start">
        <div className="w-full max-w-[700px] mx-auto lg:mx-0 lg:max-w-none">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm">
            {children}
          </div>

          <AdBanner
            slot="rectangle-result"
            format="rectangle"
            className="mt-xl w-full max-w-none"
          />

          {seoContent && (
            <section className="mt-2xl bg-surface-container-low rounded-2xl p-xl border border-outline-variant/30">
              {seoContent}
            </section>
          )}
        </div>

        <aside className="hidden lg:block w-[160px] shrink-0 sticky top-24">
          <AdBanner slot="skyscraper-side" format="skyscraper" className="w-full" />
        </aside>
      </div>

      <RelatedTools category={category} currentSlug={slug} />
    </main>
  );
}
