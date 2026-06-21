import { NextResponse } from "next/server";
import {
  getToolsSitemapEntries,
  SITEMAP_XML_HEADERS,
} from "@/lib/seo/sitemap-data";
import { buildUrlsetXml } from "@/lib/seo/sitemap-xml";

export async function GET() {
  const xml = buildUrlsetXml(await getToolsSitemapEntries("ur"));
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
