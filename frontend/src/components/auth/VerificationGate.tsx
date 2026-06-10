"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { extractApiErrorMessage } from "@/lib/api-error";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Full-page gate shown to a logged-in user whose email is still PENDING_EMAIL.
 * Used by both the recruiter and applicant layouts.
 */
export function VerificationGate() {
  const user = useAuthStore((state) => state.user);

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success("Verification email sent. Check your inbox.");
    },
    onError: (error: unknown) => {
      toast.error(
        extractApiErrorMessage(error, "Unable to resend verification email.")
      );
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
              We&apos;ve sent a verification link to{" "}
              {user?.email ? (
                <span className="font-medium text-foreground">
                  {user.email}
                </span>
              ) : (
                "your email"
              )}
              . Click it to activate your account.
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
