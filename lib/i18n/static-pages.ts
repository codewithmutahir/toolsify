import type { Locale } from "@/i18n/routing";
import aboutPage from "@/messages/static-pages/about.json";
import authorPage from "@/messages/static-pages/author.json";
import cookiePolicyPage from "@/messages/static-pages/cookie-policy.json";
import disclaimerPage from "@/messages/static-pages/disclaimer.json";

type LocaleContent<T> = Record<Locale, T> & { en: T };

function pickLocale<T>(content: LocaleContent<T>, locale: Locale): T {
  return content[locale] ?? content.en;
}

export function getStaticPageMessages(locale: Locale) {
  return {
    aboutPage: pickLocale(aboutPage, locale),
    authorPage: pickLocale(authorPage, locale),
    cookiePolicyPage: pickLocale(cookiePolicyPage, locale),
    disclaimerPage: pickLocale(disclaimerPage, locale),
  };
}
