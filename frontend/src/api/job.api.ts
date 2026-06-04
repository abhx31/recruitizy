import api from "@/lib/api";

export type JobLevel = "FRESHER" | "JUNIOR" | "MID" | "SENIOR";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERN"
  | "CONTRACT";

export type JobStatus = "OPEN" | "CLOSED" | "DRAFT";

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  required_skills: string[];
  resume_match_threshold: number | null;
  recruiter_id: string;
  level: JobLevel;
  employment_type: EmploymentType;
  status: JobStatus;
  created_at: string;
  applicant_count?: number | null;
}

interface JobListResponse {
  jobs: Job[];
  total: number;
}

export interface RecruiterJobStats {
  open_jobs: number;
  total_applicants: number;
  applicants_this_week: number;
  shortlisted: number;
}

export async function listJobs(params?: { skip?: number; limit?: number }) {
  const response = await api.get<JobListResponse>("/job", {
    params: {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 20,
    },
  });

  return response.data;
}

export async function getJob(jobId: string) {
  const response = await api.get<Job>(`/job/${jobId}`);

  return response.data;
}

export async function listMyJobs() {
  const response = await api.get<JobListResponse>("/job/me");

  return response.data;
}

export async function getMyJobStats() {
  const response = await api.get<RecruiterJobStats>("/job/me/stats");

  return response.data;
}

export interface JobPayload {
  title: string;
  description: string;
  company: string;
  required_skills: string[];
  resume_match_threshold: number;
  level: JobLevel;
  employment_type: EmploymentType;
}

export async function createJob(payload: JobPayload) {
  const response = await api.post<Job>("/job", payload);

  return response.data;
}

export async function updateJob(jobId: string, payload: Partial<JobPayload> & { status?: JobStatus }) {
  const response = await api.put<Job>(`/job/${jobId}`, payload);

  return response.data;
}

export async function deleteJob(jobId: string) {
  await api.delete(`/job/${jobId}`);
}

export interface JobParsedFile {
  title: string | null;
  description: string | null;
  company: string | null;
  required_skills: string[];
  level: JobLevel | null;
  employment_type: EmploymentType | null;
}

interface JobParseUploadURL {
  upload_url: string;
  key: string;
}

export async function parseJobFile(file: File) {
  const urlResponse = await api.post<JobParseUploadURL>(
    "/job/parse-upload-url",
    {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
    }
  );

  const { upload_url, key } = urlResponse.data;

  await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  const parseResponse = await api.post<JobParsedFile>("/job/parse", {
    s3_key: key,
  });

  return parseResponse.data;
}
