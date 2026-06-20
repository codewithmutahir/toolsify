import { getRequestConfig } from "next-intl/server";
import en from "@/messages/en.json";
import { mergeMessages, stripToolPageContent } from "@/lib/i18n/merge-messages";
import { routing, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  if (locale === routing.defaultLocale) {
    return { locale, messages: en };
  }

  const localeMessages = (await import(`../messages/${locale}.json`)).default;
  const baseWithoutToolContent = stripToolPageContent(en as Parameters<typeof stripToolPageContent>[0]);
  return {
    locale,
    messages: mergeMessages(baseWithoutToolContent, localeMessages),
  };
});
