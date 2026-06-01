import { type ChangeEvent, useRef } from "react";

import {
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface ResumeCardProps {
  resumeName?: string;
  uploadedAt?: string;
  isUploading?: boolean;
  isSyncing?: boolean;
  onUpload: (file: File) => void;
  onSync: () => void;
  onView?: () => void;
}

function formatUploadedAt(value?: string) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ResumeCard({
  resumeName,
  uploadedAt,
  isUploading = false,
  isSyncing = false,
  onUpload,
  onSync,
  onView,
}: ResumeCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formattedUploadedAt = formatUploadedAt(uploadedAt);
  const hasResume = Boolean(resumeName);
  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
    }

    event.target.value = "";
  }

  return (
    <Card className="rounded-3xl border-border/50 bg-background/80">
      <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold tracking-tight">
                Latest resume
              </h3>
              {hasResume && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              )}
            </div>

            <p className="mt-2 max-w-2xl truncate text-sm text-muted-foreground">
              {resumeName ?? "No resume uploaded yet."}
            </p>

            {formattedUploadedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Uploaded {formattedUploadedAt}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 md:justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 gap-2 rounded-xl px-5"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload resume
          </Button>

          {hasResume && (
            <Button
              type="button"
              variant="outline"
              onClick={onView}
              className="h-10 gap-2 rounded-xl px-5"
            >
              View
            </Button>
          )}

          <Button
            type="button"
            disabled={!hasResume || isSyncing || isUploading}
            onClick={onSync}
            className="h-10 gap-2 rounded-xl px-5"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSyncing ? "Syncing..." : "Sync with AI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
