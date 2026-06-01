const STEPS = [
  {
    label: "01",
    title: "Describe the role.",
    body: "Write a job description, list required skills, and set a shortlist threshold. Two minutes, max.",
  },
  {
    label: "02",
    title: "Applicants apply.",
    body: "Candidates upload a resume — we extract their structured profile and run it against your role in seconds.",
  },
  {
    label: "03",
    title: "Score appears instantly.",
    body: "Every application gets a 0–100 score with a breakdown of why. Anyone above your threshold is auto-shortlisted.",
  },
  {
    label: "04",
    title: "You talk to the best ones.",
    body: "Open the dashboard, see the ranked list, and spend your time interviewing — not reading resumes.",
  },
];

export function HowItWorks() {
  return (
    <section id="workflow" className="relative border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16 lg:gap-24">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              From a job posting to a shortlist in under five minutes.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              No onboarding playbook. No sales call. Sign up, paste the JD,
              applications start ranking themselves.
            </p>
          </div>

          <ol className="relative">
            <div
              aria-hidden
              className="absolute bottom-2 left-6 top-2 w-px bg-gradient-to-b from-transparent via-border to-transparent"
            />
            <div className="space-y-10">
              {STEPS.map((step) => (
                <li key={step.label} className="relative flex gap-5">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-sm font-semibold tracking-tight text-primary shadow-sm">
                    {step.label}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </div>
          </ol>
        </div>
      </div>
    </section>
  );
}
