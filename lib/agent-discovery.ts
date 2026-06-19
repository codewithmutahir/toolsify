import { SITE_URL } from "@/lib/config";

export type AgentIndexEntry = {
  name: string;
  protocol: string;
  fqdn: string;
  endpoint: string;
  description: string;
  capabilities: string[];
};

export function buildAgentIndex() {
  const domain = new URL(SITE_URL).hostname;

  const agents: AgentIndexEntry[] = [
    {
      name: "api-catalog",
      protocol: "https",
      fqdn: `_api-catalog._https._agents.${domain}`,
      endpoint: `${SITE_URL}/.well-known/api-catalog`,
      description: "RFC 9727 API catalog listing public HTTP APIs",
      capabilities: ["api-discovery", "service-documentation"],
    },
    {
      name: "site-guide",
      protocol: "https",
      fqdn: `_site-guide._https._agents.${domain}`,
      endpoint: `${SITE_URL}/llms.txt`,
      description: "Machine-readable site guide for agents and crawlers",
      capabilities: ["site-navigation", "tool-discovery"],
    },
  ];

  return {
    version: "1.0",
    domain,
    updated: new Date().toISOString().slice(0, 10),
    agents,
    links: {
      apiCatalog: `${SITE_URL}/.well-known/api-catalog`,
      serviceDoc: `${SITE_URL}/llms.txt`,
      sitemap: `${SITE_URL}/sitemap.xml`,
    },
  };
}
