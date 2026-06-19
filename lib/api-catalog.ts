import { SITE_URL } from "@/lib/config";

export const LINKSET_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export function buildApiCatalog() {
  const apiBase = `${SITE_URL}/api`;

  return {
    linkset: [
      {
        anchor: apiBase,
        "service-desc": [
          {
            href: `${apiBase}/openapi`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_URL}/llms.txt`,
            type: "text/plain",
          },
        ],
        status: [
          {
            href: `${apiBase}/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}

export const apiCatalogHeaders = {
  "Content-Type": LINKSET_CONTENT_TYPE,
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  Link: '</.well-known/api-catalog>; rel="api-catalog"',
};
