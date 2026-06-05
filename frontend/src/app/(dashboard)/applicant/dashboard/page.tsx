"use client";

import { useMemo } from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock,
  Loader2,
  Search,
  UserCircle,
} from "lucide-react";

import { getApplicantProfile } from "@/api/applicant.api";
import { listMyApplications } from "@/api/application.api";
import { EmptyApplications } from "@/components/applications/EmptyApplications";
import { RecentApplicationRow } from "@/components/applications/RecentApplicationRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";

const PROFILE_FIELDS = [
  "headline",
  "bio",
  "phone",
  "location",
  "linkedin_url",
  "github_url",
  "portfolio_url",
  "years_of_experience",
] as const;

export default function ApplicantDashboardPage() {
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: listMyApplications,
  });

  const profileQuery = useQuery({
    queryKey: ["applicant-profile"],
    queryFn: getApplicantProfile,
  });

  const stats = useMemo(() => {
    const applications = applicationsQuery.data ?? [];
    const profile = profileQuery.data;

    const total = applications.length;
    const shortlisted = applications.filter(
      (application) => application.status === "SHORTLISTED"
    ).length;
    const pending = applications.filter(
      (application) => application.status === "PENDING"
    ).length;

    let profileCompletion = 0;
    if (profile) {
      const totalFields =
        PROFILE_FIELDS.length + 2; // +1 for skills, +1 for experiences
      const filled =
        PROFILE_FIELDS.filter((field) => Boolean(profile[field])).length +
        (profile.skills.length > 0 ? 1 : 0) +
        (profile.experiences.length > 0 ? 1 : 0);
      profileCompletion = Math.round((filled / totalFields) * 100);
    }

    return { total, shortlisted, pending, profileCompletion };
  }, [applicationsQuery.data, profileQuery.data]);

  const recentApplications = useMemo(() => {
    return (applicationsQuery.data ?? []).slice(0, 5);
  }, [applicationsQuery.data]);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Applicant Dashboard"
        description="Track applications and discover new opportunities."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Applications"
          value={applicationsQuery.isPending ? "—" : stats.total.toString()}
          change={
            stats.total === 0
              ? "Apply to your first job"
              : `${stats.total} total`
          }
          icon={BriefcaseBusiness}
        />
        <StatsCard
          title="Shortlisted"
          value={
            applicationsQuery.isPending ? "—" : stats.shortlisted.toString()
          }
          change={
            stats.shortlisted === 0
              ? "None yet"
              : `${stats.shortlisted} role${stats.shortlisted === 1 ? "" : "s"}`
          }
          icon={BadgeCheck}
        />
        <StatsCard
          title="Pending"
          value={applicationsQuery.isPending ? "—" : stats.pending.toString()}
          change={
            stats.pending === 0
              ? "All decisions in"
              : "Awaiting AI evaluation"
          }
          icon={Clock}
        />
        <StatsCard
          title="Profile completion"
          value={
            profileQuery.isPending ? "—" : `${stats.profileCompletion}%`
          }
          change={
            stats.profileCompletion === 100
              ? "All set"
              : "Complete to get better matches"
          }
          icon={UserCircle}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-border/50 bg-background/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent applications
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/applicant/applications">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {applicationsQuery.isPending && (
            <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}

          {applicationsQuery.data &&
            (recentApplications.length === 0 ? (
              <EmptyApplications />
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application) => (
                  <RecentApplicationRow
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            ))}
        </section>

        <section className="flex flex-col rounded-3xl border border-border/50 bg-background/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight">
            Discover new roles
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse open positions matched against your profile.
          </p>
          <div className="mt-auto pt-6">
            <Button asChild className="h-10 rounded-xl px-5">
              <Link href="/applicant/jobs">
                <Search className="h-4 w-4" />
                Browse jobs
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

