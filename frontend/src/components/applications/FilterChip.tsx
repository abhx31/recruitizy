interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone: "neutral" | "positive" | "negative" | "warning";
}

const TONE_CLASSES: Record<
  FilterChipProps["tone"],
  { active: string; idle: string }
> = {
  neutral: {
    active: "bg-foreground text-background",
    idle: "bg-muted text-muted-foreground hover:bg-muted/70",
  },
  positive: {
    active: "bg-primary text-primary-foreground",
    idle: "bg-primary/10 text-primary hover:bg-primary/15",
  },
  negative: {
    active: "bg-destructive text-destructive-foreground",
    idle: "bg-destructive/10 text-destructive hover:bg-destructive/15",
  },
  warning: {
    active: "bg-amber-500 text-white",
    idle: "bg-amber-100 text-amber-800 hover:bg-amber-200/70",
  },
};

export function FilterChip({ label, count, active, onClick, tone }: FilterChipProps) {
  const classes = TONE_CLASSES[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? classes.active : classes.idle
      }`}
    >
      {label}
      <span className="tabular-nums opacity-80">{count}</span>
    </button>
  );
}
