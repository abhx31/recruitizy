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
  AlertDialogFooter,
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-center">
            Check your inbox
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>. Click
            it to activate your recruiter account.
          </AlertDialogDescription>
          <p className="text-center text-xs text-muted-foreground">
            The link expires in 24 hours.
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
          >
            {resendMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Resend verification email
          </Button>
          <Button
            className="h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Got it
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
