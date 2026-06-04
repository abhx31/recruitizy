"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";

import {
    signupSchema,
    SignupFormValues,
} from "@/schemas/auth.schema";

import { RoleSelector } from "./RoleSelector";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signupUser } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { VerifyEmailDialog } from "@/components/auth/VerifyEmailDialog";

export function SignupForm() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    // If a logged-in user lands here (back button, typed URL, etc.), send
    // them straight to their dashboard instead of showing the signup form.
    useEffect(() => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        if (user.role === "recruiter") {
            router.replace("/recruiter/dashboard");
        } else if (user.role === "applicant") {
            router.replace("/applicant/dashboard");
        }
    }, [router]);

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState("");

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),

        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "applicant",
            company_name: "",
        },
    });

    const selectedRole =
        form.watch("role");

    const signupMutation = useMutation({
        mutationFn: signupUser,

        onSuccess: (data) => {
            setAuth(data.access_token, data.user);
            toast.success("Account created successfully.");

            if (
                data.user.role === "recruiter" &&
                data.user.verification_status === "PENDING_EMAIL"
            ) {
                setVerifyEmail(data.user.email);
                setVerifyDialogOpen(true);
            } else if (data.user.role === "recruiter") {
                router.replace("/recruiter/dashboard");
            } else {
                router.replace("/applicant/dashboard");
            }
        },

        onError: (error: unknown) => {
            const detail =
                error instanceof AxiosError
                    ? (error.response?.data as { detail?: string } | undefined)?.detail
                    : null;
            toast.error(detail ?? "Unable to create account.");
        },
    });

    function onSubmit(
        values: SignupFormValues
    ) {
        signupMutation.mutate(values)
    }

    return (
        <>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-7"
            >

                {/* Role Selector */}

                <FormField
                    control={form.control}
                    name="role"

                    render={({ field }) => (
                        <FormItem className="space-y-4">

                            <FormLabel className="text-sm font-medium">
                                How would you like to use Recruitizy?
                            </FormLabel>

                            <FormControl>

                                <RoleSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>
                    )}
                />

                {/* Personal Info */}

                <div className="space-y-6">

                    <FormField
                        control={form.control}
                        name="name"

                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Full Name
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder="Enter your full name"

                                        className="
                      h-11 rounded-xl
                      border-border/70
                      bg-background/50
                      transition-all

                      focus-visible:border-primary
                      focus-visible:ring-primary/20
                    "

                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"

                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Email
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        type="email"
                                        placeholder="Enter your email"

                                        className="
                      h-11 rounded-xl
                      border-border/70
                      bg-background/50
                      transition-all

                      focus-visible:border-primary
                      focus-visible:ring-primary/20
                    "

                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                    {selectedRole ===
                        "recruiter" && (

                            <FormField
                                control={form.control}
                                name="company_name"

                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>
                                            Company Name
                                        </FormLabel>

                                        <FormControl>

                                            <Input
                                                placeholder="Enter your company name"

                                                className="
                        h-11 rounded-xl
                        border-border/70
                        bg-background/50
                        transition-all

                        focus-visible:border-primary
                        focus-visible:ring-primary/20
                      "

                                                {...field}
                                            />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>
                                )}
                            />

                        )}

                </div>

                {/* Password Section */}

                <div className="space-y-6">

                    <FormField
                        control={form.control}
                        name="password"

                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Password
                                </FormLabel>

                                <FormControl>

                                    <div className="relative">

                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }

                                            placeholder="Enter your password"

                                            className="
                        h-11 rounded-xl pr-10
                        border-border/70
                        bg-background/50
                        transition-all

                        focus-visible:border-primary
                        focus-visible:ring-primary/20
                      "

                                            {...field}
                                        />

                                        <button
                                            type="button"

                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }

                                            className="
                        absolute right-3 top-1/2
                        -translate-y-1/2

                        text-muted-foreground
                        transition-colors

                        hover:text-foreground
                      "
                                        >

                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}

                                        </button>

                                    </div>

                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"

                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Confirm Password
                                </FormLabel>

                                <FormControl>

                                    <div className="relative">

                                        <Input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }

                                            placeholder="Confirm your password"

                                            className="
                        h-11 rounded-xl pr-10
                        border-border/70
                        bg-background/50
                        transition-all

                        focus-visible:border-primary
                        focus-visible:ring-primary/20
                      "

                                            {...field}
                                        />

                                        <button
                                            type="button"

                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (prev) => !prev
                                                )
                                            }

                                            className="
                        absolute right-3 top-1/2
                        -translate-y-1/2

                        text-muted-foreground
                        transition-colors

                        hover:text-foreground
                      "
                                        >

                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}

                                        </button>

                                    </div>

                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </div>

                {/* Submit */}

                <Button
                    type="submit"

                    className="
            h-11 w-full rounded-xl

            bg-primary
            font-medium
            text-primary-foreground

            shadow-lg shadow-primary/20

            transition-all duration-300

            hover:scale-[1.01]
            hover:shadow-primary/30
          "
                >
                    {signupMutation.isPending
                        ? "Creating account..."
                        : "Create account"}
                </Button>

            </form>
        </Form>

        <VerifyEmailDialog
            open={verifyDialogOpen}
            onOpenChange={setVerifyDialogOpen}
            email={verifyEmail}
        />
        </>
    );
}