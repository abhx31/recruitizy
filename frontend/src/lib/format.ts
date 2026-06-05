import type { EmploymentType, JobLevel } from "@/api/job.api";

const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  INTERN: "Internship",
  CONTRACT: "Contract",
};

const LEVEL_LABEL: Record<JobLevel, string> = {
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MID: "Mid Level",
  SENIOR: "Senior",
};

export function formatEmploymentType(value: EmploymentType) {
  return EMPLOYMENT_TYPE_LABEL[value] ?? value;
}

export function formatJobLevel(value: JobLevel) {
  return LEVEL_LABEL[value] ?? value;
}

type DateStyle = "default" | "long" | "compact" | "monthYear";

const DATE_STYLE_OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  // "Nov 12, 2026" — list rows, card footers, the common case.
  default: { year: "numeric", month: "short", day: "numeric" },
  // "November 12, 2026" — detail pages, more conversational copy.
  long: { year: "numeric", month: "long", day: "numeric" },
  // "Nov 12" — dashboards / inline contexts where the year is implicit.
  compact: { month: "short", day: "numeric" },
  // "Nov 2026" — experience timelines and similar month-precision ranges.
  monthYear: { month: "short", year: "numeric" },
};

export function formatDate(value: string | Date, style: DateStyle = "default") {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(undefined, DATE_STYLE_OPTIONS[style]);
}

export function scoreTone(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-600";
  return "text-destructive";
}
