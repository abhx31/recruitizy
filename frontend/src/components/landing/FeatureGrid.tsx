import {
  BarChart3,
  Brain,
  FileSearch,
  GitBranch,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: "AI match scoring",
    description:
      "Every applicant gets ranked against your role with a transparent 0–100 score and a breakdown of why.",
  },
  {
    icon: FileSearch,
    title: "Resume intelligence",
    description:
      "Auto-extract skills, experience, and education from PDFs — no more reading 200 resumes by hand.",
  },
  {
    icon: Zap,
    title: "Automated screening",
    description:
      "Background workers evaluate applications the moment they land, so your shortlist is ready when you are.",
  },
  {
    icon: GitBranch,
    title: "Hiring pipelines",
    description:
      "Track every candidate from applied → shortlisted → hired in a workspace built for hiring teams.",
  },
  {
    icon: ShieldCheck,
    title: "Bias-aware evaluation",
    description:
      "Scoring focuses on skills and experience first. Candidates are surfaced on merit, not on resume polish.",
  },
  {
    icon: BarChart3,
    title: "Hiring analytics",
    description:
      "Quantify what's working — funnel conversion, time-to-shortlist, top sources — in one clean view.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Platform
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Everything you need to hire with confidence.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A focused set of tools — built around AI scoring — that replace the
            spreadsheets, email threads, and PDF folders.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <div className="group relative rounded-2xl border border-border/60 bg-card/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}
