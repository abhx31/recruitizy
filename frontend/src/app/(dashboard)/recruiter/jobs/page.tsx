"use client";

import { useState } from "react";

import Link from "next/link";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BriefcaseBusiness,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { deleteJob, listMyJobs, type Job } from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatEmploymentType,
  formatJobLevel,
} from "@/lib/format";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

const STATUS_LABEL: Record<Job["status"], string> = {
  OPEN: "Open",
  CLOSED: "Closed",
  DRAFT: "Draft",
};

const STATUS_CLASSES: Record<Job["status"], string> = {
  OPEN: "bg-primary/10 text-primary",
  CLOSED: "bg-destructive/10 text-destructive",
  DRAFT: "bg-muted text-muted-foreground",
};

export default function RecruiterJobsPage() {
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);

  const jobsQuery = useQuery({
    queryKey: ["my-jobs"],
    queryFn: listMyJobs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Role deleted.");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-job-stats"] });
      setPendingDelete(null);
    },
    onError: (error: unknown) => {
      const detail =
        error instanceof AxiosError
          ? (error.response?.data as { detail?: string } | undefined)?.detail
          : null;
      toast.error(detail ?? "Unable to delete role.");
    },
  });

  const jobs = jobsQuery.data?.jobs ?? [];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <DashboardHeader
          title="Jobs"
          description="Post and manage your open roles."
        />
        <Button asChild className="h-10 rounded-xl px-5">
          <Link href="/recruiter/jobs/new">
            <Plus className="h-4 w-4" />
            Post a role
          </Link>
        </Button>
      </div>

      {jobsQuery.isPending && (
        <div className="flex items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-muted-foreground">
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          Loading jobs...
        </div>
      )}

      {jobsQuery.isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
          <h3 className="text-lg font-semibold tracking-tight">
            Unable to load jobs
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong fetching your roles.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => jobsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {jobsQuery.data &&
        (jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onDelete={() => setPendingDelete(job)}
              />
            ))}
          </div>
        ))}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next && !deleteMutation.isPending) {
            setPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {pendingDelete?.title}
              </span>{" "}
              will be marked closed and removed from the public job board.
              Existing applications stay intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (pendingDelete) {
                  deleteMutation.mutate(pendingDelete.id);
                }
              }}
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Delete role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function JobRow({
  job,
  onDelete,
}: {
  job: Job;
  onDelete: () => void;
}) {
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
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[job.status]}`}
              >
                {STATUS_LABEL[job.status]}
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

function EmptyState() {
  return (
    <Card className="rounded-3xl border-dashed border-border/50 bg-background/80">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            No roles posted yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Post your first role to start receiving applicants.
          </p>
        </div>
        <Button asChild className="mt-2 h-10 rounded-xl px-5">
          <Link href="/recruiter/jobs/new">
            <Plus className="h-4 w-4" />
            Post a role
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
