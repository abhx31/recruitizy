"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    loginSchema,
    LoginFormValues
} from "@/schemas/auth.schema"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { loginUser } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from "next/navigation"
import { VerifyEmailDialog } from "@/components/auth/VerifyEmailDialog"

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState("");
    const router = useRouter();

    const setAuth = useAuthStore(
        (state) => state.setAuth
    )

    // If a logged-in user lands here (e.g. via back button or by typing /login
    // in the URL), bounce them to their dashboard so they don't see the login
    // form for an account they're already in.
    useEffect(() => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        if (user.role === "recruiter") {
            router.replace("/recruiter/dashboard");
        } else if (user.role === "applicant") {
            router.replace("/applicant/dashboard");
        }
    }, [router]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: ""
        },
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,

        onSuccess: (data) => {

            setAuth(
                data.access_token,
                data.user
            );

            toast.success("Signed in successfully.");
        },

        onError: () => {
            form.setError("root", {
                message: "Invalid email or password.",
            })

            toast.error("Invalid email or password.");
        }
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginMutation.mutateAsync(data);
            const user = response.user;

            if (user.verification_status === "PENDING_EMAIL") {
                setVerifyEmail(user.email);
                setVerifyDialogOpen(true);
            } else if (user.role === "recruiter") {
                router.replace("/recruiter/dashboard");
            } else if (user.role === "applicant") {
                router.replace("/applicant/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >

                <FormField
                    control={form.control}
                    name="email"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>

                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-11 rounded-xl

                                        border-white/[0.06]
                                        bg-black/30

                                        transition-all duration-300

                                        focus-visible:border-primary/60
                                        focus-visible:ring-primary/20

                                        placeholder:text-muted-foreground/70"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="h-11 rounded-xl

                                        border-white/[0.06]
                                        bg-black/30

                                        transition-all duration-300

                                        focus-visible:border-primary/60
                                        focus-visible:ring-primary/20

                                        placeholder:text-muted-foreground/70"
                                        {...field}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPassword((prev) => !prev)
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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

                {form.formState.errors.root && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.root.message}
                    </p>
                )}

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

                        disabled:pointer-events-none
                        disabled:opacity-70
                    "
                >
                    {loginMutation.isPending
                        ? "Signing in..."
                        : "Sign in"
                    }
                </Button>

            </form>
        </Form>

        <VerifyEmailDialog
            open={verifyDialogOpen}
            onOpenChange={setVerifyDialogOpen}
            email={verifyEmail}
        />
        </>
    )
}