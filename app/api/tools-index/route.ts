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
        "AI-powered, fast, and privacy-first digital tools to simplify work, boost productivity, and solve everyday tasks—all in one place.",
      toolCount: tools.length,
      tools,
    },
    { headers }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers });
}
