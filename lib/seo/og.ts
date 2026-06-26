import { SITE_URL } from "@/lib/config";

export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const DEFAULT_OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  type: "image/png" as const,
  alt: "Toolsify - Free Online Tools",
};

export function buildOgImages(alt = DEFAULT_OG_IMAGE.alt) {
  return [{ ...DEFAULT_OG_IMAGE, alt }];
}
