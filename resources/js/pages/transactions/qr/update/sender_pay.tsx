import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ArrowUpRight,
    ShieldCheck,
    Loader2,
    ArrowLeft,
    CircleDollarSign,
    User,
    X,
    Lock,
    ChevronLeft,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    id: string;
    token: {
        amount: string | null;
        from_account: { user: { name: string } };
        status: string;
        token: string;
    };
}

export default function ReceiverView({ id, token: initialToken }: Props) {
    const [status, setStatus] = useState(initialToken.status);
    const { data, setData, processing } = useForm({
        amount: initialToken.amount || '',
    });

    // Real-time status tracking
    useEffect(() => {
        const channel = (window as any).Echo.channel(
            `qr-token.${initialToken.token}`,
        ).listen('QrTokenStatusUpdated', (e: any) => {
            setStatus((prev) => (prev !== e.status ? e.status : prev));
        });

        const pollInterval = setInterval(() => {
            // Only poll if pending
            if (status !== 'pending' && status !== 'scanned') return;

            axios
                .get(`/qr/status/${initialToken.token}`)
                .then((res) => {
                    if (res.data.status !== status) {
                        setStatus(res.data.status);
                    }
                })
                .catch(() => {});
        }, 2000);

        return () => {
            (window as any).Echo.leave(`qr-token.${initialToken.token}`);
            clearInterval(pollInterval);
        };
    }, [initialToken.token]);

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(`/qr/confirm/${id}`, { amount: data.amount })
            .then(() => {
                setStatus('ready');
                toast.success('Payment request sent to sender.');
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Request failed.');
            });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
            <Head title="Quick Pay" />
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />

            <Link
                href="/transfer"
                className="group absolute top-8 left-8 z-10 flex items-center gap-2 text-xs font-black tracking-widest text-muted-foreground uppercase transition-all hover:text-primary"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary/30 group-hover:bg-primary/5">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                Return
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <div className="shadow-elevated overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-3xl">
                    <div className="bg-noise absolute inset-0 opacity-[0.02]" />

                    {/* Header */}
                    <div className="relative border-b border-border/50 p-8 text-center">
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        >
                            <User className="h-8 w-8" />
                        </motion.div>

                        <h1 className="font-display text-2xl font-black tracking-tighter text-foreground uppercase">
                            Quick Pay
                        </h1>
                        <p className="mt-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-60">
                            Paying to <span className="text-foreground">{initialToken.from_account.user.name}</span>
                        </p>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {status === 'cancelled' ? (
                                <motion.div
                                    key="cancelled"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center py-8 text-center"
                                >
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                        <X className="h-10 w-10" />
                                    </div>
                                    <h2 className="font-display mb-2 text-xl font-black tracking-tight text-foreground uppercase">
                                        Request Declined
                                    </h2>
                                    <p className="mb-10 text-xs font-medium text-muted-foreground opacity-60">
                                        The transaction request has been <br />
                                        terminated by the counterparty.
                                    </p>

                                    <Link
                                        href="/dashboard"
                                        className="inline-block w-full rounded-2xl bg-foreground py-4 text-xs font-black tracking-widest text-background transition-all hover:opacity-90 active:scale-95"
                                    >
                                        Return to Dashboard
                                    </Link>
                                </motion.div>
                            ) : status === 'ready' || status === 'completed' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center py-8 text-center"
                                >
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <h2 className="font-display mb-2 text-xl font-black tracking-tight text-foreground uppercase">
                                        {status === 'ready' ? 'Request Sent' : 'Payment Success'}
                                    </h2>
                                    <p className="mb-10 text-xs font-medium text-muted-foreground opacity-60">
                                        {status === 'ready'
                                            ? 'The transaction is awaiting authorization \n from the primary account owner.'
                                            : 'The digital settlement has been \n successfully processed on the network.'}
                                    </p>

                                    <Link
                                        href="/dashboard"
                                        className="inline-block w-full rounded-2xl bg-foreground py-4 text-xs font-black tracking-widest text-background transition-all hover:opacity-90 active:scale-95"
                                    >
                                        Return to Dashboard
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={handleRequest}
                                    className="space-y-10"
                                >
                                    <div className="rounded-[2rem] border border-border/50 bg-muted/30 p-8 text-center">
                                        <p className="mb-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60">
                                            Specify Amount
                                        </p>

                                        <div className="relative flex items-center justify-center gap-2">
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="w-full border-none bg-transparent p-0 text-center font-display text-5xl font-black tracking-tighter text-foreground focus:ring-0"
                                                placeholder="0.00"
                                                autoFocus
                                            />
                                            <span className="font-display text-xl font-black opacity-20">MAD</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={processing || !data.amount}
                                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-xs font-black tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
                                        >
                                            {processing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    <span>Initiate Request</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm('Terminate this request?')) {
                                                    axios.post(`/qr/cancel/${id}`).then(() => router.visit('/dashboard'));
                                                }
                                            }}
                                            className="w-full text-center text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase hover:text-destructive transition-colors"
                                        >
                                            Cancel Transaction
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Info */}
                    <div className="border-t border-border/50 bg-muted/20 px-8 py-6">
                        <div className="flex items-center justify-center gap-3 text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase opacity-40">
                            <Lock className="h-3 w-3" />
                            Secure Protocol
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

