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
