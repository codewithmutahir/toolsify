import { setRequestLocale } from "next-intl/server";
import { getFeaturedTools, tools } from "@/constants/tools";
import { generatePageMetadata } from "@/lib/seo";
import { getLocalizedTools } from "@/lib/i18n/server";
import { routing, type Locale } from "@/i18n/routing";
import HomeContent from "@/components/home/HomeContent";

type HomePageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps) {
  return generatePageMetadata(
    params.locale as Locale,
    "/",
    "home"
  );
}

export default async function Home({ params }: HomePageProps) {
  setRequestLocale(params.locale);

  const featuredTools = await getLocalizedTools(
    getFeaturedTools().slice(0, 8)
  );
  const totalTools = tools.length;

  return <HomeContent featuredTools={featuredTools} totalTools={totalTools} />;
}
