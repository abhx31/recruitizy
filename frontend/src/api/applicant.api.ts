import api from "@/lib/api";

export interface ApplicantSkill {
  id: string;
  skill_name: string;
}

export interface ApplicantExperience {
  id: string;
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface ApplicantProfile {
  id: string;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  years_of_experience: number | null;
  profile_picture_url: string | null;
  skills: ApplicantSkill[];
  experiences: ApplicantExperience[];
}

export type ApplicantProfileUpdate = Partial<
  Pick<
    ApplicantProfile,
    | "headline"
    | "bio"
    | "phone"
    | "location"
    | "linkedin_url"
    | "github_url"
    | "portfolio_url"
    | "years_of_experience"
  >
>;

export async function getApplicantProfile() {
  const response = await api.get<ApplicantProfile>("/applicant/profile");

  return response.data;
}

export async function updateApplicantProfile(
  data: ApplicantProfileUpdate
) {
  const response = await api.put<ApplicantProfile>(
    "/applicant/profile",
    data
  );

  return response.data;
}
