"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { VerificationGate } from "@/components/auth/VerificationGate";
import { useAuthStore } from "@/stores/auth.store";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Same SSR/persist hydration trap as the recruiter layout — see the note
  // there for the full explanation. Without `mounted`, a hard refresh on any
  // applicant route briefly flashes /login before bouncing back.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user === null) {
      router.replace("/login");
      return;
    }
    if (user.role !== "applicant") {
      router.replace("/recruiter/dashboard");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return null;
  }

  if (user === null || user.role !== "applicant") {
    return null;
  }

  if (user.verification_status !== "VERIFIED") {
    return <VerificationGate />;
  }

  return <>{children}</>;
}
