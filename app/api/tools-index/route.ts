import { NextResponse } from "next/server";
import { getAllToolAgentMetadata } from "@/lib/tools/registry";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

export async function GET() {
  const tools = getAllToolAgentMetadata();
  return NextResponse.json(
    {
      site: "Toolsify",
      description:
        "Free online calculators, converters, and utility tools with structured JSON APIs.",
      toolCount: tools.length,
      tools,
    },
    { headers }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers });
}
