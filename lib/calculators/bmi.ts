export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";

export interface BMIResult {
  bmi: number;
  category: string;
  position: number;
}

export function calculateBMI(
  weight: number,
  height: number,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit
): BMIResult | null {
  if (!weight || !height || weight <= 0 || height <= 0) return null;

  const weightKg = weightUnit === "kg" ? weight : weight * 0.453592;
  const heightM = heightUnit === "cm" ? height / 100 : height * 0.3048;

  if (heightM <= 0) return null;

  const bmi = weightKg / (heightM * heightM);

  let category: string;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  const min = 15;
  const max = 40;
  const position = Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    position,
  };
}
