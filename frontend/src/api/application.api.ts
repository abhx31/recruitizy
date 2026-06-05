import api from "@/lib/api";
import type {
  EmploymentType,
  JobLevel,
  JobStatus,
} from "@/api/job.api";

export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "REJECTED";

export interface ApplicationJobInfo {
  id: string;
  title: string;
  company: string;
  level: JobLevel;
  employment_type: EmploymentType;
  status: JobStatus;
}

export interface ApplicationAIScore {
  score: number;
  strengths: string[] | null;
  missing_skills: string[] | null;
  feedback: string | null;
}

export interface ApplicationResumeInfo {
  id: string;
  original_name: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  created_at: string;
  job: ApplicationJobInfo;
  ai_score: ApplicationAIScore | null;
  resume: ApplicationResumeInfo | null;
}

interface ApplicationListResponse {
  applications: Application[];
}

export interface RecruiterApplicationResumeInfo {
  id: string;
  original_name: string;
  download_url: string | null;
}

export interface RecruiterApplication {
  id: string;
  job_id: string;
  status: ApplicationStatus;
  created_at: string;
  applicant: RecruiterApplicantInfo;
  ai_score: ApplicationAIScore | null;
  resume: RecruiterApplicationResumeInfo | null;
}

interface RecruiterApplicationListResponse {
  applications: RecruiterApplication[];
}


export async function applyToJob(jobId: string) {
  const response = await api.post<Application>(`/application/${jobId}`);

  return response.data;
}

export async function listMyApplications() {
  const response = await api.get<ApplicationListResponse>("/application/me");

  return response.data.applications;
}

export async function getMyApplication(applicationId: string) {
  const response = await api.get<Application>(
    `/application/me/${applicationId}`
  );

  return response.data;
}

export interface RecruiterApplicantInfo {
  id: string;
  name: string;
  email: string;
}


export async function listJobApplications(jobId: string) {
  const response = await api.get<RecruiterApplicationListResponse>(
    `/application/job/${jobId}`
  );

  return response.data.applications;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const response = await api.put<Application>(`/application/${applicationId}`, {
    status,
  });

  return response.data;
}
