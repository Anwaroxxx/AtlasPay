import { Link } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    ArrowUpRight,
    ArrowDownLeft,
    QrCode,
    Sparkles,
    Wallet,
    BrainCircuit,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
    balance: number;
    currency: string;
    accountNumber?: string;
}

export function BalanceCard({
    balance,
    currency,
    accountNumber = 'MA53 ATLS 0009 8821 4477',
}: BalanceCardProps) {
    const [hidden, setHidden] = useState(false);

    const actions = [
        { label: 'Transfer', icon: Wallet, href: '/transfer' },
        {
            label: 'History',
            icon: ArrowDownLeft,
            href: '/reports/transactions',
        },
        { label: 'QR Pay', icon: QrCode, href: '/qr' },
        { label: 'Smart AI', icon: BrainCircuit, href: '/anwar' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shadow-elevated group light-sweep relative overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-8 text-primary-foreground transition-all duration-500 hover:shadow-2xl"
        >
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />
            <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />

            <div className="relative flex items-start justify-between">
                <div className="min-w-0 space-y-1">
                    <p className="text-[10px] font-black tracking-[0.3em] text-primary-foreground/60 uppercase">
                        Account Number
                    </p>
                    <p className="max-w-[160px] truncate font-mono text-sm tracking-widest opacity-90 sm:max-w-full">
                        {accountNumber}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setHidden((h) => !h)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-primary-foreground/90 transition-all hover:bg-white/20"
                    aria-label="Toggle balance visibility"
                >
                    <AnimatePresence mode="wait">
                        {hidden ? (
                            <motion.div key="eye-off" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }}>
                                <EyeOff className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <motion.div key="eye" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }}>
                                <Eye className="h-4 w-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            <div className="relative mt-6 mb-6 md:mt-8 md:mb-8">
                <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-primary-foreground/60 uppercase">
                    Available Balance
                </p>
                <div className="flex items-baseline gap-2 md:gap-3">
                    <motion.span 
                        layout
                        className="font-display text-4xl font-black tracking-tighter md:text-5xl lg:text-7xl"
                    >
                        {hidden ? '••••••' : balance.toLocaleString()}
                    </motion.span>
                    <span className="text-base font-black tracking-widest uppercase opacity-60 md:text-xl">
                        {currency}
                    </span>
                </div>
            </div>

            <div className="relative grid grid-cols-4 gap-2 md:gap-4">
                {actions.map((a) => (
                    <Link key={a.label} href={a.href} className="flex-1">
                        <Button
                            variant="ghost"
                            className="flex h-auto w-full flex-col items-center gap-2 rounded-[1.5rem] border border-white/5 bg-white/10 py-4 text-primary-foreground shadow-inner transition-all hover:scale-[1.05] hover:bg-white/20 active:scale-95 md:gap-3 md:py-6"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 transition-transform group-hover:scale-110 md:h-10 md:w-10">
                                <a.icon className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <span className="text-[9px] font-black tracking-widest uppercase md:text-[10px]">
                                {a.label}
                            </span>
                        </Button>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
