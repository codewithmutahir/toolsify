import { NextResponse } from "next/server";
import { apiCatalogHeaders, buildApiCatalog } from "@/lib/api-catalog";

export async function GET() {
  return NextResponse.json(buildApiCatalog(), { headers: apiCatalogHeaders });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: apiCatalogHeaders });
}
