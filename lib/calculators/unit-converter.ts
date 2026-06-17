export type UnitCategory = "length" | "weight" | "temperature" | "speed" | "area";

export interface UnitDefinition {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const linear = (factor: number) => ({
  toBase: (v: number) => v * factor,
  fromBase: (v: number) => v / factor,
});

export const unitCategories: {
  id: UnitCategory;
  label: string;
  units: UnitDefinition[];
}[] = [
  {
    id: "length",
    label: "Length",
    units: [
      { id: "m", label: "Meters", ...linear(1) },
      { id: "km", label: "Kilometers", ...linear(1000) },
      { id: "cm", label: "Centimeters", ...linear(0.01) },
      { id: "mm", label: "Millimeters", ...linear(0.001) },
      { id: "mi", label: "Miles", ...linear(1609.344) },
      { id: "yd", label: "Yards", ...linear(0.9144) },
      { id: "ft", label: "Feet", ...linear(0.3048) },
      { id: "in", label: "Inches", ...linear(0.0254) },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    units: [
      { id: "kg", label: "Kilograms", ...linear(1) },
      { id: "g", label: "Grams", ...linear(0.001) },
      { id: "mg", label: "Milligrams", ...linear(0.000001) },
      { id: "lb", label: "Pounds", ...linear(0.453592) },
      { id: "oz", label: "Ounces", ...linear(0.0283495) },
      { id: "st", label: "Stones", ...linear(6.35029) },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    units: [
      {
        id: "c",
        label: "Celsius",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: "f",
        label: "Fahrenheit",
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      {
        id: "k",
        label: "Kelvin",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    units: [
      { id: "mps", label: "m/s", ...linear(1) },
      { id: "kmh", label: "km/h", ...linear(1 / 3.6) },
      { id: "mph", label: "mph", ...linear(0.44704) },
      { id: "knot", label: "Knots", ...linear(0.514444) },
    ],
  },
  {
    id: "area",
    label: "Area",
    units: [
      { id: "sqm", label: "Square meters", ...linear(1) },
      { id: "sqkm", label: "Square km", ...linear(1_000_000) },
      { id: "sqft", label: "Square feet", ...linear(0.092903) },
      { id: "sqmi", label: "Square miles", ...linear(2_589_988.11) },
      { id: "acre", label: "Acres", ...linear(4046.86) },
      { id: "ha", label: "Hectares", ...linear(10_000) },
    ],
  },
];

export function convertUnit(
  value: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): number | null {
  if (Number.isNaN(value)) return null;
  const base = fromUnit.toBase(value);
  const result = toUnit.fromBase(base);
  return Math.round(result * 1_000_000) / 1_000_000;
}

export function getCategoryUnits(category: UnitCategory): UnitDefinition[] {
  return unitCategories.find((c) => c.id === category)?.units ?? [];
}
