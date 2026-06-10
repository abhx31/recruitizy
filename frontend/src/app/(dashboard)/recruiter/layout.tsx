"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { VerificationGate } from "@/components/auth/VerificationGate";
import { useIsMounted } from "@/lib/use-is-mounted";
import { useAuthStore } from "@/stores/auth.store";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Zustand `persist` hydrates from localStorage on the client only. During
  // SSR and the very first client render `user` is null even for a logged-in
  // user. Without this gate, the layout would redirect to /login on every
  // refresh, flash the login page briefly, then bounce back to the dashboard.
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;

    if (user === null) {
      router.replace("/login");
      return;
    }
    if (user.role !== "recruiter") {
      router.replace("/applicant/dashboard");
    }
  }, [mounted, user, router]);

  // Pre-hydration — render nothing rather than risking the wrong content.
  if (!mounted) {
    return null;
  }

  // Post-hydration — wrong user or no user, render nothing while the redirect
  // above fires.
  if (user === null || user.role !== "recruiter") {
    return null;
  }

  if (user.verification_status !== "VERIFIED") {
    return <VerificationGate />;
  }

  return <>{children}</>;
}
