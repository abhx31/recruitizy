"use client";

import { type CSSProperties } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { toast } from "sonner";

import {
  updateApplicantProfile,
  type ApplicantProfile,
} from "@/api/applicant.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  applicantProfileSchema,
  buildGithubUrl,
  buildLinkedinUrl,
  buildPortfolioUrl,
  extractGithubHandle,
  extractLinkedinHandle,
  type ApplicantProfileFormInput,
  type ApplicantProfileFormValues,
} from "@/schemas/profile.schema";

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  minWidth: 0,
};

const inputStyle: CSSProperties = {
  height: "46px",
  paddingLeft: "16px",
  paddingRight: "16px",
};

function toFormState(
  profile: ApplicantProfile
): ApplicantProfileFormInput {
  return {
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    linkedin_url: extractLinkedinHandle(profile.linkedin_url),
    github_url: extractGithubHandle(profile.github_url),
    portfolio_url: profile.portfolio_url ?? "",
    years_of_experience:
      profile.years_of_experience?.toString() ?? "",
  };
}

export function ApplicantProfileForm({
  profile,
}: {
  profile: ApplicantProfile;
}) {
  const queryClient = useQueryClient();
  const form = useForm<
    ApplicantProfileFormInput,
    unknown,
    ApplicantProfileFormValues
  >({
    resolver: zodResolver(applicantProfileSchema),
    defaultValues: toFormState(profile),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(["applicant-profile"], profile);
      toast.success("Profile updated.");
    },
    onError: () => {
      toast.error("Unable to update profile.");
    },
  });

  function handleSubmit(values: ApplicantProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  return (
    <Card className="rounded-3xl border-border/50 bg-background/80">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Candidate Details
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  These details are saved to your applicant profile.
                </p>
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="h-9 w-fit self-start rounded-xl px-4"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save profile
              </Button>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{
                columnGap: "32px",
                marginTop: "56px",
                rowGap: "28px",
              }}
            >
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Frontend engineer"
                        className="rounded-xl"
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bengaluru, India"
                        className="rounded-xl"
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 98765 43210"
                        className="rounded-xl"
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_of_experience"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Years of experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="3"
                        className="rounded-xl"
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <SocialInput
                        field={field}
                        placeholder="username or full URL"
                        resolveUrl={buildLinkedinUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <SocialInput
                        field={field}
                        placeholder="username or full URL"
                        resolveUrl={buildGithubUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <SocialInput
                        field={field}
                        placeholder="yourportfolio.com"
                        resolveUrl={buildPortfolioUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem style={fieldStyle}>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="A short summary of your background, strengths, and goals."
                        className="min-h-32 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface SocialInputProps {
  // RHF's ControllerRenderProps has the correct onChange signature for
  // spreading into a native input — the local hand-rolled type was wrong.
  field: ControllerRenderProps<
    ApplicantProfileFormInput,
    "linkedin_url" | "github_url" | "portfolio_url"
  >;
  placeholder: string;
  resolveUrl: (value: string) => string | null;
}

function SocialInput({ field, placeholder, resolveUrl }: SocialInputProps) {
  const resolved = resolveUrl(field.value ?? "");

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        className="rounded-xl pr-10"
        style={inputStyle}
        {...field}
      />
      {resolved && (
        <a
          href={resolved}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open link in new tab"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
