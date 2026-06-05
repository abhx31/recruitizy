export function EmptyApplications() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/50 py-10 text-center">
      <p className="text-sm font-medium">No applications yet</p>
      <p className="text-xs text-muted-foreground">
        Apply to a role to see it here.
      </p>
    </div>
  );
}
