"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  getApplicantProfile,
} from "@/api/applicant.api";
import {
  getLatestResume,
  getResumeDownloadUrl,
  syncProfileFromLatestResume,
  uploadResume,
} from "@/api/resume.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";
import { ExperienceCard } from "@/components/profile/ExperienceCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ResumeCard } from "@/components/profile/ResumeCard";
import { SkillsCard } from "@/components/profile/SkillsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

function formatExperienceDate(value: string | null) {
  if (!value) {
    return "Present";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const profileQuery = useQuery({
    queryKey: ["applicant-profile"],
    queryFn: getApplicantProfile,
  });

  const latestResumeQuery = useQuery({
    queryKey: ["latest-resume"],
    queryFn: getLatestResume,
  });

  const syncProfileMutation = useMutation({
    mutationFn: syncProfileFromLatestResume,
    retry: false,
    onSuccess: (profile) => {
      queryClient.setQueryData(["applicant-profile"], profile);
      toast.success("Profile updated from your latest resume.");
    },
    onError: () => {
      toast.error("Unable to sync profile from resume.");
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: uploadResume,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["latest-resume"],
      });
      toast.success("Resume uploaded.");
    },
    onError: () => {
      toast.error("Unable to upload resume.");
    },
  });

  function handleUploadResume(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume.");
      return;
    }

    uploadResumeMutation.mutate(file);
  }

  async function handleViewResume() {
    const resume = latestResumeQuery.data;

    if (!resume) {
      return;
    }

    try {
      const { download_url } = await getResumeDownloadUrl(resume.id);
      window.open(download_url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Unable to open resume.");
    }
  }

  const skills =
    profileQuery.data?.skills.map((skill) => skill.skill_name) ?? [];

  const experiences =
    profileQuery.data?.experiences.map((experience) => ({
      company: experience.company,
      role: experience.role,
      duration: `${formatExperienceDate(
        experience.start_date
      )} - ${formatExperienceDate(experience.end_date)}`,
    })) ?? [];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Profile"
        description="Manage your candidate profile and public links."
      />

      <ProfileHeader
        name={user?.name || "-"}
        email={user?.email || "-"}
        role={user?.role || "-"}
      />

      <ResumeCard
        resumeName={latestResumeQuery.data?.original_name}
        uploadedAt={latestResumeQuery.data?.created_at}
        isUploading={uploadResumeMutation.isPending}
        isSyncing={syncProfileMutation.isPending}
        onUpload={handleUploadResume}
        onSync={() => syncProfileMutation.mutate()}
        onView={handleViewResume}
      />

      {profileQuery.isPending && (
        <Card className="rounded-3xl border-border/50 bg-background/80">
          <CardContent className="flex items-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profile...
          </CardContent>
        </Card>
      )}

      {profileQuery.isError && (
        <Card className="rounded-3xl border-border/50 bg-background/80">
          <CardContent className="space-y-4 p-8">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Profile unavailable
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We could not load your applicant profile.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => profileQuery.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {profileQuery.data && (
        <>
          <ApplicantProfileForm profile={profileQuery.data} />

          <SkillsCard skills={skills} />

          <ExperienceCard experiences={experiences} />
        </>
      )}
    </div>
  );
}
