import Link from "next/link";

import type { Job } from "@/api/job.api";
import {
  formatDate,
  formatEmploymentType,
  formatJobLevel,
} from "@/lib/format";
import { JOB_STATUS_CLASSES, JOB_STATUS_LABEL } from "@/lib/status";

interface RecentJobRowProps {
  job: Job;
}

export function RecentJobRow({ job }: RecentJobRowProps) {
  return (
    <Link
      href={`/recruiter/jobs/${job.id}/applicants`}
      className="flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-colors hover:bg-muted/30"
    >
      <div className="min-w-0">
        <h3 className="truncate font-medium">{job.title}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {formatJobLevel(job.level)} ·{" "}
          {formatEmploymentType(job.employment_type)} · Posted{" "}
          {formatDate(job.created_at, "compact")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums">
            {job.applicant_count ?? 0}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            applicants
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            JOB_STATUS_CLASSES[job.status]
          }`}
        >
          {JOB_STATUS_LABEL[job.status]}
        </span>
      </div>
    </Link>
  );
}
