"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import CopyButton from "@/components/tools/shared/CopyButton";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("gradient-generator")!;

type GradientType = "linear" | "radial";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const PRESETS: Array<{
  name: string;
  type: GradientType;
  angle: number;
  stops: Omit<ColorStop, "id">[];
}> = [
  {
    name: "Sunset",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#FF6B35", position: 0 },
      { color: "#FFB347", position: 50 },
      { color: "#FFCC70", position: 100 },
    ],
  },
  {
    name: "Ocean",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#0058BE", position: 0 },
      { color: "#2170E4", position: 50 },
      { color: "#7EC8E3", position: 100 },
    ],
  },
  {
    name: "Forest",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#003A25", position: 0 },
      { color: "#006C49", position: 50 },
      { color: "#00AF79", position: 100 },
    ],
  },
  {
    name: "Aurora",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#FF6B35", position: 0 },
      { color: "#AB3500", position: 45 },
      { color: "#1A1A2E", position: 100 },
    ],
  },
  {
    name: "Lavender",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#E8E5FF", position: 0 },
      { color: "#EFECFF", position: 50 },
      { color: "#FFDBD0", position: 100 },
    ],
  },
];

function createStop(color: string, position: number): ColorStop {
  return {
    id: `${color}-${position}-${Math.random().toString(36).slice(2, 8)}`,
    color,
    position,
  };
}

export default function GradientGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialX, setRadialX] = useState(50);
  const [radialY, setRadialY] = useState(50);
  const [stops, setStops] = useState<ColorStop[]>([
    createStop("#FF6B35", 0),
    createStop("#0058BE", 100),
  ]);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.position - b.position),
    [stops]
  );

  const stopCss = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  const css =
    type === "linear"
      ? `background: linear-gradient(${angle}deg, ${stopCss});`
      : `background: radial-gradient(circle at ${radialX}% ${radialY}%, ${stopCss});`;

  function updateStop(id: string, patch: Partial<ColorStop>) {
    setStops((current) =>
      current.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop))
    );
  }

  function addStop() {
    if (stops.length >= 6) return;
    setStops((current) => [...current, createStop("#00AF79", 50)]);
  }

  function removeStop(id: string) {
    if (stops.length <= 2) return;
    setStops((current) => current.filter((stop) => stop.id !== id));
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((stop) => createStop(stop.color, stop.position)));
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
              Free CSS Gradient Generator
            </h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                Build beautiful linear and radial CSS gradients with live preview,
                adjustable color stops, and copy-ready CSS output.
              </p>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-md mt-xl">How to use</h2>
            <ol className="list-decimal list-inside space-y-sm font-body text-body text-on-surface-variant">
              <li>Choose linear or radial gradient type.</li>
              <li>Adjust angle or radial position and color stops.</li>
              <li>Copy the generated CSS into your stylesheet.</li>
            </ol>
            <ToolFaq
              items={[
                {
                  question: "How do I add more than 2 colors to a gradient?",
                  answer:
                    "Use Add color stop to insert up to six stops, then adjust each color and position percentage.",
                },
                {
                  question: "What's the difference between linear and radial gradients?",
                  answer:
                    "Linear gradients transition colors along a straight line at an angle. Radial gradients radiate outward from a center point.",
                },
              ]}
            />
          </>
        }
      >
        <div className="flex flex-wrap gap-sm mb-lg">
          {(["linear", "radial"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={cn(
                "px-md py-sm rounded-full font-label text-label transition-all capitalize",
                type === option
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-sm mb-lg">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-md py-sm rounded-lg border border-outline-variant font-label text-label hover:border-primary-container/50 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div
          className="h-48 rounded-2xl border border-outline-variant mb-xl"
          style={{
            background:
              type === "linear"
                ? `linear-gradient(${angle}deg, ${stopCss})`
                : `radial-gradient(circle at ${radialX}% ${radialY}%, ${stopCss})`,
          }}
        />

        {type === "linear" ? (
          <label className="block mb-lg">
            <span className="font-label text-label font-bold text-on-surface uppercase">
              Angle: {angle}°
            </span>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
              className="w-full mt-sm"
            />
          </label>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
            <label>
              <span className="font-label text-label font-bold text-on-surface uppercase">
                Center X: {radialX}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={radialX}
                onChange={(event) => setRadialX(Number(event.target.value))}
                className="w-full mt-sm"
              />
            </label>
            <label>
              <span className="font-label text-label font-bold text-on-surface uppercase">
                Center Y: {radialY}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={radialY}
                onChange={(event) => setRadialY(Number(event.target.value))}
                className="w-full mt-sm"
              />
            </label>
          </div>
        )}

        <div className="space-y-md mb-lg">
          {sortedStops.map((stop) => (
            <div
              key={stop.id}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-md items-center"
            >
              <input
                type="color"
                value={stop.color}
                onChange={(event) =>
                  updateStop(stop.id, { color: event.target.value })
                }
                className="h-10 w-10 rounded-lg border border-outline-variant"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={(event) =>
                  updateStop(stop.id, { position: Number(event.target.value) })
                }
                className="w-full"
              />
              <span className="font-mono text-small text-on-surface-variant w-12 text-right">
                {stop.position}%
              </span>
              <button
                type="button"
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                className="text-on-surface-variant hover:text-error disabled:opacity-30"
                aria-label="Remove color stop"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStop}
          disabled={stops.length >= 6}
          className="mb-lg bg-white border border-outline-variant text-on-surface px-lg py-sm rounded-lg font-label text-label hover:border-primary-container/50 disabled:opacity-40 transition-colors"
        >
          Add color stop
        </button>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
          <div className="flex justify-between items-center gap-md mb-sm">
            <p className="font-label text-label font-bold text-on-surface uppercase">
              Generated CSS
            </p>
            <CopyButton value={css} label="Copy CSS" />
          </div>
          <pre className="font-mono text-small text-on-surface whitespace-pre-wrap break-all">
            {css}
          </pre>
        </div>
      </ToolWrapper>
    </>
  );
}
