import { Coffee, ShoppingBag, Zap, ArrowDownLeft, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const tx = [
    {
        name: 'Café Atlas',
        cat: 'Café',
        icon: Coffee,
        amount: -42,
        time: 'Today · 09:14',
    },
    {
        name: 'Marjane Rabat',
        cat: 'Shopping',
        icon: ShoppingBag,
        amount: -348,
        time: 'Today · 08:02',
    },
    {
        name: 'Salaire — TechCorp',
        cat: 'Income',
        icon: ArrowDownLeft,
        amount: 12500,
        time: 'Yesterday',
    },
    { name: 'Lydec', cat: 'Bills', icon: Zap, amount: -284, time: 'May 03' },
    {
        name: 'InDrive',
        cat: 'Transport',
        icon: Car,
        amount: -55,
        time: 'May 02',
    },
];

export function RecentTransactions() {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">
                    Recent activity
                </h3>
                <button className="text-xs font-medium text-primary hover:underline">
                    View all
                </button>
            </div>
            <ul className="mt-4 divide-y divide-border">
                {tx.map((t) => (
                    <li key={t.name} className="flex items-center gap-3 py-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                            <t.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {t.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t.cat} · {t.time}
                            </p>
                        </div>
                        <span
                            className={cn(
                                'text-sm font-semibold',
                                t.amount > 0
                                    ? 'text-success'
                                    : 'text-foreground',
                            )}
                        >
                            {t.amount > 0 ? '+' : ''}
                            {t.amount.toLocaleString()} MAD
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
