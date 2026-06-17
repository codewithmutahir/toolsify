export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  nextBirthdayDays: number;
  nextBirthdayLabel: string;
}

function pad(n: number): string {
  return String(n);
}

function normalizeToDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calculateAge(
  birthDate: Date,
  asOfDate: Date = new Date()
): AgeResult | null {
  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(asOfDate.getTime())) {
    return null;
  }

  const birth = normalizeToDay(birthDate);
  const asOf = normalizeToDay(asOfDate);

  if (birth > asOf) return null;

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / msPerDay);
  const totalHours = totalDays * 24;

  let nextBirthday = new Date(
    asOf.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  if (nextBirthday < asOf) {
    nextBirthday = new Date(
      asOf.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    );
  }
  const nextBirthdayDays = Math.round(
    (nextBirthday.getTime() - asOf.getTime()) / msPerDay
  );

  const nextBirthdayLabel =
    nextBirthdayDays === 0
      ? "Today is your birthday!"
      : `${nextBirthdayDays} day${nextBirthdayDays === 1 ? "" : "s"} until your next birthday`;

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    nextBirthdayDays,
    nextBirthdayLabel,
  };
}

export function formatAgeSummary(result: AgeResult): string {
  return `${pad(result.years)} years, ${pad(result.months)} months, ${pad(result.days)} days`;
}
