"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface JsonTreeViewProps {
  data: unknown;
  className?: string;
}

function getValueType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function JsonNode({
  label,
  value,
  depth = 0,
  defaultOpen = true,
  visited = new WeakSet<object>(),
}: {
  label?: string;
  value: unknown;
  depth?: number;
  defaultOpen?: boolean;
  visited?: WeakSet<object>;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const entries =
    type === "object" && value !== null
      ? Object.entries(value as Record<string, unknown>)
      : type === "array"
        ? (value as unknown[]).map((item, index) => [String(index), item] as const)
        : [];

  if (!isExpandable) {
    return (
      <div
        className="flex items-start gap-xs py-0.5 font-mono text-small"
        style={{ paddingLeft: depth * 16 }}
      >
        {label !== undefined && (
          <span className="text-on-surface-variant shrink-0">{label}:</span>
        )}
        <PrimitiveValue value={value} />
      </div>
    );
  }

  if (isObject(value) && visited.has(value)) {
    return (
      <div
        className="flex items-start gap-xs py-0.5 font-mono text-small"
        style={{ paddingLeft: depth * 16 }}
      >
        {label !== undefined && (
          <span className="text-on-surface-variant shrink-0">{label}:</span>
        )}
        <span className="text-on-surface-variant italic">[Circular]</span>
      </div>
    );
  }

  if (isObject(value)) {
    visited.add(value);
  }

  const bracketOpen = type === "array" ? "[" : "{";
  const bracketClose = type === "array" ? "]" : "}";

  return (
    <div className="font-mono text-small" style={{ paddingLeft: depth * 16 }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-xs text-left hover:text-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
          {open ? "expand_more" : "chevron_right"}
        </span>
        {label !== undefined && (
          <span className="text-on-surface-variant">{label}:</span>
        )}
        <span className="text-on-surface">
          {bracketOpen}
          {!open && (
            <span className="text-on-surface-variant">
              {" "}
              {entries.length} {type === "array" ? "items" : "keys"}{" "}
            </span>
          )}
          {!open && bracketClose}
        </span>
      </button>
      {open && (
        <div>
          {entries.map(([key, child]) => (
            <JsonNode
              key={key}
              label={type === "array" ? undefined : key}
              value={child}
              depth={depth + 1}
              defaultOpen={depth < 1}
              visited={visited}
            />
          ))}
          <div style={{ paddingLeft: depth * 16 }} className="text-on-surface">
            {bracketClose}
          </div>
        </div>
      )}
    </div>
  );
}

function PrimitiveValue({ value }: { value: unknown }) {
  const type = getValueType(value);

  if (type === "string") {
    return <span className="text-secondary">&quot;{String(value)}&quot;</span>;
  }
  if (type === "number") {
    return <span className="text-tertiary">{String(value)}</span>;
  }
  if (type === "boolean") {
    return <span className="text-primary">{String(value)}</span>;
  }
  if (type === "null") {
    return <span className="text-on-surface-variant">null</span>;
  }

  return <span>{String(value)}</span>;
}

export default function JsonTreeView({ data, className }: JsonTreeViewProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low p-md",
        className
      )}
    >
      <JsonNode value={data} defaultOpen visited={new WeakSet()} />
    </div>
  );
}
