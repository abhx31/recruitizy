import { z } from "zod"

export const strongPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

export const signupSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be atleast 2 characters."),
        email: z.email("Please enter a valid email address."),
        password: strongPasswordSchema,
        confirmPassword: z.string(),
        role: z.enum(["applicant", "recruiter"]),
        company_name: z.string().optional(),
    })

    .superRefine((data, ctx) => {

        // Password match validation
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match.",
            });
        }

        // Recruiter company validation
        if (data.role === "recruiter" && !data.company_name) {
            ctx.addIssue({
                code: "custom",
                path: ["company_name"],
                message: "Company name is required.",
            });
        }
    });

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required")
})

export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required."),
        new_password: strongPasswordSchema,
        confirm_password: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.new_password !== data.confirm_password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirm_password"],
                message: "Passwords do not match.",
            });
        }

        if (data.current_password === data.new_password) {
            ctx.addIssue({
                code: "custom",
                path: ["new_password"],
                message: "New password must be different from current password.",
            });
        }
    });

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;