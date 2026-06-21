import { NextResponse } from "next/server";
import {
  getSitemapIndexEntries,
  SITEMAP_XML_HEADERS,
} from "@/lib/seo/sitemap-data";
import { buildSitemapIndexXml } from "@/lib/seo/sitemap-xml";

export async function GET() {
  const xml = buildSitemapIndexXml(await getSitemapIndexEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
