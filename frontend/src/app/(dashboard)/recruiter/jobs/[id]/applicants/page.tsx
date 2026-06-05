"use client";

import { use, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  listJobApplications,
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/api/application.api";
import { getJob } from "@/api/job.api";
import { ApplicantCard } from "@/components/applications/ApplicantCard";
import { FilterChip } from "@/components/applications/FilterChip";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/lib/api-error";

type StatusFilter = "ALL" | ApplicationStatus;

export default function RecruiterApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
  });

  const applicationsQuery = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: () => listJobApplications(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some((a) => a.status === "PENDING");
      return hasPending ? 5000 : false;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "SHORTLISTED"
          ? "Applicant shortlisted."
          : "Applicant rejected."
      );
      queryClient.invalidateQueries({ queryKey: ["job-applications", jobId] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiErrorMessage(error, "Couldn't update applicant."));
    },
  });

  const counts = useMemo(() => {
    const list = applicationsQuery.data ?? [];
    return {
      total: list.length,
      shortlisted: list.filter((a) => a.status === "SHORTLISTED").length,
      rejected: list.filter((a) => a.status === "REJECTED").length,
      pending: list.filter((a) => a.status === "PENDING").length,
    };
  }, [applicationsQuery.data]);

  const filteredAndSorted = useMemo(() => {
    const list = applicationsQuery.data ?? [];
    const filtered =
      filter === "ALL" ? list : list.filter((a) => a.status === filter);

    return [...filtered].sort((a, b) => {
      const scoreA = a.ai_score?.score ?? -1;
      const scoreB = b.ai_score?.score ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [applicationsQuery.data, filter]);

  const job = jobQuery.data;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-9 rounded-xl"
          onClick={() => router.replace("/recruiter/jobs")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Button>
      </div>

      <DashboardHeader
        title="Applicants"
        description={
          job
            ? `${counts.total} ${
                counts.total === 1 ? "applicant" : "applicants"
              } for ${job.title}`
            : "Review and shortlist candidates for this role."
        }
      />

      {applicationsQuery.data && counts.total > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={counts.total}
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            tone="neutral"
          />
          <FilterChip
            label="Shortlisted"
            count={counts.shortlisted}
            active={filter === "SHORTLISTED"}
            onClick={() => setFilter("SHORTLISTED")}
            tone="positive"
          />
          <FilterChip
            label="Rejected"
            count={counts.rejected}
            active={filter === "REJECTED"}
            onClick={() => setFilter("REJECTED")}
            tone="negative"
          />
          {counts.pending > 0 && (
            <FilterChip
              label="Pending"
              count={counts.pending}
              active={filter === "PENDING"}
              onClick={() => setFilter("PENDING")}
              tone="warning"
            />
          )}
        </div>
      )}

      {applicationsQuery.isPending ? (
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          Loading applicants...
        </div>
      ) : applicationsQuery.isError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h3 className="text-lg font-semibold tracking-tight text-destructive">
            Couldn't load applicants
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong. Try refreshing the page.
          </p>
        </div>
      ) : counts.total === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
          <h3 className="text-lg font-semibold tracking-tight">
            No applicants yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Applicants will appear here as candidates apply.
          </p>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-16 text-center">
          <h3 className="text-base font-semibold tracking-tight">
            No applicants match this filter
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different filter to see more candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSorted.map((application) => {
            const isThisRowPending =
              statusMutation.isPending &&
              statusMutation.variables?.applicationId === application.id;

            return (
              <ApplicantCard
                key={application.id}
                application={application}
                isUpdating={isThisRowPending}
                pendingStatus={
                  isThisRowPending
                    ? statusMutation.variables?.status ?? null
                    : null
                }
                onUpdateStatus={(status) =>
                  statusMutation.mutate({
                    applicationId: application.id,
                    status,
                  })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

