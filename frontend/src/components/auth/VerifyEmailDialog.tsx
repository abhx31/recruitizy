"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/api/auth.api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface VerifyEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function VerifyEmailDialog({
  open,
  onOpenChange,
  email,
}: VerifyEmailDialogProps) {
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="p-8">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-2">
            <AlertDialogTitle className="text-center text-xl font-semibold tracking-tight">
              Check your inbox
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm leading-relaxed">
              We've sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              <br />
              Click it to activate your recruiter account.
            </AlertDialogDescription>
            <p className="text-center text-xs text-muted-foreground/80">
              The link expires in 24 hours.
            </p>
          </div>
        </AlertDialogHeader>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            className="h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Got it
          </Button>
          <Button
            variant="ghost"
            className="h-10 rounded-xl text-muted-foreground hover:text-foreground"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
          >
            {resendMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
