"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { setLocaleCookie } from "@/lib/i18n/locale-cookie";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  en: "en",
  ur: "ur",
  es: "es",
};

export default function LanguageSwitcher({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(nextLocale: string) {
    if (nextLocale === locale) return;
    setLocaleCookie(nextLocale as Locale);
    router.replace(pathname, { locale: nextLocale as Locale });
  }

  if (variant === "compact") {
    return (
      <label className={cn("flex items-center gap-xs", className)}>
        <span className="sr-only">{t("label")}</span>
        <select
          value={locale}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs font-label text-label text-on-surface cursor-pointer"
          aria-label={t("label")}
        >
          {locales.map((loc) => (
            <option key={loc} value={loc}>
              {t(loc)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className={cn("flex items-center gap-xs", className)}>
      <span className="font-label text-label text-on-surface-variant hidden sm:inline">
        {t("label")}:
      </span>
      <div className="flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-1">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleChange(loc)}
            className={cn(
              "px-sm py-xs rounded-md font-label text-label transition-colors",
              loc === locale
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
            aria-current={loc === locale ? "true" : undefined}
            aria-label={t(loc)}
          >
            {localeLabels[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
