import { createFileRoute } from '@tanstack/react-router';
import { Users, Plus, Check, Clock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const Route = createFileRoute('/daret')({
    component: DaretPage,
    head: () => ({ meta: [{ title: 'Daret — AtlasPay' }] }),
});

const groups = [
    {
        name: 'Daret Familia',
        amount: 2000,
        cycle: 8,
        round: 4,
        next: 'Yassine',
        members: [
            { n: 'Youssef', paid: true, you: true },
            { n: 'Yassine', paid: true, turn: true },
            { n: 'Salma', paid: true },
            { n: 'Mehdi', paid: false },
            { n: 'Imane', paid: true },
            { n: 'Karim', paid: false },
            { n: 'Nadia', paid: true },
            { n: 'Omar', paid: true },
        ],
    },
    {
        name: 'Daret du bureau',
        amount: 1000,
        cycle: 6,
        round: 2,
        next: 'Salma',
        members: [
            { n: 'Youssef', paid: true, you: true },
            { n: 'Salma', paid: true, turn: true },
            { n: 'Hamza', paid: true },
            { n: 'Lina', paid: true },
            { n: 'Anas', paid: false },
            { n: 'Sara', paid: true },
        ],
    },
];

function DaretPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        9or3a
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                        Daret groups
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Rotating savings circles, automated each month.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Create daret
                </Button>
            </header>

            <div className="mt-6 space-y-6">
                {groups.map((g) => {
                    const paid = g.members.filter((m) => m.paid).length;
                    const pct = Math.round((paid / g.members.length) * 100);

                    return (
                        <div
                            key={g.name}
                            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-mint)] text-deep">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-semibold">
                                            {g.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {g.amount.toLocaleString()}{' '}
                                            MAD/month · Round {g.round} of{' '}
                                            {g.cycle}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        This round goes to
                                    </p>
                                    <p className="inline-flex items-center gap-1 font-display text-base font-semibold">
                                        <Crown className="h-4 w-4 text-warning" />{' '}
                                        {g.next}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        {paid}/{g.members.length} members paid
                                        this round
                                    </span>
                                    <span>{pct}%</span>
                                </div>
                                <Progress value={pct} className="mt-2 h-2" />
                            </div>

                            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                {g.members.map((m) => (
                                    <li
                                        key={m.n}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                                            m.turn
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border bg-secondary/50'
                                        }`}
                                    >
                                        <div className="grid h-7 w-7 place-items-center rounded-full bg-card text-[11px] font-semibold">
                                            {m.n[0]}
                                        </div>
                                        <span className="flex-1 truncate">
                                            {m.n}{' '}
                                            {m.you && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    (you)
                                                </span>
                                            )}
                                        </span>
                                        {m.paid ? (
                                            <Check className="h-3.5 w-3.5 text-success" />
                                        ) : (
                                            <Clock className="h-3.5 w-3.5 text-warning" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
