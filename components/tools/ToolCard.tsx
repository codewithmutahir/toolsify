"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Tool } from "@/types/tool";
import { useMessages } from "next-intl";
import {
  categoryHomeStyles,
} from "@/lib/category-colors";
import {
  getLocalizedCategoryShortLabel,
} from "@/lib/i18n/localize";
import { categoryShortLabels } from "@/lib/category-colors";
import {
  categoryBorderHover,
  categoryIconHover,
} from "@/lib/category-hero";
import { cn } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "category" | "homepage" | "related" | "listing" | "browse";
  className?: string;
}

function ComingSoonBadge({ className }: { className?: string }) {
  const t = useTranslations("common");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-container-high px-sm py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant",
        className
      )}
    >
      {t("comingSoon")}
    </span>
  );
}

export default function ToolCard({
  tool,
  variant = "default",
  className,
}: ToolCardProps) {
  const t = useTranslations("common");
  const messages = useMessages();
  const colors = categoryHomeStyles[tool.category];
  const isComingSoon = !tool.implemented;
  const shortLabel = getLocalizedCategoryShortLabel(
    tool.category,
    messages,
    categoryShortLabels[tool.category]
  );

  if (variant === "homepage") {
    return (
      <Link
        href={`/${tool.slug}`}
        className={cn(
          "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg card-hover cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between mb-md">
          <span
            className="material-symbols-outlined text-primary-container"
            style={{ fontSize: "2.5rem", lineHeight: 1 }}
          >
            {tool.icon}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-sm py-1 rounded-lg uppercase tracking-wider",
              colors.badgeBg,
              colors.badgeText
            )}
          >
            {shortLabel}
          </span>
        </div>
        <h4 className="font-h3 text-h3 text-on-background mb-sm group-hover:text-primary transition-colors">
          {tool.title}
        </h4>
        <p className="font-body text-small text-on-surface-variant">
          {tool.shortDesc}
        </p>
      </Link>
    );
  }

  if (variant === "related") {
    return (
      <Link
        href={`/${tool.slug}`}
        className={cn(
          "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg",
          "hover:shadow-xl transition-all cursor-pointer",
          className
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform",
            colors.iconBg,
            colors.iconText
          )}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {tool.icon}
          </span>
        </div>
        <h3 className="font-h3 text-[18px] text-on-surface mb-xs group-hover:text-primary transition-colors">
          {tool.title}
        </h3>
        <p className="font-small text-small text-on-surface-variant">
          {tool.shortDesc}
        </p>
      </Link>
    );
  }

  if (variant === "listing" || variant === "browse") {
    const cardClassName = cn(
      "tool-card group bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col h-full",
      !isComingSoon && "hover:shadow-xl",
      !isComingSoon && categoryBorderHover[tool.category],
      isComingSoon && "opacity-90 cursor-default",
      className
    );

    const cardContent = (
      <>
        <div
          className={cn(
            "tool-icon w-12 h-12 rounded-lg flex items-center justify-center mb-md transition-all duration-300",
            colors.iconBg,
            colors.iconText,
            !isComingSoon && categoryIconHover[tool.category]
          )}
        >
          <span className="material-symbols-outlined text-[28px]">{tool.icon}</span>
        </div>
        <h3
          className={cn(
            "font-h3 text-h3 text-on-surface mb-xs transition-colors",
            !isComingSoon && "group-hover:text-primary"
          )}
        >
          {tool.title}
        </h3>
        <p className="font-small text-small text-on-surface-variant mb-lg flex-grow">
          {tool.shortDesc}
        </p>
        {isComingSoon ? (
          <ComingSoonBadge />
        ) : variant === "listing" ? (
          <div className="flex items-center gap-xs text-primary font-label group-hover:gap-md transition-all">
            <span>{t("calculateNow")}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        ) : (
          <CategoryBadge category={tool.category} />
        )}
      </>
    );

    if (isComingSoon) {
      return <div className={cardClassName}>{cardContent}</div>;
    }

    return (
      <Link href={`/${tool.slug}`} className={cardClassName}>
        {cardContent}
      </Link>
    );
  }

  if (isComingSoon) {
    return (
      <div
        className={cn(
          "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg opacity-90 cursor-default",
          className
        )}
      >
        <div className="flex items-start gap-md">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
              colors.iconBg,
              colors.iconText
            )}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {tool.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-h3 text-h3 text-on-surface">{tool.title}</h3>
            <p className="mt-xs font-small text-small text-on-surface-variant line-clamp-2">
              {variant === "category" ? tool.description : tool.shortDesc}
            </p>
            <div className="mt-sm flex items-center gap-sm">
              <CategoryBadge category={tool.category} />
              <ComingSoonBadge />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        "group block bg-surface-container-lowest border border-outline-variant rounded-xl p-lg",
        "hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-md">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
            colors.iconBg,
            colors.iconText,
            colors.iconHover
          )}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {tool.icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="mt-xs font-small text-small text-on-surface-variant line-clamp-2">
            {variant === "category" ? tool.description : tool.shortDesc}
          </p>
          <div className="mt-sm">
            <CategoryBadge category={tool.category} />
          </div>
        </div>
      </div>
      {variant === "category" && (
        <p className="mt-md font-small text-small font-bold text-primary-container group-hover:underline">
          {t("calculateNow")} →
        </p>
      )}
    </Link>
  );
}
