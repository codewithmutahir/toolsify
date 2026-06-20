import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import AllToolsPage from "@/components/tools/AllToolsPage";
import ToolSkeletonGrid from "@/components/tools/ToolSkeletonGrid";
import { generatePageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type ToolsPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ToolsPageProps) {
  return generatePageMetadata(
    params.locale as Locale,
    "/tools",
    "tools"
  );
}

export default function ToolsPage({ params }: ToolsPageProps) {
  setRequestLocale(params.locale);

  return (
    <Suspense
      fallback={
        <div className="max-w-container-max mx-auto px-gutter py-xl">
          <ToolSkeletonGrid />
        </div>
      }
    >
      <AllToolsPage />
    </Suspense>
  );
}
