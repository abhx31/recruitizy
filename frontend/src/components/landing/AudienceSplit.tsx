import Link from "next/link";

import { ArrowRight, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AudienceSplit() {
  return (
    <section className="relative border-t border-border/40 bg-muted/15">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Both sides of the table
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            One platform. Two workflows. Both fast.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <RecruiterCard />
          <ApplicantCard />
        </div>
      </div>
    </section>
  );
}

function RecruiterCard() {
  return (
    <div
      id="recruiters"
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-8 md:p-9"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-primary">
        For recruiters
      </p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Post the role.
        <br />
        We&apos;ll bring the shortlist.
      </h3>

      <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
        <Bullet>Score every applicant against the job, automatically</Bullet>
        <Bullet>Skill-aware ranking, not keyword matching</Bullet>
        <Bullet>Auto-emails to applicants on status change</Bullet>
        <Bullet>Hiring analytics built into every role</Bullet>
      </ul>

      <div className="mt-8">
        <Button asChild className="h-11 rounded-xl px-5">
          <Link href="/signup">
            Start hiring
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 rounded-xl border border-border/60 bg-background/50 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Top match for Backend Engineer</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            Shortlisted
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 text-xs font-semibold">
            AT
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Anita Toren</p>
            <p className="text-xs text-muted-foreground">
              6y · Python · FastAPI · Postgres
            </p>
          </div>
          <p className="text-base font-semibold tabular-nums tracking-tight">
            91
          </p>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[91%] bg-gradient-to-r from-primary to-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function ApplicantCard() {
  return (
    <div
      id="applicants"
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-8 md:p-9"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-primary">
        For applicants
      </p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Upload once.
        <br />
        Get matched everywhere.
      </h3>

      <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
        <Bullet>Resume parsed into a structured profile in seconds</Bullet>
        <Bullet>See only roles that actually match your skills</Bullet>
        <Bullet>Know where you stand — no application black holes</Bullet>
        <Bullet>One profile, every employer on the platform</Bullet>
      </ul>

      <div className="mt-8">
        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
          <Link href="/signup">
            Find your next role
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 space-y-2">
        <p className="text-xs text-muted-foreground">Matches for you</p>
        <JobMatch
          title="Senior Frontend Engineer"
          company="Linear"
          location="Remote"
          match={94}
        />
        <JobMatch
          title="Full Stack Engineer"
          company="Resend"
          location="Bangalore"
          match={88}
        />
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

function JobMatch({
  title,
  company,
  location,
  match,
}: {
  title: string;
  company: string;
  location: string;
  match: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{company}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums tracking-tight text-primary">
          {match}%
        </p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          match
        </p>
      </div>
    </div>
  );
}
