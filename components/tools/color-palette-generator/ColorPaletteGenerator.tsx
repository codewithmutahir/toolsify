"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  generatePalettes,
  randomHexColor,
  type PaletteSwatch,
} from "@/lib/developer/color-palette";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("color-palette-generator")!;

const PALETTE_SECTIONS = [
  { key: "complementary", title: "Complementary" },
  { key: "analogous", title: "Analogous" },
  { key: "triadic", title: "Triadic" },
  { key: "monochromatic", title: "Monochromatic" },
] as const;

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#FF6B35");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const palettes = useMemo(() => generatePalettes(baseColor), [baseColor]);

  async function copyHex(hex: string) {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1500);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description={tool.description}
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              Free Color Palette Generator
            </h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                Generate harmonious color palettes from a single base color using
                complementary, analogous, triadic, and monochromatic color theory.
              </p>
              <p>
                Complementary colors sit opposite on the color wheel. Analogous
                colors are neighbors. Triadic palettes use three evenly spaced hues.
                Monochromatic palettes explore tints and shades of one hue.
              </p>
            </div>
            <ToolFaq
              items={[
                {
                  question:
                    "What's the difference between complementary and analogous colors?",
                  answer:
                    "Complementary colors are opposite on the color wheel and create strong contrast. Analogous colors are adjacent and feel more harmonious and cohesive.",
                },
                {
                  question: "Can I copy palette colors quickly?",
                  answer:
                    "Yes. Click any swatch to copy its hex code to your clipboard.",
                },
              ]}
            />
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-lg mb-xl">
          <label className="flex items-center gap-md">
            <span className="font-label text-label font-bold text-on-surface uppercase">
              Base color
            </span>
            <input
              type="color"
              value={baseColor}
              onChange={(event) => setBaseColor(event.target.value.toUpperCase())}
              className="h-12 w-12 rounded-lg border border-outline-variant cursor-pointer"
            />
            <span className="font-mono text-small text-on-surface">{baseColor}</span>
          </label>
          <button
            type="button"
            onClick={() => setBaseColor(randomHexColor())}
            className="bg-white border border-outline-variant text-on-surface px-lg py-sm rounded-lg font-label text-label hover:border-primary-container/50 transition-colors"
          >
            Randomize base color
          </button>
        </div>

        {palettes &&
          PALETTE_SECTIONS.map((section) => {
            const swatches = palettes[section.key] as PaletteSwatch[];
            return (
              <div key={section.key} className="mb-xl">
                <h3 className="font-h3 text-h3 text-on-surface mb-md">
                  {section.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-md">
                  {swatches.map((swatch) => (
                    <button
                      key={`${section.key}-${swatch.hex}`}
                      type="button"
                      onClick={() => copyHex(swatch.hex)}
                      className="group text-left"
                    >
                      <div
                        className="h-20 rounded-xl border border-outline-variant mb-sm transition-transform group-hover:scale-[1.02]"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <p className="font-mono text-small text-on-surface">
                        {swatch.hex}
                      </p>
                      {swatch.label && (
                        <p className="font-small text-small text-on-surface-variant">
                          {swatch.label}
                        </p>
                      )}
                      {copiedHex === swatch.hex && (
                        <p className="font-label text-label text-tertiary">
                          Copied!
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
      </ToolWrapper>
    </>
  );
}
