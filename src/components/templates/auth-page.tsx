import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { AuthPanel, type AuthMode } from "@/components/organisms/auth-panel";

export function AuthPage({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar />
      <AuthPanel mode={mode} />
    </div>
  );
}
