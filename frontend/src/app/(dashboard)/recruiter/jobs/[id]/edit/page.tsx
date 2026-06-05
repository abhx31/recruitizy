"use client";

import { use } from "react";

import { useRouter } from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getJob, updateJob } from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JobForm } from "@/components/jobs/JobForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { extractApiErrorMessage } from "@/lib/api-error";
import type { JobFormValues } from "@/schemas/job.schema";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
  });

  const mutation = useMutation({
    mutationFn: (values: JobFormValues) => updateJob(id, values),
    onSuccess: () => {
      toast.success("Role updated.");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      router.replace("/recruiter/jobs");
    },
    onError: (error: unknown) => {
      toast.error(extractApiErrorMessage(error, "Unable to update role."));
    },
  });

  if (jobQuery.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        Loading role...
      </div>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Role not found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This role doesn't exist or you don't have access to it.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.replace("/recruiter/jobs")}
          >
            Back to jobs
          </Button>
        </div>
      </div>
    );
  }

  const job = jobQuery.data;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Edit role"
        description="Update the role details. Existing applications keep their scores."
      />

      <Card className="rounded-3xl border-border/50 bg-background/80">
        <CardContent className="p-8">
          <JobForm
            submitLabel="Save changes"
            isSubmitting={mutation.isPending}
            defaultValues={{
              title: job.title,
              company: job.company,
              description: job.description,
              level: job.level,
              employment_type: job.employment_type,
              resume_match_threshold: job.resume_match_threshold ?? 70,
              required_skills: job.required_skills,
            }}
            onSubmit={(values) => mutation.mutate(values)}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
