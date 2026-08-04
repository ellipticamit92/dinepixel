import { Bell, Settings } from "lucide-react";
import { Logo } from "@/components/atoms/logo";
import { NavLinks } from "@/components/molecules/nav-links";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks className="hidden md:flex" />
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
          >
            Help
          </a>
          <Button size="sm">Publish Changes</Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
