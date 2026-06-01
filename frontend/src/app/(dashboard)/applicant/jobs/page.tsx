"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  formatEmploymentType,
  listJobs,
} from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JobCard } from "@/components/jobs/JobCard";
import { JobsFilterBar } from "@/components/jobs/JobsFilterBar";
import { Button } from "@/components/ui/button";

export default function ApplicantJobsPage() {
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("all");

  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: () => listJobs(),
  });

  const filteredJobs = useMemo(() => {
    const jobs = jobsQuery.data?.jobs ?? [];
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      if (job.status !== "OPEN") {
        return false;
      }

      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query);

      const matchesExperience =
        experience === "all" || job.level === experience;

      return matchesSearch && matchesExperience;
    });
  }, [jobsQuery.data, search, experience]);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Browse Jobs"
        description="Discover opportunities tailored to your career."
      />

      <JobsFilterBar
        search={search}
        onSearchChange={setSearch}
        experience={experience}
        onExperienceChange={setExperience}
      />

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
            Something went wrong while fetching the listings.
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

      {jobsQuery.data && (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company}
                experience={job.level}
                type={formatEmploymentType(job.employment_type)}
                description={job.description}
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
              <h3 className="text-lg font-semibold tracking-tight">
                No jobs found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
