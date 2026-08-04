export function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
