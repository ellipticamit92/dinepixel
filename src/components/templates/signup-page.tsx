import { AuthHeader } from "@/components/organisms/auth-header";
import { AuthFooter } from "@/components/organisms/auth-footer";
import { SignupCard } from "@/components/organisms/signup-card";

export function SignupPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-background via-background to-secondary/40">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <SignupCard />
      </main>
      <AuthFooter />
    </div>
  );
}
