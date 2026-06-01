import api from "@/lib/api";

export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "REJECTED";

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  created_at: string;
}

export async function applyToJob(jobId: string) {
  const response = await api.post<Application>(`/application/${jobId}`);

  return response.data;
}
