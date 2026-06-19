"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import type { ColorValues } from "@/lib/calculators/color-converter";

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

  const requestBody = useMemo(() => {
    if (activeField === "hex") {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
      return { format: "hex", hex };
    }
    if (activeField === "rgb") {
      const rv = parseFloat(r);
      const gv = parseFloat(g);
      const bv = parseFloat(b);
      if (Number.isNaN(rv) || Number.isNaN(gv) || Number.isNaN(bv)) return null;
      return { format: "rgb", r: rv, g: gv, b: bv };
    }
    const hv = parseFloat(h);
    const sv = parseFloat(s);
    const lv = parseFloat(l);
    if (Number.isNaN(hv) || Number.isNaN(sv) || Number.isNaN(lv)) return null;
    return { format: "hsl", h: hv, s: sv, l: lv };
  }, [activeField, hex, r, g, b, h, s, l]);

  const { data: colorResult } = useToolApi<ColorValues>(
    "color-converter",
    requestBody
  );

  useEffect(() => {
    if (colorResult) applyColor(colorResult);
  }, [colorResult, applyColor]);

  const handleRgbChange = (field: "r" | "g" | "b", value: string) => {
    setActiveField("rgb");
    if (field === "r") setR(value);
    if (field === "g") setG(value);
    if (field === "b") setB(value);
  };

  const handleHslChange = (field: "h" | "s" | "l", value: string) => {
    setActiveField("hsl");
    if (field === "h") setH(value);
    if (field === "s") setS(value);
    if (field === "l") setL(value);
  };

  const handleHexChange = (value: string) => {
    setActiveField("hex");
    setHex(value.startsWith("#") ? value : `#${value}`);
  };

  const previewColor = hex.match(/^#[0-9A-Fa-f]{6}$/) ? hex : defaultColor.hex;

  return (
    <>
      <div
        className="w-full h-32 rounded-xl border border-outline-variant mb-xl transition-colors"
        style={{ backgroundColor: previewColor }}
      />

      <div className="space-y-lg">
        <div className="space-y-sm">
          <label
            htmlFor="color-hex"
            className="font-label text-label font-bold text-on-surface uppercase"
          >
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
    </>
  );
}
