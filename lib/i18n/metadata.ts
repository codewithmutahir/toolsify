import { SITE_URL } from "@/lib/config";
import { locales, type Locale } from "@/i18n/routing";

export function localePath(locale: Locale, pathname = ""): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function buildAlternateLanguages(
  locale: Locale,
  pathname = ""
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const languages: Record<string, string> = {};

  for (const loc of locales) {
    languages[loc] = `${SITE_URL}${localePath(loc, normalized)}`;
  }

  languages["x-default"] = `${SITE_URL}${localePath("en", normalized)}`;

  return {
    canonical: `${SITE_URL}${localePath(locale, normalized)}`,
    languages,
  };
}

export function buildOpenGraphLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: "en_US",
    ur: "ur_PK",
    es: "es_ES",
  };
  return map[locale];
}
