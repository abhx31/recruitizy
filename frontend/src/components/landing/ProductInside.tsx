import { ArrowUpRight } from "lucide-react";

interface Surface {
  eyebrow: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  reverse?: boolean;
}

const SURFACES: Surface[] = [
  {
    eyebrow: "Pipeline",
    title: "Every applicant, automatically ranked.",
    description:
      "AI scores each application against the job description the second it lands. Sort, filter, and shortlist without ever opening a PDF.",
    visual: <PipelineVisual />,
  },
  {
    eyebrow: "Resume Intelligence",
    title: "PDFs in. Structured profiles out.",
    description:
      "Skills, employers, years of experience, education — all extracted automatically. Candidates upload once and we keep their profile in sync.",
    visual: <ResumeVisual />,
    reverse: true,
  },
  {
    eyebrow: "Analytics",
    title: "Know exactly where your funnel leaks.",
    description:
      "Time-to-shortlist, applicant quality by source, pipeline conversion. The numbers that actually tell you how hiring is going.",
    visual: <AnalyticsVisual />,
  },
];

export function ProductInside() {
  return (
    <section id="features" className="relative border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Inside the product
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Built around the moments that actually matter when you hire.
          </h2>
        </div>

        <div className="mt-20 space-y-24 md:space-y-32">
          {SURFACES.map((surface) => (
            <SurfaceRow key={surface.title} surface={surface} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SurfaceRow({ surface }: { surface: Surface }) {
  return (
    <div
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
        surface.reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {surface.eyebrow}
        </p>
        <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {surface.title}
        </h3>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          {surface.description}
        </p>
      </div>
      <div>{surface.visual}</div>
    </div>
  );
}

function PipelineVisual() {
  const stages = [
    { label: "Applied", value: 128 },
    { label: "Auto-shortlisted", value: 42, highlight: true },
    { label: "In review", value: 18 },
    { label: "Interviewing", value: 9 },
    { label: "Offer", value: 3 },
  ];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl"
      />
      <div className="relative rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium">Hiring pipeline</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
        <div className="mt-6 space-y-3.5">
          {stages.map((stage) => (
            <div key={stage.label}>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={
                    stage.highlight
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {stage.label}
                </span>
                <span className="font-medium tabular-nums">{stage.value}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    stage.highlight
                      ? "bg-gradient-to-r from-primary to-emerald-400"
                      : "bg-muted-foreground/40"
                  }`}
                  style={{ width: `${(stage.value / 128) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
          <span className="text-muted-foreground">Avg time to shortlist</span>
          <span className="font-medium text-foreground">3 min 12 sec</span>
        </div>
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl"
      />
      <div className="relative rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl backdrop-blur-xl">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Extracted profile
        </p>
        <p className="mt-2 text-lg font-semibold tracking-tight">
          Marcus Patel
        </p>
        <p className="text-xs text-muted-foreground">
          Senior Engineer · 7 years
        </p>

        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Skills
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "TypeScript",
              "React",
              "Next.js",
              "GraphQL",
              "AWS",
              "Postgres",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] text-foreground/85"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
          <ExperienceRow
            company="Linear"
            role="Senior Engineer"
            dates="2022 — Now"
          />
          <ExperienceRow
            company="Vercel"
            role="Frontend Engineer"
            dates="2019 — 2022"
          />
          <ExperienceRow
            company="Stripe"
            role="Software Engineer"
            dates="2017 — 2019"
          />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[11px]">
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground">
            Parsed
          </span>
          <span className="text-muted-foreground">
            from <span className="text-foreground/80">resume.pdf</span> in 1.2s
          </span>
        </div>
      </div>
    </div>
  );
}

function ExperienceRow({
  company,
  role,
  dates,
}: {
  company: string;
  role: string;
  dates: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{company}</p>
        <p className="truncate text-muted-foreground">{role}</p>
      </div>
      <p className="shrink-0 text-muted-foreground">{dates}</p>
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [42, 64, 58, 81, 73, 92, 88];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl"
      />
      <div className="relative rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium">Applications this week</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">498</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              <ArrowUpRight className="h-3 w-3" />
              +24% vs last week
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 px-2 py-1 text-[11px] text-muted-foreground">
            Last 7 days
          </div>
        </div>

        <div className="mt-6 flex h-32 items-end gap-2">
          {bars.map((value, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-end gap-1.5"
            >
              <div
                className={`w-full rounded-md ${
                  i === bars.length - 1
                    ? "bg-gradient-to-t from-primary to-emerald-400"
                    : "bg-muted-foreground/30"
                }`}
                style={{ height: `${value}%` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {days[i]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-stretch divide-x divide-border/60 border-t border-border/60 pt-4">
          <Metric label="Shortlist rate" value="32%" />
          <Metric label="Avg score" value="74" />
          <Metric label="Time to hire" value="9d" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 px-3 first:pl-0 last:pr-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
