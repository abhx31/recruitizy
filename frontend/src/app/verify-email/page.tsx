"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { getMe, verifyEmail } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const ranRef = useRef(false);

  const mutation = useMutation({
    mutationFn: async (t: string) => {
      await verifyEmail(t);
      // Refresh the user so verification_status flips locally.
      if (useAuthStore.getState().accessToken) {
        const me = await getMe();
        setUser(me);
      }
    },
  });

  useEffect(() => {
    if (!token || ranRef.current) return;
    ranRef.current = true;
    mutation.mutate(token);
  }, [token, mutation]);

  if (!token) {
    return (
      <Centered>
        <Icon variant="error" />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Missing verification token
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This link doesn't include a verification token. Please use the link
          from your email.
        </p>
        <Actions>
          <Button variant="outline" className="h-11 rounded-xl" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </Actions>
      </Centered>
    );
  }

  if (mutation.isPending || mutation.isIdle) {
    return (
      <Centered>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-8 text-sm text-muted-foreground">
          Verifying your email...
        </p>
      </Centered>
    );
  }

  if (mutation.isError) {
    const detail =
      mutation.error instanceof AxiosError
        ? (mutation.error.response?.data as { detail?: string } | undefined)
            ?.detail
        : null;

    return (
      <Centered>
        <Icon variant="error" />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Verification failed
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {detail ??
            "We couldn't verify your email. The link may have expired."}
        </p>
        <Actions>
          <Button className="h-11 rounded-xl" asChild>
            <Link href="/login">Sign in to request a new link</Link>
          </Button>
        </Actions>
      </Centered>
    );
  }

  return (
    <Centered>
      <Icon variant="success" />
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">
        Email verified
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your recruiter account is now active.
      </p>
      <Actions>
        {user ? (
          <Button
            className="h-11 rounded-xl"
            onClick={() => router.replace("/recruiter/dashboard")}
          >
            Go to dashboard
          </Button>
        ) : (
          <Button className="h-11 rounded-xl" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </Actions>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12 text-center">
      {children}
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 flex w-full flex-col gap-3">{children}</div>;
}

function Icon({ variant }: { variant: "success" | "error" }) {
  if (variant === "success") {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CheckCircle2 className="h-6 w-6" />
      </div>
    );
  }
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
      <XCircle className="h-6 w-6" />
    </div>
  );
}
