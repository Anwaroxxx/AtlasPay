import { Link } from '@inertiajs/react';
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
  href,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  positive?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-widest",
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
        >
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground/60 transition-colors">{label}</p>
      <p className="mt-1 font-display text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{value}</p>
    </>
  );

  const className = cn(
    "group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-soft hover:shadow-elevated hover:border-primary/30 transition-all duration-300 relative overflow-hidden",
    href && "cursor-pointer"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        <div className="absolute inset-0 moroccan-pattern opacity-[0.02] group-hover:opacity-[0.05] pointer-events-none transition-opacity" />
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      <div className="absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none" />
      {content}
    </div>
  );
}

