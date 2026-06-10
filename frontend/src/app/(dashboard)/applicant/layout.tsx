"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { VerificationGate } from "@/components/auth/VerificationGate";
import { useIsMounted } from "@/lib/use-is-mounted";
import { useAuthStore } from "@/stores/auth.store";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const mounted = useIsMounted();

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
