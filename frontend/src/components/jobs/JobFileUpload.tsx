"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { useMutation } from "@tanstack/react-query";
import { FileText, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";

import { parseJobFile, type JobParsedFile } from "@/api/job.api";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/lib/api-error";

interface JobFileUploadProps {
  onParsed: (parsed: JobParsedFile) => void;
}

const ACCEPTED_TYPES = ".pdf,.txt,.md,application/pdf,text/plain,text/markdown";

export function JobFileUpload({ onParsed }: JobFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const mutation = useMutation({
    mutationFn: parseJobFile,
    onSuccess: (parsed) => {
      toast.success("Job description parsed. Review the fields below.");
      onParsed(parsed);
    },
    onError: (error: unknown) => {
      toast.error(extractApiErrorMessage(error, "Couldn't parse this file."));
    },
  });

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Maximum is 2 MB.");
      return;
    }

    mutation.mutate(file);
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    // Reset so the same file can be re-uploaded if needed
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!dragging) setDragging(true);
  }

  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 bg-muted/20 hover:border-primary/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={onChange}
      />

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {mutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </div>

      <div>
        <p className="text-base font-medium tracking-tight">
          {mutation.isPending
            ? "Reading your job description..."
            : "Have a job description on hand?"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {mutation.isPending
            ? "AI is extracting the fields — this takes 10–30 seconds."
            : "Upload a PDF or text file and we'll prefill the form below."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-xl px-5"
        disabled={mutation.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Upload JD file
      </Button>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <FileText className="h-3 w-3" />
        PDF, TXT, or MD · up to 2 MB
      </p>
    </div>
  );
}
