import { Logo } from "@/components/atoms/logo";

export function AuthHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <a
          href="#"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Help
        </a>
      </div>
    </header>
  );
}
