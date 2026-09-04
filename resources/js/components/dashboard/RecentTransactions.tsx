import { Link } from '@inertiajs/react';
import {
    ShoppingBag,
    ArrowDownLeft,
    ArrowUpRight,
    History,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transaction {
    id: number;
    type: string;
    method: string;
    amount: number;
    created_at: string;
    status: string;
    is_income: boolean;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const ITEMS_PER_PAGE = 5;

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

    const currentTransactions = transactions.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="shadow-soft hover:shadow-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all min-h-[580px] flex flex-col">
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
                            Page {currentPage + 1} of {Math.max(1, totalPages)}
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

            <div className="relative z-10 flex-1 overflow-hidden">
                <ul className="space-y-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="space-y-2"
                        >
                            {currentTransactions.map((t, index) => {
                                const isIncome = t.is_income;
                                const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

                                return (
                                    <motion.li
                                        layout
                                        key={t.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group/item flex items-center gap-5 rounded-2xl p-4 transition-all hover:bg-muted/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                'grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-lg',
                                                isIncome
                                                    ? 'bg-success/10 text-success group-hover/item:bg-success group-hover/item:text-white'
                                                    : 'bg-destructive/10 text-destructive group-hover/item:bg-destructive group-hover/item:text-white',
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
                                                    isIncome
                                                        ? 'text-success'
                                                        : 'text-foreground',
                                                )}
                                            >
                                                {isIncome ? '+' : '-'}
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
                                    </motion.li>
                                );
                            })}
                            {transactions.length === 0 && (
                                <li className="py-20 text-center text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase italic">
                                    No recent transactions.
                                </li>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </ul>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="relative z-10 mt-4 flex items-center justify-between gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === 0}
                        onClick={prevPage}
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-muted/20 transition-all",
                            currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary/10 hover:border-primary/20 text-primary"
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                    
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentPage === i ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === totalPages - 1}
                        onClick={nextPage}
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-muted/20 transition-all",
                            currentPage === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary/10 hover:border-primary/20 text-primary"
                        )}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </motion.button>
                </div>
            )}

            <Link
                href="/reports/transactions"
                className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl border border-border/50 bg-muted/20 text-[10px] font-black tracking-widest uppercase transition-all hover:border-primary/20 hover:bg-primary/5"
            >
                View Full History
            </Link>
        </div>
    );
}

function Badge({ children, className }: any) {
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
