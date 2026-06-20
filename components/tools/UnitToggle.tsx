"use client";

import { cn } from "@/lib/utils";

type UnitToggleProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  getLabel?: (option: T) => string;
};

export default function UnitToggle<T extends string>({
  options,
  value,
  onChange,
  className,
  getLabel,
}: UnitToggleProps<T>) {
  return (
    <div
      className={cn(
        "flex rounded-lg overflow-hidden border border-outline-variant",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "px-sm py-1 font-label text-[10px] uppercase transition-colors",
            value === option
              ? "active-toggle bg-primary-container text-on-primary"
              : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
          )}
        >
          {getLabel ? getLabel(option) : option}
        </button>
      ))}
    </div>
  );
}
