import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Compact recruiter empty-state for "you haven't posted any jobs."
 * Used inside dashboard sections — for the full-card variant used on the
 * standalone jobs page, see EmptyJobsCard.
 */
export function EmptyJobs() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/50 py-10 text-center">
      <p className="text-sm font-medium">No jobs yet</p>
      <p className="text-xs text-muted-foreground">
        Post your first role to start receiving applicants.
      </p>
      <Button asChild variant="outline" className="mt-3 h-9 rounded-xl">
        <Link href="/recruiter/jobs/new">
          <Plus className="h-4 w-4" />
          Post a role
        </Link>
      </Button>
    </div>
  );
}
