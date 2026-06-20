"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { localePath } from "@/lib/i18n/metadata";

export function useLocalizedPath(pathname = "") {
  const locale = useLocale() as Locale;
  return localePath(locale, pathname);
}
