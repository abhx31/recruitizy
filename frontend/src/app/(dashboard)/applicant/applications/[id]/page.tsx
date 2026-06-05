"use client";

import { use } from "react";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

import { getMyApplication } from "@/api/application.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABEL,
} from "@/lib/status";

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const applicationQuery = useQuery({
    queryKey: ["my-application", id],
    queryFn: () => getMyApplication(id),
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  if (applicationQuery.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        Loading application...
      </div>
    );
  }

  if (applicationQuery.isError) {
    const isNotFound =
      applicationQuery.error instanceof AxiosError &&
      applicationQuery.error.response?.status === 404;

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {isNotFound ? "Application not found" : "Unable to load application"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isNotFound
              ? "This application doesn't exist or doesn't belong to you."
              : "Something went wrong while fetching this application."}
          </p>
          {!isNotFound && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => applicationQuery.refetch()}
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const application = applicationQuery.data;
  const aiScore = application.ai_score;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      <Card className="rounded-3xl border-border/50 bg-background/80">
        <CardContent className="p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {application.job.title}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${APPLICATION_STATUS_CLASSES[application.status]}`}
              >
                {APPLICATION_STATUS_LABEL[application.status]}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>{application.job.company}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Applied on {formatDate(application.created_at, "long")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {application.resume && (
        <Card className="rounded-3xl border-border/50 bg-background/80">
          <CardContent className="p-8">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Resume used</h2>
                <p className="text-sm text-muted-foreground">
                  {application.resume.original_name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {aiScore ? (
        <Card className="rounded-3xl border-border/50 bg-background/80">
          <CardContent className="p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">
                AI resume analysis
              </h2>
            </div>

            <div className="mt-6 w-full rounded-3xl bg-primary/10 p-8">
              <p className="text-sm text-muted-foreground">AI match score</p>
              <h3 className="mt-3 text-6xl font-bold tracking-tight text-primary">
                {aiScore.score}
                <span className="ml-1 text-2xl text-primary/60">/ 100</span>
              </h3>
            </div>

            {aiScore.strengths && aiScore.strengths.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-foreground">
                  Strengths
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiScore.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiScore.missing_skills && aiScore.missing_skills.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-foreground">
                  Missing skills
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiScore.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-destructive/10 px-3 py-1 text-sm text-destructive"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiScore.feedback && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-foreground">
                  Feedback
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {aiScore.feedback}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl border-border/50 bg-background/80">
          <CardContent className="flex items-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">
              AI is still evaluating your application. Refresh in a minute to
              see your match score.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
