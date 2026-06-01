import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <AuthCard>
            <div className="space-y-8">

                <AuthHeader
                    title="Create your account"
                    description="Start using Recruitizy to streamline hiring and opportunities."
                />

                <SignupForm />

                <AuthFooter
                    text="Already have an account?"
                    linkText="Sign in"
                    href="/login"
                />
            </div>
        </AuthCard>
    )
}