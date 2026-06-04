import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function RecruiterApplicantsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Applicants"
        description="Review and shortlist candidates for this role."
      />
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
        <h3 className="text-lg font-semibold tracking-tight">Coming soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Applicant ranking and review is in development.
        </p>
      </div>
    </div>
  );
}
