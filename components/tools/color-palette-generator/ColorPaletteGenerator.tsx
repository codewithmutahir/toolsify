"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import {
  randomHexColor,
  type ColorPalettes,
  type PaletteSwatch,
} from "@/lib/developer/color-palette";

const PALETTE_SECTIONS = [
  { key: "complementary", title: "Complementary" },
  { key: "analogous", title: "Analogous" },
  { key: "triadic", title: "Triadic" },
  { key: "monochromatic", title: "Monochromatic" },
] as const;

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#FF6B35");
  const [copyFeedback, setCopyFeedback] = useState<{
    hex: string;
    ok: boolean;
  } | null>(null);

  const requestBody = useMemo(() => ({ baseColor }), [baseColor]);

  const { data: palettes } = useToolApi<ColorPalettes>(
    "color-palette-generator",
    requestBody
  );

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopyFeedback({ hex, ok: true });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyFeedback({ hex, ok: false });
    }
    window.setTimeout(() => setCopyFeedback(null), 1500);
  }

  return (
    <>
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
                    {copyFeedback?.hex === swatch.hex && (
                      <p
                        className={`font-label text-label ${copyFeedback.ok ? "text-tertiary" : "text-error"}`}
                      >
                        {copyFeedback.ok ? "Copied!" : "Copy failed"}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
    </>
  );
}
