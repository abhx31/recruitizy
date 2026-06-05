import Link from "next/link";

import {
  BriefcaseBusiness,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import type { ApplicationStatus } from "@/api/application.api";
import { Card, CardContent } from "@/components/ui/card";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABEL,
} from "@/lib/status";

interface ApplicationCardProps {
  id: string;
  title: string;
  company: string;
  appliedAt: string;
  status: ApplicationStatus;
  score?: number | null;
}

export function ApplicationCard({
  id,
  title,
  company,
  appliedAt,
  status,
  score,
}: ApplicationCardProps) {
  return (
    <Link href={`/applicant/applications/${id}`}>
      <Card className="rounded-3xl border-border/50 bg-background/80 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${APPLICATION_STATUS_CLASSES[status]}`}
              >
                {APPLICATION_STATUS_LABEL[status]}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>{company}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Applied on {appliedAt}</span>
            </div>

            {typeof score === "number" && (
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">AI score</span>
                <span className="font-semibold tabular-nums text-primary">
                  {score}
                </span>
                <span className="text-muted-foreground">/ 100</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
