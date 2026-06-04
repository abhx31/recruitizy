import { z } from "zod";

export const jobFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(120, "Title is too long."),
    company: z
      .string()
      .trim()
      .min(1, "Company is required.")
      .max(120, "Company name is too long."),
    description: z
      .string()
      .trim()
      .min(50, "Description must be at least 50 characters."),
    level: z.enum(["FRESHER", "JUNIOR", "MID", "SENIOR"]),
    employment_type: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACT"]),
    resume_match_threshold: z
      .number({ message: "Threshold is required." })
      .int("Threshold must be a whole number.")
      .min(0, "Threshold must be 0 or higher.")
      .max(100, "Threshold can't exceed 100."),
    required_skills: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one required skill.")
      .max(20, "Too many skills — keep it focused."),
  });

export type JobFormValues = z.infer<typeof jobFormSchema>;
