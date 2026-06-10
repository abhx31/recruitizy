"use client";

import Link from "next/link";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};


const CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Sales",
  "Marketing",
  "Ops",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
      <BackgroundGlow />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >

        <motion.h1
          variants={item}
          className="mt-8 text-balance text-5xl font-semibold leading-tight tracking-[-0.025em] sm:text-6xl md:text-7xl"
        >
          Hire the right person.
          <br />
          <span className="text-muted-foreground">
            Not the next 200 resumes.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Recruitizy scores every applicant against your role the moment they
          apply — so your shortlist is ready before you open the dashboard.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="group h-12 rounded-xl px-6 text-base"
            asChild
          >
            <Link href="/signup">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-xl px-6 text-base"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted-foreground/70">
            Hiring across
          </span>
          {CATEGORIES.map((category) => (
            <span
              key={category}
              className="rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {category}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}


function BackgroundGlow() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[140px]"
        animate={{
          opacity: [0.55, 0.85, 0.55],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[20%] top-[30%] h-[18rem] w-[18rem] rounded-full bg-emerald-400/8 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[20%] bottom-[25%] h-[16rem] w-[16rem] rounded-full bg-primary/8 blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
