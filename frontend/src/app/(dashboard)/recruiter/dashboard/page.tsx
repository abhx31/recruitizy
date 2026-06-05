"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  Plus,
  Users,
} from "lucide-react";

import { getMyJobStats, listMyJobs } from "@/api/job.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyJobs } from "@/components/jobs/EmptyJobs";
import { RecentJobRow } from "@/components/jobs/RecentJobRow";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["recruiter-job-stats"],
    queryFn: getMyJobStats,
  });

  const jobsQuery = useQuery({
    queryKey: ["my-jobs"],
    queryFn: listMyJobs,
  });

  const recentJobs = (jobsQuery.data?.jobs ?? []).slice(0, 5);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Recruiter Dashboard"
        description="Manage hiring activity, applicants, and job postings."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Open jobs"
          value={statsQuery.isPending ? "—" : statsQuery.data!.open_jobs.toString()}
          change={
            statsQuery.data && statsQuery.data.open_jobs === 0
              ? "Post your first role"
              : "Currently accepting applications"
          }
          icon={BriefcaseBusiness}
        />
        <StatsCard
          title="Total applicants"
          value={
            statsQuery.isPending
              ? "—"
              : statsQuery.data!.total_applicants.toString()
          }
          change={
            statsQuery.data
              ? `+${statsQuery.data.applicants_this_week} this week`
              : ""
          }
          icon={Users}
        />
        <StatsCard
          title="Applicants this week"
          value={
            statsQuery.isPending
              ? "—"
              : statsQuery.data!.applicants_this_week.toString()
          }
          change="Last 7 days"
          icon={CalendarDays}
        />
        <StatsCard
          title="Shortlisted"
          value={
            statsQuery.isPending ? "—" : statsQuery.data!.shortlisted.toString()
          }
          change={
            statsQuery.data && statsQuery.data.shortlisted === 0
              ? "None yet"
              : "Above your threshold"
          }
          icon={BadgeCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-border/50 bg-background/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent jobs
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/recruiter/jobs">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {jobsQuery.isPending && (
            <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}

          {jobsQuery.data &&
            (recentJobs.length === 0 ? (
              <EmptyJobs />
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <RecentJobRow key={job.id} job={job} />
                ))}
              </div>
            ))}
        </section>

        <section className="flex flex-col rounded-3xl border border-border/50 bg-background/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight">
            Post a new role
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Describe the role, set a shortlist threshold, and let AI score
            applicants the moment they apply.
          </p>
          <div className="mt-auto pt-6">
            <Button asChild className="h-10 rounded-xl px-5">
              <Link href="/recruiter/jobs/new">
                <Plus className="h-4 w-4" />
                New role
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

