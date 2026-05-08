import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <div className="flex items-center justify-between gap-1">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground md:h-10 md:w-10">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span
                    className={cn(
                        'inline-flex max-w-[80px] items-center gap-1 truncate rounded-full px-1.5 py-1 text-[9px] font-black tracking-widest uppercase md:px-2.5 md:text-[11px]',
                        positive
                            ? 'bg-success/15 text-success'
                            : 'bg-destructive/15 text-destructive',
                    )}
                >
                    {positive ? (
                        <TrendingUp className="h-3 w-3 shrink-0" />
                    ) : (
                        <TrendingDown className="h-3 w-3 shrink-0" />
                    )}
                    {delta}
                </span>
            </div>
            <p className="mt-3 truncate text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase transition-colors group-hover:text-foreground/60 md:mt-4 md:text-[10px]">
                {label}
            </p>
            <p className="mt-1 font-display text-2xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary md:text-3xl">
                {value}
            </p>
        </>
    );

    const className = cn(
        'group shadow-soft hover:shadow-elevated relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30',
        href && 'cursor-pointer',
    );

    if (href) {
        return (
            <Link href={href} className={className}>
                <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]" />
                {content}
            </Link>
        );
    }

    return (
        <div className={className}>
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />
            {content}
        </div>
    );
}
