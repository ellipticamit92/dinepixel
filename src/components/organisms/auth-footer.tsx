import { Logo } from "@/components/atoms/logo";

const links = ["Privacy Policy", "Terms of Service", "Contact Support"];

export function AuthFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <Logo />
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MenuAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
