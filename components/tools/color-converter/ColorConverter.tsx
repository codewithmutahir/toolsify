"use client";

import { useCallback, useEffect, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  colorFromHex,
  colorFromHsl,
  colorFromRgb,
  type ColorValues,
} from "@/lib/calculators/color-converter";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("color-converter")!;

const defaultColor: ColorValues = {
  hex: "#FF6B35",
  rgb: { r: 255, g: 107, b: 53 },
  hsl: { h: 18, s: 100, l: 60 },
};

export default function ColorConverter() {
  const [hex, setHex] = useState(defaultColor.hex);
  const [r, setR] = useState(String(defaultColor.rgb.r));
  const [g, setG] = useState(String(defaultColor.rgb.g));
  const [b, setB] = useState(String(defaultColor.rgb.b));
  const [h, setH] = useState(String(defaultColor.hsl.h));
  const [s, setS] = useState(String(defaultColor.hsl.s));
  const [l, setL] = useState(String(defaultColor.hsl.l));
  const [activeField, setActiveField] = useState<"hex" | "rgb" | "hsl">("hex");

  const applyColor = useCallback((color: ColorValues) => {
    setHex(color.hex);
    setR(String(color.rgb.r));
    setG(String(color.rgb.g));
    setB(String(color.rgb.b));
    setH(String(color.hsl.h));
    setS(String(color.hsl.s));
    setL(String(color.hsl.l));
  }, []);

  useEffect(() => {
    if (activeField === "hex") {
      const color = colorFromHex(hex);
      if (color) applyColor(color);
    }
  }, [hex, activeField, applyColor]);

  const handleRgbChange = (field: "r" | "g" | "b", value: string) => {
    setActiveField("rgb");
    if (field === "r") setR(value);
    if (field === "g") setG(value);
    if (field === "b") setB(value);
    const color = colorFromRgb(
      parseFloat(field === "r" ? value : r),
      parseFloat(field === "g" ? value : g),
      parseFloat(field === "b" ? value : b)
    );
    if (color) applyColor(color);
  };

  const handleHslChange = (field: "h" | "s" | "l", value: string) => {
    setActiveField("hsl");
    if (field === "h") setH(value);
    if (field === "s") setS(value);
    if (field === "l") setL(value);
    const color = colorFromHsl(
      parseFloat(field === "h" ? value : h),
      parseFloat(field === "s" ? value : s),
      parseFloat(field === "l" ? value : l)
    );
    if (color) applyColor(color);
  };

  const handleHexChange = (value: string) => {
    setActiveField("hex");
    setHex(value.startsWith("#") ? value : `#${value}`);
  };

  const previewColor = hex.match(/^#[0-9A-Fa-f]{6}$/) ? hex : defaultColor.hex;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "DesignApplication",
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Convert between HEX, RGB, and HSL</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Edit any color format and all other fields update automatically. Preview
              your color in real time — perfect for web design and development.
            </p>
          </>
        }
      >
        <div
          className="w-full h-32 rounded-xl border border-outline-variant mb-xl transition-colors"
          style={{ backgroundColor: previewColor }}
        />

        <div className="space-y-lg">
          <div className="space-y-sm">
            <label htmlFor="color-hex" className="font-label text-label font-bold text-on-surface uppercase">
              HEX
            </label>
            <input
              id="color-hex"
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-3 gap-md">
            {(["r", "g", "b"] as const).map((channel) => (
              <div key={channel} className="space-y-sm">
                <label className="font-label text-label font-bold text-on-surface uppercase">
                  {channel.toUpperCase()}
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={channel === "r" ? r : channel === "g" ? g : b}
                  onChange={(e) => handleRgbChange(channel, e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-md">
            {(["h", "s", "l"] as const).map((channel) => (
              <div key={channel} className="space-y-sm">
                <label className="font-label text-label font-bold text-on-surface uppercase">
                  {channel.toUpperCase()}
                </label>
                <input
                  type="number"
                  min="0"
                  max={channel === "h" ? 360 : 100}
                  value={channel === "h" ? h : channel === "s" ? s : l}
                  onChange={(e) => handleHslChange(channel, e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </ToolWrapper>
    </>
  );
}
