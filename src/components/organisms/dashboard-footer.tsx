const links = ["Privacy Policy", "Terms of Service", "API Docs"];

export function DashboardFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:px-10">
      <p>© {new Date().getFullYear()} MenuAI Tech. All rights reserved.</p>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="transition-colors hover:text-foreground"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
