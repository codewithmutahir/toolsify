import { SITE_URL } from "@/lib/config";

export const MCP_SERVER_NAME = "toolsify";
export const MCP_SERVER_VERSION = "0.1.0";
export const MCP_TRANSPORT_ENDPOINT = `${SITE_URL}/mcp`;

export function buildMcpServerCard() {
  return {
    serverInfo: {
      name: MCP_SERVER_NAME,
      version: MCP_SERVER_VERSION,
      description:
        "AI-powered, fast, and privacy-first digital tools to simplify work, boost productivity, and solve everyday tasks—all in one place.",
    },
    transport: {
      type: "streamable-http",
      endpoint: MCP_TRANSPORT_ENDPOINT,
    },
    capabilities: {
      tools: [
        "search-tools",
        "get-tool-details",
        "list-tools",
        "list-categories",
        "navigate-to-tool",
      ],
      resources: ["tools-catalog", "categories", "llms-txt"],
      prompts: [],
    },
  };
}
