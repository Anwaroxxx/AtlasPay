import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
        >
            <div className="flex items-center justify-between gap-1">
                <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 md:h-10 md:w-10"
                >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </motion.div>
                <span
                    className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-black tracking-widest uppercase md:px-2.5 md:text-[11px] shadow-sm',
                        positive
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20',
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
        </motion.div>
    );

    const className = cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-elevated',
        href && 'cursor-pointer',
    );

    const shimmer = (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    );

    if (href) {
        return (
            <Link href={href} className={className}>
                <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]" />
                {shimmer}
                {content}
            </Link>
        );
    }

    return (
        <div className={className}>
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />
            {shimmer}
            {content}
        </div>
    );
}
