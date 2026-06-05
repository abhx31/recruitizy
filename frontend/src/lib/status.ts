import type { ApplicationStatus } from "@/api/application.api";
import type { JobStatus } from "@/api/job.api";

// Applicant-facing labels/classes for an application's status. Used wherever
// the applicant is the audience (their dashboard, application detail, etc.).
export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
};

export const APPLICATION_STATUS_CLASSES: Record<ApplicationStatus, string> = {
  PENDING: "bg-muted text-muted-foreground",
  SHORTLISTED: "bg-primary/10 text-primary",
  REJECTED: "bg-destructive/10 text-destructive",
};

// Recruiter-facing variant. PENDING reads as "AI scoring" because that's what
// it actually means on the recruiter side, and the ring styling draws the eye
// to in-flight rows that still need a decision.
export const RECRUITER_APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "AI scoring",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
};

export const RECRUITER_APPLICATION_STATUS_CLASSES: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  SHORTLISTED: "bg-primary/10 text-primary ring-1 ring-primary/20",
  REJECTED: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
};

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  OPEN: "Open",
  CLOSED: "Closed",
  DRAFT: "Draft",
};

export const JOB_STATUS_CLASSES: Record<JobStatus, string> = {
  OPEN: "bg-primary/10 text-primary",
  CLOSED: "bg-destructive/10 text-destructive",
  DRAFT: "bg-muted text-muted-foreground",
};
