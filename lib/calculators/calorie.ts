export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active";

export const activityLevels: {
  value: ActivityLevel;
  label: string;
  multiplier: number;
}[] = [
  { value: "sedentary", label: "Sedentary (little or no exercise)", multiplier: 1.2 },
  { value: "light", label: "Light (1–3 days/week)", multiplier: 1.375 },
  { value: "moderate", label: "Moderate (3–5 days/week)", multiplier: 1.55 },
  { value: "active", label: "Active (6–7 days/week)", multiplier: 1.725 },
  { value: "very-active", label: "Very active (physical job)", multiplier: 1.9 },
];

export interface CalorieResult {
  bmr: number;
  tdee: number;
  loseWeight: number;
  maintain: number;
  gainWeight: number;
}

export function calculateCalories(
  age: number,
  gender: Gender,
  weightKg: number,
  heightCm: number,
  activity: ActivityLevel
): CalorieResult | null {
  if (
    Number.isNaN(age) ||
    Number.isNaN(weightKg) ||
    Number.isNaN(heightCm)
  ) {
    return null;
  }
  if (age < 1 || weightKg <= 0 || heightCm <= 0) return null;

  const activityOption = activityLevels.find((a) => a.value === activity);
  if (!activityOption) return null;

  // Mifflin-St Jeor equation
  const bmr =
    gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * activityOption.multiplier;
  const round = (n: number) => Math.round(n);

  return {
    bmr: round(bmr),
    tdee: round(tdee),
    loseWeight: round(tdee - 500),
    maintain: round(tdee),
    gainWeight: round(tdee + 500),
  };
}
