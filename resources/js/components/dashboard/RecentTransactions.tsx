import { Link } from '@inertiajs/react';
import {
    ShoppingBag,
    ArrowDownLeft,
    ArrowUpRight,
    History,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
    id: number;
    type: string;
    method: string;
    amount: number;
    created_at: string;
    status: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    return (
        <div className="shadow-soft hover:shadow-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all">
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <History className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-black tracking-tight uppercase">
                            Transaction{' '}
                            <span className="text-primary italic">
                                History.
                            </span>
                        </h3>
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                            Last few activities
                        </p>
                    </div>
                </div>
                <Link
                    href="/reports/transactions"
                    className="flex h-10 items-center gap-2 rounded-xl bg-primary/10 px-4 text-[10px] font-black tracking-widest text-primary uppercase transition-all hover:bg-primary hover:text-white"
                >
                    View All <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <ul className="relative z-10 space-y-2">
                {transactions.map((t) => {
                    const isDeposit = t.type === 'deposit';
                    const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight;

                    return (
                        <li
                            key={t.id}
                            className="group/item flex items-center gap-5 rounded-2xl p-4 transition-all hover:bg-muted/30"
                        >
                            <div
                                className={cn(
                                    'grid h-12 w-12 place-items-center rounded-2xl transition-transform group-hover/item:scale-110',
                                    isDeposit
                                        ? 'bg-success/10 text-success'
                                        : 'bg-destructive/10 text-destructive',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black tracking-tight text-foreground uppercase">
                                    {t.method.replace('_', ' ')}
                                </p>
                                <p className="text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase">
                                    {new Date(
                                        t.created_at,
                                    ).toLocaleDateString()}{' '}
                                    ·{' '}
                                    {new Date(t.created_at).toLocaleTimeString(
                                        [],
                                        { hour: '2-digit', minute: '2-digit' },
                                    )}
                                </p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={cn(
                                        'text-lg font-black tracking-tighter',
                                        isDeposit
                                            ? 'text-success'
                                            : 'text-foreground',
                                    )}
                                >
                                    {isDeposit ? '+' : '-'}
                                    {t.amount.toLocaleString()}{' '}
                                    <span className="text-[10px] font-normal opacity-60">
                                        MAD
                                    </span>
                                </p>
                                <Badge
                                    variant="outline"
                                    className="border-border/50 bg-muted/20 px-2 py-0 text-[8px] font-black tracking-[0.2em] uppercase"
                                >
                                    {t.status}
                                </Badge>
                            </div>
                        </li>
                    );
                })}
                {transactions.length === 0 && (
                    <li className="py-20 text-center text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase italic">
                        No recent transactions.
                    </li>
                )}
            </ul>

            <Link
                href="/reports/transactions"
                className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl border border-border/50 bg-muted/20 text-[10px] font-black tracking-widest uppercase transition-all hover:border-primary/20 hover:bg-primary/5"
            >
                View Full History
            </Link>
        </div>
    );
}

function Badge({ children, variant, className }: any) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                className,
            )}
        >
            {children}
        </span>
    );
}
