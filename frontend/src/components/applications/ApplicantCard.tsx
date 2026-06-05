import {
  Check,
  Download,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  X,
} from "lucide-react";

import type {
  ApplicationStatus,
  RecruiterApplication,
} from "@/api/application.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, scoreTone } from "@/lib/format";
import {
  RECRUITER_APPLICATION_STATUS_CLASSES,
  RECRUITER_APPLICATION_STATUS_LABEL,
} from "@/lib/status";

interface ApplicantCardProps {
  application: RecruiterApplication;
  isUpdating: boolean;
  pendingStatus: ApplicationStatus | null;
  onUpdateStatus: (status: ApplicationStatus) => void;
}

/**
 * Recruiter-facing card showing one applicant for a role: identity, AI
 * score, resume download, and accept/reject controls. Distinct from
 * ApplicationCard, which is the applicant's own view of their application.
 */
export function ApplicantCard({
  application,
  isUpdating,
  pendingStatus,
  onUpdateStatus,
}: ApplicantCardProps) {
  const ai = application.ai_score;
  const resume = application.resume;
  const isShortlisted = application.status === "SHORTLISTED";
  const isRejected = application.status === "REJECTED";
  const isPending = application.status === "PENDING";

  return (
    <Card className="rounded-3xl border-border/50 bg-background/80 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {application.applicant.name}
            </h3>
            <a
              href={`mailto:${application.applicant.email}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              {application.applicant.email}
            </a>
            <p className="text-xs text-muted-foreground">
              Applied {formatDate(application.created_at)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                RECRUITER_APPLICATION_STATUS_CLASSES[application.status]
              }`}
            >
              {RECRUITER_APPLICATION_STATUS_LABEL[application.status]}
            </span>
            {isPending ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Scoring resume…
              </span>
            ) : ai ? (
              <div className="flex items-baseline gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span
                  className={`text-2xl font-bold tabular-nums leading-none ${scoreTone(
                    ai.score
                  )}`}
                >
                  {ai.score}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          {resume?.download_url ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-xl"
            >
              <a
                href={resume.download_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3.5 w-3.5" />
                {resume.original_name || "Download resume"}
              </a>
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Resume unavailable
            </span>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isRejected || isUpdating}
              className="h-9 rounded-xl text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => onUpdateStatus("REJECTED")}
            >
              {pendingStatus === "REJECTED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              Reject
            </Button>
            <Button
              size="sm"
              disabled={isShortlisted || isUpdating}
              className="h-9 rounded-xl"
              onClick={() => onUpdateStatus("SHORTLISTED")}
            >
              {pendingStatus === "SHORTLISTED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
