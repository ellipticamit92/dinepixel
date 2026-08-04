import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", active: true },
  { label: "Menu Editor", active: false },
  { label: "QR Codes", active: false },
  { label: "Analytics", active: false },
];

export function NavLinks({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full border bg-card p-1 text-sm",
        className,
      )}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href="#"
          className={cn(
            "rounded-full px-3.5 py-1.5 font-medium transition-colors",
            link.active
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
