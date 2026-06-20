"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function LocaleHtmlAttributes() {
  const locale = useLocale();

  useEffect(() => {
    const dir = locale === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
