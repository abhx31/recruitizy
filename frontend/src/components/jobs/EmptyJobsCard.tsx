import Link from "next/link";

import { BriefcaseBusiness, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Full-card recruiter empty-state for "you haven't posted any jobs."
 * Used as the main content on the standalone jobs page. For the compact
 * dashboard-section variant, see EmptyJobs.
 */
export function EmptyJobsCard() {
  return (
    <Card className="rounded-3xl border-dashed border-border/50 bg-background/80">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            No roles posted yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Post your first role to start receiving applicants.
          </p>
        </div>
        <Button asChild className="mt-2 h-10 rounded-xl px-5">
          <Link href="/recruiter/jobs/new">
            <Plus className="h-4 w-4" />
            Post a role
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
