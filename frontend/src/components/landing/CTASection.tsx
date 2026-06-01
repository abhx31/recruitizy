import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
          />

          <div className="relative grid gap-10 px-8 py-14 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:px-12 md:py-16 lg:gap-16 lg:px-16 lg:py-20">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Hire the next person.
                <br />
                Not the next 200 resumes.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Free to start. No credit card. No demo call. Sign up and post
                your first role in two minutes.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="h-12 rounded-xl px-6 text-base"
                asChild
              >
                <Link href="/signup">
                  Start hiring
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 rounded-xl px-6 text-base"
                asChild
              >
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
