"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { localePath } from "@/lib/i18n/metadata";
import { registerWebMcpTools } from "@/lib/webmcp/register-tools";

function getLocaleFromPath(): Locale {
  const segment = window.location.pathname.split("/")[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : "en";
}

function toLocalizedPath(url: string, locale: Locale): string {
  if (url.startsWith("http")) {
    try {
      const { pathname, search, hash } = new URL(url);
      return `${localePath(locale, pathname)}${search}${hash}`;
    } catch {
      return url;
    }
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;
  return localePath(locale, normalized);
}

export default function WebMcpProvider() {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    void registerWebMcpTools({
      navigate: (url) => {
        const locale = getLocaleFromPath();
        router.push(toLocalizedPath(url, locale));
      },
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [router]);

  return null;
}
