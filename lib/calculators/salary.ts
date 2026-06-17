export interface SalaryBreakdown {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
}

const WEEKS_PER_YEAR = 52;
const WORK_DAYS_PER_WEEK = 5;
const HOURS_PER_WEEK = 40;

export function calculateSalary(annualSalary: number): SalaryBreakdown | null {
  if (Number.isNaN(annualSalary) || annualSalary < 0) return null;

  const monthly = annualSalary / 12;
  const weekly = annualSalary / WEEKS_PER_YEAR;
  const daily = weekly / WORK_DAYS_PER_WEEK;
  const hourly = weekly / HOURS_PER_WEEK;

  const round = (n: number) => Math.round(n * 100) / 100;

  return {
    annual: round(annualSalary),
    monthly: round(monthly),
    weekly: round(weekly),
    daily: round(daily),
    hourly: round(hourly),
  };
}
