"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { logoutUser } from "@/api/auth.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

const VERIFICATION_LABEL: Record<string, string> = {
  VERIFIED: "Verified",
  PENDING_EMAIL: "Email not verified",
};

export default function RecruiterSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      window.location.replace("/login");
    },
    onError: () => {
      logout();
      toast.error("Server logout failed. Cleared local session.");
      window.location.replace("/login");
    },
  });

  const verificationLabel = user?.verification_status
    ? VERIFICATION_LABEL[user.verification_status] ?? user.verification_status
    : "-";

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardHeader
        title="Settings"
        description="Manage your account, security, and preferences."
      />

      <SettingsSection
        title="Account"
        description="Your basic account information."
      >
        <div className="space-y-4">
          <SettingsRow label="Full Name" value={user?.name || "-"} />
          <SettingsRow label="Email Address" value={user?.email || "-"} />
          <SettingsRow label="Role" value={user?.role || "-"} />
          <SettingsRow label="Verification" value={verificationLabel} />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security"
        description="Manage your account security settings."
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your account password.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Irreversible account actions."
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-destructive">Logout</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Logout from your current session.
            </p>
          </div>

          <Button
            variant="destructive"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Logout
          </Button>
        </div>
      </SettingsSection>

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </div>
  );
}
