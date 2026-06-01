import { z } from "zod";

const nullableText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

function buildSocialUrl(value: string, handlePrefix: string): string | null {
  const trimmed = value.trim().replace(/^@/, "");
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed.slice(4)}`;
  if (/\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  return `${handlePrefix}${trimmed}`;
}

export const buildLinkedinUrl = (value: string) =>
  buildSocialUrl(value, "https://www.linkedin.com/in/");

export const buildGithubUrl = (value: string) =>
  buildSocialUrl(value, "https://github.com/");

export function buildPortfolioUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed.slice(4)}`;
  return `https://${trimmed}`;
}

export function extractLinkedinHandle(
  url: string | null | undefined
): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!u.hostname.toLowerCase().includes("linkedin.com")) return url;
    return u.pathname.replace(/^\/in\//, "").replace(/\/$/, "") || url;
  } catch {
    return url ?? "";
  }
}

export function extractGithubHandle(
  url: string | null | undefined
): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!u.hostname.toLowerCase().includes("github.com")) return url;
    return u.pathname.replace(/^\//, "").replace(/\/$/, "") || url;
  } catch {
    return url ?? "";
  }
}

const linkedinField = z
  .string()
  .trim()
  .transform((value) => buildLinkedinUrl(value));

const githubField = z
  .string()
  .trim()
  .transform((value) => buildGithubUrl(value));

const portfolioField = z
  .string()
  .trim()
  .refine((value) => {
    if (value.length === 0) return true;
    return z.url().safeParse(buildPortfolioUrl(value) ?? "").success;
  }, "Please enter a valid URL.")
  .transform((value) => buildPortfolioUrl(value));

export const applicantProfileSchema = z.object({
  headline: nullableText,
  bio: nullableText,
  phone: nullableText,
  location: nullableText,
  linkedin_url: linkedinField,
  github_url: githubField,
  portfolio_url: portfolioField,
  years_of_experience: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 ||
        (Number.isInteger(Number(value)) && Number(value) >= 0),
      "Years of experience must be a positive whole number."
    )
    .transform((value) =>
      value.length > 0 ? Number(value) : null
    ),
});

export type ApplicantProfileFormInput = z.input<
  typeof applicantProfileSchema
>;

export type ApplicantProfileFormValues = z.output<
  typeof applicantProfileSchema
>;
