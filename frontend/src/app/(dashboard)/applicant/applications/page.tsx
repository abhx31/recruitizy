"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { listMyApplications } from "@/api/application.api";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationFilterBar } from "@/components/applications/ApplicationFilterBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: listMyApplications,
  });

  const filteredApplications = useMemo(() => {
    const applications = applicationsQuery.data ?? [];
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.job.title.toLowerCase().includes(query) ||
        application.job.company.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || application.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [applicationsQuery.data, search, status]);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Applications"
        description="Track your job applications and their current status."
      />

      <ApplicationFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {applicationsQuery.isPending && (
        <div className="flex items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-muted-foreground">
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          Loading applications...
        </div>
      )}

      {applicationsQuery.isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
          <h3 className="text-lg font-semibold tracking-tight">
            Unable to load applications
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while fetching your applications.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => applicationsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {applicationsQuery.data && (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                id={application.id}
                title={application.job.title}
                company={application.job.company}
                appliedAt={formatDate(application.created_at)}
                status={application.status}
                score={application.ai_score?.score ?? null}
              />
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
              <h3 className="text-lg font-semibold tracking-tight">
                {applicationsQuery.data.length === 0
                  ? "No applications yet"
                  : "No applications match your filters"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {applicationsQuery.data.length === 0
                  ? "Apply to a job to see it tracked here."
                  : "Try adjusting your search or status filter."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
