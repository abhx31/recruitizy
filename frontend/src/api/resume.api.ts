import api from "@/lib/api";
import type { ApplicantProfile } from "@/api/applicant.api";

export interface Resume {
  id: string;
  original_name: string;
  is_active: boolean;
  created_at: string;
}

export interface ResumeDownload {
  download_url: string;
}

interface ResumeUploadUrl {
  upload_url: string;
  key: string;
}

interface SaveResumePayload {
  s3_key: string;
  original_name: string;
}

export async function getLatestResume() {
  const response = await api.get<Resume | null>("/resume/latest");

  return response.data;
}

export async function getResumeUploadUrl(file: File) {
  const response = await api.post<ResumeUploadUrl>(
    "/resume/upload-url",
    {
      filename: file.name,
      content_type: file.type,
    }
  );

  return response.data;
}

export async function saveResume(payload: SaveResumePayload) {
  const response = await api.post<Resume>("/resume/save", payload);

  return response.data;
}

export async function uploadResume(file: File) {
  const { upload_url, key } = await getResumeUploadUrl(file);

  await fetch(upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  return saveResume({
    s3_key: key,
    original_name: file.name,
  });
}

export async function getResumeDownloadUrl(resumeId: string) {
  const response = await api.get<ResumeDownload>(
    `/resume/${resumeId}/download`
  );

  return response.data;
}

export async function syncProfileFromLatestResume() {
  const response = await api.post<ApplicantProfile>(
    "/resume/sync-profile"
  );

  return response.data;
}
