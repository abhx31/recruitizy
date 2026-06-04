"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Zustand `persist` hydrates from localStorage on the client only. During
  // SSR and the very first client render `user` is null even for a logged-in
  // user. Without this gate, the layout would redirect to /login on every
  // refresh, flash the login page briefly, then bounce back to the dashboard.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user === null) {
      router.replace("/login");
      return;
    }
    if (user.role !== "recruiter") {
      router.replace("/applicant/dashboard");
    }
  }, [mounted, user, router]);

  // Pre-hydration — render nothing rather than risking the wrong content.
  if (!mounted) {
    return null;
  }

  // Post-hydration — wrong user or no user, render nothing while the redirect
  // above fires.
  if (user === null || user.role !== "recruiter") {
    return null;
  }

  if (user.verification_status !== "VERIFIED") {
    return <VerificationGate />;
  }

  return <>{children}</>;
}

function VerificationGate() {
  const user = useAuthStore((state) => state.user);

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success("Verification email sent. Check your inbox.");
    },
    onError: (error: unknown) => {
      const detail =
        error instanceof AxiosError
          ? (error.response?.data as { detail?: string } | undefined)?.detail
          : null;
      toast.error(detail ?? "Unable to resend verification email.");
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-3xl border-border/50 bg-background/80">
        <CardContent className="space-y-6 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify your email to continue
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We've sent a verification link to{" "}
              {user?.email ? (
                <span className="font-medium text-foreground">
                  {user.email}
                </span>
              ) : (
                "your email"
              )}
              . Click it to activate your recruiter account and access the
              dashboard.
            </p>
          </div>

          <Button
            variant="outline"
            className="h-11 w-full rounded-xl"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
          >
            {resendMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Resend verification email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
