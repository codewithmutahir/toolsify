import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { generateToolMetadata } from "@/lib/seo";
import { getLocalizedToolBySlug } from "@/lib/i18n/server";
import ToolLoader from "@/components/tools/ToolLoader";
import ToolPageShell from "@/components/tools/ToolPageShell";
import {
  implementedToolSlugs,
  isImplementedToolSlug,
} from "@/components/tools/tool-registry";
import { routing, type Locale } from "@/i18n/routing";

type ToolPageProps = {
  params: { locale: string; "tool-slug": string };
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    implementedToolSlugs.map((slug) => ({
      locale,
      "tool-slug": slug,
    }))
  );
}

export async function generateMetadata({ params }: ToolPageProps) {
  const tool = await getLocalizedToolBySlug(params["tool-slug"]);
  if (!tool || !isImplementedToolSlug(params["tool-slug"])) {
    return {};
  }
  return generateToolMetadata(
    tool,
    params.locale as Locale,
    `/${params["tool-slug"]}`
  );
}

export default async function ToolPage({ params }: ToolPageProps) {
  setRequestLocale(params.locale);

  const slug = params["tool-slug"];

  if (!isImplementedToolSlug(slug)) {
    notFound();
  }

  const tool = await getLocalizedToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageShell tool={tool} slug={slug}>
      <ToolLoader slug={slug} />
    </ToolPageShell>
  );
}
