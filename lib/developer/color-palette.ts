import { hslToRgb, parseHex, rgbToHex } from "@/lib/calculators/color-converter";

export interface PaletteSwatch {
  hex: string;
  label?: string;
}

export interface ColorPalettes {
  complementary: PaletteSwatch[];
  analogous: PaletteSwatch[];
  triadic: PaletteSwatch[];
  monochromatic: PaletteSwatch[];
}

function hslFromHex(hex: string): { h: number; s: number; l: number } | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hexFromHsl(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function rotateHue(baseHue: number, degrees: number): number {
  return (baseHue + degrees + 360) % 360;
}

export function generatePalettes(baseHex: string): ColorPalettes | null {
  const hsl = hslFromHex(baseHex);
  if (!hsl) return null;

  const { h, s, l } = hsl;
  const base = { hex: baseHex.toUpperCase(), label: "Base" };

  return {
    complementary: [
      base,
      { hex: hexFromHsl(rotateHue(h, 180), s, l), label: "Complement" },
    ],
    analogous: [
      { hex: hexFromHsl(rotateHue(h, -30), s, l) },
      base,
      { hex: hexFromHsl(rotateHue(h, 30), s, l) },
    ],
    triadic: [
      base,
      { hex: hexFromHsl(rotateHue(h, 120), s, l) },
      { hex: hexFromHsl(rotateHue(h, 240), s, l) },
    ],
    monochromatic: [
      { hex: hexFromHsl(h, s, Math.max(10, l - 30)), label: "Dark" },
      { hex: hexFromHsl(h, s, Math.max(15, l - 15)), label: "Shade" },
      base,
      { hex: hexFromHsl(h, s, Math.min(90, l + 15)), label: "Tint" },
      { hex: hexFromHsl(h, s, Math.min(95, l + 30)), label: "Light" },
    ],
  };
}

export function randomHexColor(): string {
  const rgb = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
