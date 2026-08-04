import { LoginCard } from "@/components/organisms/login-card";
import { AuthFooter } from "@/components/organisms/auth-footer";

export function LoginPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-background via-background to-secondary/40">
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <LoginCard />
      </main>
      <AuthFooter />
    </div>
  );
}
