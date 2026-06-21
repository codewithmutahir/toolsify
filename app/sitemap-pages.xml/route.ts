import { NextResponse } from "next/server";
import {
  getPagesSitemapEntries,
  SITEMAP_XML_HEADERS,
} from "@/lib/seo/sitemap-data";
import { buildUrlsetXml } from "@/lib/seo/sitemap-xml";

export async function GET() {
  const xml = buildUrlsetXml(await getPagesSitemapEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
