import {
    Eye,
    EyeOff,
    ArrowUpRight,
    ArrowDownLeft,
    QrCode,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function BalanceCard() {
    const [hidden, setHidden] = useState(false);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)]">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs tracking-[0.2em] text-primary-foreground/70 uppercase">
                        Main account
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                        MA53 ATLS 0009 8821 4477
                    </p>
                </div>
                <button
                    onClick={() => setHidden((h) => !h)}
                    className="rounded-full bg-white/10 p-2 text-primary-foreground/90 hover:bg-white/20"
                    aria-label="Toggle balance visibility"
                >
                    {hidden ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            <div className="relative mt-8">
                <p className="text-xs text-primary-foreground/70">
                    Available balance
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                        {hidden ? '•••••' : '47,820'}
                    </span>
                    <span className="text-base font-medium text-primary-foreground/80">
                        .45 MAD
                    </span>
                </div>
            </div>

            <div className="relative mt-6 grid grid-cols-4 gap-2">
                {[
                    { label: 'Send', icon: ArrowUpRight },
                    { label: 'Receive', icon: ArrowDownLeft },
                    { label: 'QR Pay', icon: QrCode },
                    { label: 'AI Twin', icon: Sparkles },
                ].map((a) => (
                    <Button
                        key={a.label}
                        variant="ghost"
                        className="flex h-auto flex-col items-center gap-1.5 rounded-2xl bg-white/10 py-3 text-primary-foreground hover:bg-white/20"
                    >
                        <a.icon className="h-4 w-4" />
                        <span className="text-[11px] font-medium">
                            {a.label}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
