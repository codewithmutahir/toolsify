import type { Metadata } from "next";
import { Suspense } from "react";
import AllToolsPage from "@/components/tools/AllToolsPage";
import ToolSkeletonGrid from "@/components/tools/ToolSkeletonGrid";

export const metadata: Metadata = {
  title: "All Free Online Tools — 50+ Calculators & Converters | Toolsify",
  description:
    "Browse 50+ free online tools including calculators, converters, text tools, and more.",
  keywords: [
    "free online tools",
    "all tools",
    "calculators",
    "converters",
    "toolsify",
  ],
  openGraph: {
    title: "All Free Online Tools | Toolsify",
    description:
      "Browse 50+ free online tools including calculators, converters, text tools, and more.",
    url: "https://toolsify.online/tools",
    siteName: "Toolsify",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "All Free Online Tools | Toolsify",
    description:
      "Browse 50+ free online tools including calculators, converters, text tools, and more.",
  },
  alternates: {
    canonical: "https://toolsify.online/tools",
  },
  robots: { index: true, follow: true },
};

export default function ToolsPage() {
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
