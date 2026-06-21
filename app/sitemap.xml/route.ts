import { NextResponse } from "next/server";
import {
  getSitemapIndexEntries,
  SITEMAP_XML_HEADERS,
} from "@/lib/seo/sitemap-data";
import { buildSitemapIndexXml } from "@/lib/seo/sitemap-xml";

export function GET() {
  const xml = buildSitemapIndexXml(getSitemapIndexEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
