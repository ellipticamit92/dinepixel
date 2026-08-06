export function StatItem({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[30px] text-[oklch(0.26_0.02_60)]">{num}</div>
      <div className="text-[12.5px] font-semibold tracking-[0.3px] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
