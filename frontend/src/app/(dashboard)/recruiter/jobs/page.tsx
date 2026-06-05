"use client";

import { useState } from "react";

import Link from "next/link";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { deleteJob, listMyJobs, type Job } from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyJobsCard } from "@/components/jobs/EmptyJobsCard";
import { RecruiterJobCard } from "@/components/jobs/RecruiterJobCard";
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
import { extractApiErrorMessage } from "@/lib/api-error";

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
      toast.error(extractApiErrorMessage(error, "Unable to delete role."));
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
          <EmptyJobsCard />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {jobs.map((job) => (
              <RecruiterJobCard
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

