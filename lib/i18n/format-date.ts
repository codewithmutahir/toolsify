import type { Locale } from "@/i18n/routing";

const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  ur: "ur-PK",
};

export function formatLocalizedDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Shared last-updated date for static policy pages. */
export const STATIC_PAGE_LAST_UPDATED = new Date("2026-06-28");
