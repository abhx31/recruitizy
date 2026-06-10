"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useIsMounted } from "@/lib/use-is-mounted";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  applicantNavigation,
  recruiterNavigation,
} from "@/constants/navigation";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  // Zustand persist hydrates from localStorage on the client only. During SSR
  // and the very first client render, `user` is null even for a logged-in
  // user, which used to make the sidebar guess "applicant" and flash the
  // wrong nav. We delay role-based UI until after hydration completes.
  const mounted = useIsMounted();

  // Only pick a nav when we actually know the role. Don't guess.
  const navigation = !mounted
    ? []
    : user?.role === "recruiter"
    ? recruiterNavigation
    : user?.role === "applicant"
    ? applicantNavigation
    : [];

  async function handleLogout() {
    try {
      await api.post(
        "/auth/logout"
      );
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      console.log("Inside finally block in handleLogout")
      router.replace("/login");
    }
  }

  return (

    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="
            text-xl font-semibold
            tracking-tight
          "
        >
          Recruitizy
        </Link>

      </div>

      <Separator />

      <nav className="flex-1 space-y-2 p-4">

        {navigation.map((item) => {

          const isActive =
            pathname === item.href;

          const Icon =
            item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
              `}
            >

              <Icon className="h-4 w-4" />

              <span>
                {item.title}
              </span>

            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <div
          className="
            flex items-center
            justify-between
            rounded-2xl
            border border-border/50
            bg-muted/30
            p-3
          "
        >

          <div className="flex items-center gap-3">
            {mounted && user ? (
              <>
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    bg-primary
                    text-sm font-semibold
                    text-primary-foreground
                  "
                >
                  {user.name?.charAt(0)}
                </div>
                <p className="text-sm font-medium">{user.name}</p>
              </>
            ) : (
              // Hydration placeholder — avoids briefly showing empty initials
              <>
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              </>
            )}
          </div>

          <AlertDialog>

            <AlertDialogTrigger asChild>

              <Button
                variant="ghost"

                size="icon"

                className="
    rounded-lg

    text-muted-foreground

    hover:text-foreground
  "
              >
                <LogOut className="h-4 w-4" />
              </Button>

            </AlertDialogTrigger>

            <AlertDialogContent>

              <AlertDialogHeader>

                <AlertDialogTitle>
                  Logout from Recruitizy?
                </AlertDialogTitle>

                <AlertDialogDescription>

                  You will need to sign in
                  again to access your
                  dashboard.

                </AlertDialogDescription>

              </AlertDialogHeader>

              <AlertDialogFooter>

                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleLogout}
                >
                  Logout
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>
        </div>
      </div>
    </div>
  );
}