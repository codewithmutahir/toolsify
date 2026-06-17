import { cn } from "@/lib/utils";

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

export default function AdBanner({ slot, format, className }: AdBannerProps) {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    return (
      <div
        data-ad-slot={slot}
        className={cn(formatSizes[format], className)}
        aria-label={`Advertisement ${format}`}
      />
    );
  }

  return (
    <div
      data-ad-slot={slot}
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
