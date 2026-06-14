import { ReactNode } from "react";
import { ToolCategory } from "@/types/tool";
import AdBanner from "@/components/ads/AdBanner";
import ToolHeader from "./ToolHeader";
import RelatedTools from "./RelatedTools";

interface ToolWrapperProps {
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  slug?: string;
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
    <div className="max-w-container-max mx-auto px-gutter py-xl">
      <ToolHeader
        title={title}
        description={description}
        category={category}
      />

      <AdBanner slot="leaderboard-top" format="leaderboard" className="mb-xl" />

      <div className="flex gap-xl">
        <div className="flex-1 min-w-0">
          {children}

          <AdBanner
            slot="rectangle-result"
            format="rectangle"
            className="mt-xl mx-auto"
          />

          {seoContent && (
            <section className="mt-2xl prose-sm max-w-none">{seoContent}</section>
          )}

          <RelatedTools category={category} currentSlug={slug} />
        </div>

        <aside className="hidden lg:block w-40 shrink-0">
          <div className="sticky top-24">
            <AdBanner slot="skyscraper-side" format="skyscraper" />
          </div>
        </aside>
      </div>
    </div>
  );
}
