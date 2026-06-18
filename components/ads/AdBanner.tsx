"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { areAdsEnabled } from "@/lib/ads";

interface AdBannerProps {
  slot: string;
  format: "leaderboard" | "rectangle" | "skyscraper";
  className?: string;
}

const formatSizes: Record<AdBannerProps["format"], string> = {
  leaderboard: "h-24 w-full",
  rectangle: "h-64 w-full max-w-none",
  skyscraper: "h-[600px] w-full",
};

function DevAdPlaceholder({
  format,
  className,
}: {
  format: AdBannerProps["format"];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-dashed border-outline-variant rounded-xl",
        "bg-surface-container-low flex flex-col items-center justify-center gap-sm",
        formatSizes[format],
        className
      )}
      aria-label={`Ad placeholder ${format}`}
    >
      <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl">
        ad_units
      </span>
      <p className="font-label text-label text-on-surface-variant/40 uppercase">
        AD PLACEMENT SPACE
      </p>
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdBanner({ slot, format, className }: AdBannerProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!areAdsEnabled()) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may not be loaded yet
    }
  }, []);

  if (!areAdsEnabled()) return null;

  if (process.env.NODE_ENV === "development") {
    return <DevAdPlaceholder format={format} className={className} />;
  }

  return (
    <ins
      className={cn("adsbygoogle block", formatSizes[format], className)}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
