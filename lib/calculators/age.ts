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

export function calculateAge(
  birthDate: Date,
  asOfDate: Date = new Date()
): AgeResult | null {
  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(asOfDate.getTime())) {
    return null;
  }
  if (birthDate > asOfDate) return null;

  let years = asOfDate.getFullYear() - birthDate.getFullYear();
  let months = asOfDate.getMonth() - birthDate.getMonth();
  let days = asOfDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor(
    (asOfDate.getTime() - birthDate.getTime()) / msPerDay
  );
  const totalHours = totalDays * 24;

  let nextBirthday = new Date(
    asOfDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday <= asOfDate) {
    nextBirthday = new Date(
      asOfDate.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
  }
  const nextBirthdayDays = Math.ceil(
    (nextBirthday.getTime() - asOfDate.getTime()) / msPerDay
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
