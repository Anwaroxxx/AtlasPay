import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
        >
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
