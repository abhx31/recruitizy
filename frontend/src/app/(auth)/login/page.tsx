import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard>
      <div className="space-y-8">
        <AuthHeader
          title="Welcome back"
          description="Continue managing your hiring pipeline."
        />

        <div>
          <LoginForm />
        </div>

        <AuthFooter
          text="Don't have an account?"
          linkText="Sign up"
          href="/signup"
        />
      </div>
    </AuthCard>
  );
}