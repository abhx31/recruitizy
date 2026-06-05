"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { applyToJob } from "@/api/application.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/lib/api-error";

const ALREADY_APPLIED_MESSAGE = "You have already applied to this job.";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
}

export function ApplyButton({ jobId, jobTitle }: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const mutation = useMutation({
    mutationFn: () => applyToJob(jobId),
    onSuccess: () => {
      toast.success("Application submitted.");
      setHasApplied(true);
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      const message = extractApiErrorMessage(
        error,
        "Unable to submit application."
      );

      toast.error(message);

      if (message === ALREADY_APPLIED_MESSAGE) {
        setHasApplied(true);
        setIsOpen(false);
      }
    },
  });

  if (hasApplied) {
    return (
      <Button disabled className="h-11 rounded-xl px-6">
        <Check className="h-4 w-4" />
        Applied
      </Button>
    );
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(next) => {
        if (mutation.isPending) {
          return;
        }
        setIsOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button className="h-11 rounded-xl px-6">Apply Now</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply for this job?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to apply for{" "}
            <span className="font-medium text-foreground">{jobTitle}</span>.
            Your latest uploaded resume will be sent with the application. Make
            sure your profile and resume are up to date.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? "Applying..." : "Confirm Apply"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
