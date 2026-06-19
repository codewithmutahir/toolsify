import { NextResponse } from "next/server";
import { buildOpenApiSpec } from "@/lib/openapi";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

export async function GET() {
  return NextResponse.json(buildOpenApiSpec(), { headers });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers });
}
