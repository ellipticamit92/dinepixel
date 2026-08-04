import { cn } from "@/lib/utils";

const rows = [
  { title: "w-2/3", desc: "w-full" },
  { title: "w-1/2", desc: "w-5/6" },
  { title: "w-3/5", desc: "w-full" },
  { title: "w-2/5", desc: null },
];

export function MenuPreviewMock() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 h-3 w-1/3 rounded-full bg-muted" />
      {rows.map((row, i) => (
        <div
          key={i}
          className="mb-4 flex items-center justify-between gap-4 last:mb-0"
        >
          <div className="flex-1 space-y-2">
            <div className={cn("h-2.5 rounded-full bg-foreground/15", row.title)} />
            {row.desc ? (
              <div className={cn("h-2 rounded-full bg-muted-foreground/20", row.desc)} />
            ) : null}
          </div>
          <div className="h-5 w-10 shrink-0 rounded-md bg-secondary" />
        </div>
      ))}
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-primary via-tertiary to-primary" />
    </div>
  );
}
