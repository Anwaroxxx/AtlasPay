import { createFileRoute } from '@tanstack/react-router';
import {
    QrCode,
    Camera,
    Send,
    Store,
    Clock,
    Shield,
    Copy,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/qr')({
    component: QrPage,
    head: () => ({ meta: [{ title: 'QR Pay — AtlasPay' }] }),
});

const tabs = [
    { id: 'send', label: 'Send', icon: Send },
    { id: 'request', label: 'Request', icon: QrCode },
    { id: 'merchant', label: 'Merchant', icon: Store },
    { id: 'scan', label: 'Scan', icon: Camera },
] as const;

function QrPage() {
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('send');
    const [amount, setAmount] = useState('250');
    const [copied, setCopied] = useState(false);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-6">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    Instant transfer
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                    QR Payments
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Send, receive, scan or display a merchant code — secured by
                    one-time tokens.
                </p>
            </header>

            <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                            'flex min-w-[110px] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                            tab === t.id
                                ? 'bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-7 lg:col-span-3">
                    {tab === 'scan' ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="relative grid aspect-square w-full max-w-sm place-items-center overflow-hidden rounded-3xl bg-[image:var(--gradient-mint)]">
                                <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-primary/40" />
                                <Camera className="h-12 w-12 text-primary" />
                                <div className="absolute inset-x-6 top-1/2 h-0.5 bg-primary/70 shadow-[0_0_20px] shadow-primary/60" />
                            </div>
                            <p className="mt-5 text-sm text-muted-foreground">
                                Point your camera at any AtlasPay QR code.
                            </p>
                            <Button className="mt-4">Open camera</Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                Token expires in 04:32
                            </div>
                            <div className="mt-4">
                                <label className="text-xs tracking-wider text-muted-foreground uppercase">
                                    Amount
                                </label>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <Input
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value.replace(
                                                    /[^\d]/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        className="h-auto border-0 bg-transparent p-0 font-display text-5xl font-semibold tracking-tight focus-visible:ring-0 md:text-6xl"
                                    />
                                    <span className="font-display text-xl font-medium text-muted-foreground">
                                        MAD
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {['50', '100', '250', '500', '1000'].map(
                                    (v) => (
                                        <button
                                            key={v}
                                            onClick={() => setAmount(v)}
                                            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-accent"
                                        >
                                            {v} MAD
                                        </button>
                                    ),
                                )}
                            </div>

                            <div className="mt-6 grid place-items-center rounded-3xl bg-[image:var(--gradient-mint)] p-6">
                                <FakeQR />
                                <p className="mt-3 font-mono text-xs text-deep">
                                    ATLS-
                                    {Math.floor(Math.random() * 9000 + 1000)}-
                                    {Math.floor(Math.random() * 9000 + 1000)}
                                </p>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <Button className="flex-1">
                                    Generate new QR
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCopied(true);
                                        setTimeout(
                                            () => setCopied(false),
                                            1500,
                                        );
                                    }}
                                >
                                    {copied ? (
                                        <Check className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Copy className="mr-2 h-4 w-4" />
                                    )}
                                    Share link
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Shield className="h-4 w-4 text-primary" />
                            Anwar AI fraud watch
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Each QR is a one-time signed token. We score the
                            receiver and flag unusual amounts before you
                            confirm.
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            {[
                                { l: 'Today', v: '12' },
                                { l: 'Blocked', v: '0' },
                                { l: 'Trust', v: '98%' },
                            ].map((s) => (
                                <div
                                    key={s.l}
                                    className="rounded-xl bg-secondary p-2.5"
                                >
                                    <p className="font-display text-lg font-semibold">
                                        {s.v}
                                    </p>
                                    <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                                        {s.l}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                        <h3 className="text-sm font-semibold">
                            Recent QR activity
                        </h3>
                        <ul className="mt-3 space-y-3 text-sm">
                            {[
                                {
                                    n: 'Hanout Si Mohamed',
                                    a: -28,
                                    t: '2 min ago',
                                },
                                { n: 'Café Atlas', a: -42, t: '1 h ago' },
                                { n: 'From Yassine', a: 150, t: 'Today' },
                            ].map((r) => (
                                <li
                                    key={r.n}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">{r.n}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {r.t}
                                        </p>
                                    </div>
                                    <span
                                        className={
                                            r.a > 0
                                                ? 'font-semibold text-success'
                                                : 'font-semibold'
                                        }
                                    >
                                        {r.a > 0 ? '+' : ''}
                                        {r.a} MAD
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FakeQR() {
    // Pseudo-QR pattern (decorative — real QR will use qrcode.react when wired)
    const cells = Array.from({ length: 21 * 21 }, (_, i) => {
        const x = i % 21;
        const y = Math.floor(i / 21);
        const finder =
            (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        const seed = (x * 31 + y * 17 + 7) % 7;

        return finder
            ? x === 0 ||
              x === 6 ||
              y === 0 ||
              y === 6 ||
              (x > 1 && x < 5 && y > 1 && y < 5)
                ? 1
                : 0
            : seed > 3
              ? 1
              : 0;
    });

    return (
        <div className="grid aspect-square w-56 grid-cols-[repeat(21,1fr)] gap-[2px] rounded-xl bg-card p-3">
            {cells.map((c, i) => (
                <div
                    key={i}
                    className={c ? 'rounded-[1px] bg-deep' : 'bg-transparent'}
                />
            ))}
        </div>
    );
}
