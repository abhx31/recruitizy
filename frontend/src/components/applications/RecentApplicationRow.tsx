import Link from "next/link";

import type { Application } from "@/api/application.api";
import { formatDate } from "@/lib/format";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABEL,
} from "@/lib/status";

interface RecentApplicationRowProps {
  application: Application;
}

export function RecentApplicationRow({ application }: RecentApplicationRowProps) {
  return (
    <Link
      href={`/applicant/applications/${application.id}`}
      className="flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-colors hover:bg-muted/30"
    >
      <div className="min-w-0">
        <h3 className="truncate font-medium">{application.job.title}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {application.job.company} ·{" "}
          {formatDate(application.created_at, "compact")}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
          APPLICATION_STATUS_CLASSES[application.status]
        }`}
      >
        {APPLICATION_STATUS_LABEL[application.status]}
      </span>
    </Link>
  );
}
