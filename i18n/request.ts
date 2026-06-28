import { getRequestConfig } from "next-intl/server";
import en from "@/messages/en.json";
import { mergeMessages, stripToolPageContent } from "@/lib/i18n/merge-messages";
import { getStaticPageMessages } from "@/lib/i18n/static-pages";
import { routing, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const staticPages = getStaticPageMessages(locale as Locale);

  if (locale === routing.defaultLocale) {
    return { locale, messages: { ...en, ...staticPages } };
  }

  const localeMessages = (await import(`../messages/${locale}.json`)).default;
  const baseWithoutToolContent = stripToolPageContent(en as Parameters<typeof stripToolPageContent>[0]);
  return {
    locale,
    messages: mergeMessages(baseWithoutToolContent, {
      ...localeMessages,
      ...staticPages,
    }),
  };
});
