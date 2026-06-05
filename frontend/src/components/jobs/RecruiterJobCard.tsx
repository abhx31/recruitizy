import Link from "next/link";

import { Pencil, Trash2, Users } from "lucide-react";

import type { Job } from "@/api/job.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDate,
  formatEmploymentType,
  formatJobLevel,
} from "@/lib/format";
import { JOB_STATUS_CLASSES, JOB_STATUS_LABEL } from "@/lib/status";

interface RecruiterJobCardProps {
  job: Job;
  onDelete: () => void;
}


export function RecruiterJobCard({ job, onDelete }: RecruiterJobCardProps) {
  return (
    <Card className="rounded-3xl border-border/50 bg-background/80 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {job.title}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  JOB_STATUS_CLASSES[job.status]
                }`}
              >
                {JOB_STATUS_LABEL[job.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.company} · {formatJobLevel(job.level)} ·{" "}
              {formatEmploymentType(job.employment_type)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Posted {formatDate(job.created_at)}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-semibold tabular-nums">
              {job.applicant_count ?? 0}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              applicants
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
          <Button asChild variant="outline" className="h-9 rounded-xl">
            <Link href={`/recruiter/jobs/${job.id}/applicants`}>
              <Users className="h-4 w-4" />
              View applicants
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
          >
            <Link
              href={`/recruiter/jobs/${job.id}/edit`}
              aria-label="Edit role"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete role"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
