import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { AuthPanel, type AuthMode } from "@/components/organisms/auth-panel";
import { getSession } from "@/lib/auth";

export async function AuthPage({
  mode,
  next,
  error,
}: {
  mode: AuthMode;
  next?: string;
  error?: string;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />
      <AuthPanel mode={mode} next={next} error={error} />
    </div>
  );
}
