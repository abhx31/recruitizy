const COMPANIES = ["Linear", "Vercel", "Cal.com", "Resend", "Loops", "Plain"];

export function TrustStrip() {
  return (
    <section className="relative border-y border-border/40 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
          Hiring teams already on Recruitizy
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {COMPANIES.map((company) => (
            <span
              key={company}
              className="text-lg font-semibold tracking-tight text-muted-foreground/50 transition-colors duration-300 hover:text-foreground/80"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
