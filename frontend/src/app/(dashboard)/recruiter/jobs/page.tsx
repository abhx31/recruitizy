import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function RecruiterJobsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Jobs"
        description="Post and manage your open roles."
      />
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
        <h3 className="text-lg font-semibold tracking-tight">Coming soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Job posting and management is in development.
        </p>
      </div>
    </div>
  );
}
