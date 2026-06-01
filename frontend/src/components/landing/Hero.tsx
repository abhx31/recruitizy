"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
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

const ACTIVITY = [
  { name: "Marcus", company: "Linear" },
  { name: "Priya", company: "Vercel" },
  { name: "Sarah", company: "Resend" },
  { name: "Anita", company: "Cal.com" },
  { name: "Jamie", company: "Loops" },
];

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
        <motion.div variants={item}>
          <ActivityTicker />
        </motion.div>

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

function ActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ACTIVITY.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const entry = ACTIVITY[index];

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/40 py-1 pl-2 pr-3.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap"
        >
          <span className="text-foreground/90">{entry.name}</span> was hired at{" "}
          <span className="text-foreground/90">{entry.company}</span>
        </motion.span>
      </AnimatePresence>
      <span className="text-muted-foreground/60">· just now</span>
    </div>
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
