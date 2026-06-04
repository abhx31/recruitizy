"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { createJob, type JobParsedFile } from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JobFileUpload } from "@/components/jobs/JobFileUpload";
import { JobForm } from "@/components/jobs/JobForm";
import { Card, CardContent } from "@/components/ui/card";
import type { JobFormValues } from "@/schemas/job.schema";

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Hold the parsed defaults + a key to remount JobForm after a parse
  // (react-hook-form keeps its original defaultValues otherwise).
  const [parsedDefaults, setParsedDefaults] = useState<
    Partial<JobFormValues>
  >({});
  const [formKey, setFormKey] = useState(0);

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Role posted.");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-job-stats"] });
      router.replace("/recruiter/jobs");
    },
    onError: (error: unknown) => {
      const detail =
        error instanceof AxiosError
          ? (error.response?.data as { detail?: string } | undefined)?.detail
          : null;
      toast.error(detail ?? "Unable to post role.");
    },
  });

  function handleParsed(parsed: JobParsedFile) {
    // Map nullable backend fields to the form defaults. Only set fields
    // that were actually extracted; leave the rest at the schema defaults.
    const next: Partial<JobFormValues> = {};
    if (parsed.title) next.title = parsed.title;
    if (parsed.company) next.company = parsed.company;
    if (parsed.description) next.description = parsed.description;
    if (parsed.required_skills.length > 0)
      next.required_skills = parsed.required_skills;
    if (parsed.level) next.level = parsed.level;
    if (parsed.employment_type) next.employment_type = parsed.employment_type;

    setParsedDefaults(next);
    setFormKey((k) => k + 1);
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Post a new role"
        description="Describe the role and let AI scoring rank every applicant automatically."
      />

      <JobFileUpload onParsed={handleParsed} />

      <Card className="rounded-3xl border-border/50 bg-background/80">
        <CardContent className="p-8">
          <JobForm
            key={formKey}
            submitLabel="Post role"
            isSubmitting={mutation.isPending}
            defaultValues={parsedDefaults}
            onSubmit={(values) => mutation.mutate(values)}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
