"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getApiErrorKey } from "@/lib/i18n/map-api-error";

type ToolApiResponse<T> =
  | { success: true; result: T }
  | { success: false; error: string };

export function useToolApi<T>(
  slug: string,
  body: Record<string, unknown> | null,
  debounceMs = 300
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const tApi = useTranslations("toolApi");

  const localizeError = useCallback(
    (message: string) => {
      const key = getApiErrorKey(message);
      return key ? tApi(key) : message;
    },
    [tApi]
  );

  const fetchResult = useCallback(async () => {
    if (!body) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tools/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as ToolApiResponse<T>;
      if (!json.success) {
        setData(null);
        setError(localizeError(json.error));
        return;
      }
      setData(json.result);
      setError(null);
    } catch {
      setData(null);
      setError(tApi("networkError"));
    } finally {
      setLoading(false);
    }
  }, [body, localizeError, slug, tApi]);

  useEffect(() => {
    const timer = window.setTimeout(fetchResult, debounceMs);
    return () => window.clearTimeout(timer);
  }, [debounceMs, fetchResult]);

  return { data, error, loading };
}
