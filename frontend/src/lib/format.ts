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
