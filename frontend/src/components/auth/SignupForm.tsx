"use client";

import { useState } from "react";

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
import { signupUser } from "@/api/auth.api";
import { toast } from "sonner";

export function SignupForm() {
    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

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

        onSuccess: () => {
            toast.success(
                "Account created successfully."
            );
        },

        onError: () => {
            toast.error(
                "Unable to create account"
            )
        }
    })
    function onSubmit(
        values: SignupFormValues
    ) {
        signupMutation.mutate(values)
    }

    return (
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
    );
}