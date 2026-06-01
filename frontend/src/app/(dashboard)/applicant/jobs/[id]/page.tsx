"use client";

import { use } from "react";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BriefcaseBusiness,
  Clock3,
  Loader2,
} from "lucide-react";

import {
  formatEmploymentType,
  formatJobLevel,
  getJob,
} from "@/api/job.api";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { Button } from "@/components/ui/button";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const jobQuery = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  if (jobQuery.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        Loading job...
      </div>
    );
  }

  if (jobQuery.isError) {
    const isNotFound =
      jobQuery.error instanceof AxiosError &&
      jobQuery.error.response?.status === 404;

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {isNotFound ? "Job not found" : "Unable to load job"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isNotFound
              ? "The requested job does not exist."
              : "Something went wrong while fetching this job."}
          </p>
          {!isNotFound && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => jobQuery.refetch()}
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const job = jobQuery.data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      <div className="rounded-3xl border border-border/50 bg-background/80 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {job.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <BriefcaseBusiness className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{formatJobLevel(job.level)}</span>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {formatEmploymentType(job.employment_type)}
              </span>
              {job.status !== "OPEN" && (
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                  {job.status}
                </span>
              )}
            </div>
          </div>

          {job.status === "OPEN" && (
            <ApplyButton jobId={job.id} jobTitle={job.title} />
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-background/80 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          Job Description
        </h2>
        <p className="mt-5 leading-relaxed whitespace-pre-line text-muted-foreground">
          {job.description}
        </p>
      </div>

      {job.required_skills.length > 0 && (
        <div className="rounded-3xl border border-border/50 bg-background/80 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Required Skills
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {job.required_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
