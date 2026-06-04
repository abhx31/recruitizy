"use client";

import { useState, type ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { changePassword } from "@/api/auth.api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: ChangePasswordFormValues = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type">;

function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="pr-9"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((value) => !value)}
        disabled={props.disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const logout = useAuthStore((state) => state.logout);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated. Please sign in again.");
      setIsRedirecting(true);
      logout();
      onOpenChange(false);
      window.location.replace("/login");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { detail?: string } | undefined)?.detail
          : null;

      toast.error(message ?? "Unable to update password.");
    },
  });

  function handleOpenChange(next: boolean) {
    if (mutation.isPending || isRedirecting) {
      return;
    }

    if (!next) {
      form.reset(defaultValues);
    }

    onOpenChange(next);
  }

  function onSubmit(values: ChangePasswordFormValues) {
    mutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
    });
  }

  const busy = mutation.isPending || isRedirecting;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="data-[size=default]:sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Change password</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your current password and choose a new one. You will be signed
            out on all devices after updating.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <PasswordField
                      autoComplete="current-password"
                      disabled={busy}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordField
                      autoComplete="new-password"
                      disabled={busy}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordField
                      autoComplete="new-password"
                      disabled={busy}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
