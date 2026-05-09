import { Link } from '@inertiajs/react';
import { Plane, GraduationCap, Home, Target, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const goals = [
    {
        name: 'Voyage Istanbul',
        icon: Plane,
        saved: 6800,
        target: 12000,
        due: 'Aug 2026',
    },
    {
        name: 'Rentrée scolaire',
        icon: GraduationCap,
        saved: 2400,
        target: 4000,
        due: 'Sep 2026',
    },
    {
        name: 'Real Estate Deposit',
        icon: Home,
        saved: 18500,
        target: 80000,
        due: 'Dec 2027',
    },
];

export function AutoCutPreview() {
    return (
        <div className="shadow-soft hover:shadow-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all">
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-black tracking-tight uppercase">
                            Savings{' '}
                            <span className="text-primary italic">Goals.</span>
                        </h3>
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                            Next goal check · May 28
                        </p>
                    </div>
                </div>
                <Link
                    href="/savings"
                    className="flex h-10 items-center gap-2 rounded-xl bg-primary/10 px-4 text-[10px] font-black tracking-widest text-primary uppercase transition-all hover:bg-primary hover:text-white"
                >
                    Explore <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <ul className="relative z-10 space-y-3">
                {goals.map((g) => {
                    const pct = Math.round((g.saved / g.target) * 100);

                    return (
                        <li key={g.name} className="group/item">
                            <div className="flex items-center gap-5">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/30 text-foreground transition-colors group-hover/item:bg-primary/10 group-hover/item:text-primary">
                                    <g.icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-black tracking-tight uppercase">
                                            {g.name}
                                        </p>
                                        <span className="text-[9px] font-black tracking-widest text-muted-foreground/40 uppercase">
                                            {g.due}
                                        </span>
                                    </div>
                                    <div className="mb-2 flex items-center justify-between text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                        <span>
                                            {g.saved.toLocaleString()} /{' '}
                                            {g.target.toLocaleString()}{' '}
                                            <span className="text-[8px] opacity-60">
                                                MAD
                                            </span>
                                        </span>
                                        <span className="text-primary">
                                            {pct}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={pct}
                                        className="h-1.5 bg-muted/30"
                                    />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <Link
                href="/savings"
                className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl border border-border/50 bg-muted/20 text-[10px] font-black tracking-widest uppercase transition-all hover:border-primary/20 hover:bg-primary/5"
            >
                View All Goals
            </Link>
        </div>
    );
}
