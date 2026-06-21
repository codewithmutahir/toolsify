import { NextResponse } from "next/server";
import {
  getToolsSitemapEntries,
  SITEMAP_XML_HEADERS,
} from "@/lib/seo/sitemap-data";
import { buildUrlsetXml } from "@/lib/seo/sitemap-xml";

export function GET() {
  const xml = buildUrlsetXml(getToolsSitemapEntries("es"));
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
