import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ArrowDownLeft,
    User,
    ShieldCheck,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    id: string;
    token: {
        amount: string;
        from_account: { user: { name: string } };
        status: string;
        token: string;
    };
}

export default function ReceiverView({ id, token: initialToken }: Props) {
    const [status, setStatus] = useState(initialToken.status);

    useEffect(() => {
        const channel = (window as any).Echo.channel(
            `qr-token.${initialToken.token}`,
        ).listen('QrTokenStatusUpdated', (e: any) => {
            setStatus(e.status);
        });

        return () => {
            channel.stopListening('QrTokenStatusUpdated');
        };
    }, [initialToken.token]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Head title="Receive Payment" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="p-8 text-center">
                    <motion.div
                        animate={
                            status === 'completed' ? { scale: [1, 1.2, 1] } : {}
                        }
                        className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                    >
                        {status === 'completed' ? (
                            <CheckCircle2 className="h-10 w-10" />
                        ) : (
                            <ArrowDownLeft className="h-10 w-10" />
                        )}
                    </motion.div>

                    <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
                        {status === 'completed'
                            ? 'Payment Received!'
                            : 'Incoming Payment'}
                    </h1>

                    <p className="mb-8 text-slate-500">
                        {status === 'completed'
                            ? `You have successfully received funds from ${initialToken.from_account.user.name}.`
                            : `${initialToken.from_account.user.name} is sending you money.`}
                    </p>

                    <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                        <span className="mb-2 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                            Amount
                        </span>
                        <div className="text-4xl font-black text-emerald-600">
                            {new Intl.NumberFormat('fr-MA', {
                                style: 'currency',
                                currency: 'MAD',
                            }).format(parseFloat(initialToken.amount))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {status !== 'completed' ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex items-center space-x-3 rounded-full bg-emerald-50 px-6 py-3 font-medium text-emerald-600 dark:bg-emerald-900/20">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>
                                        Waiting for sender to confirm...
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Keep this page open to see the confirmation
                                    instantly.
                                </p>
                            </div>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 py-4 font-bold text-white transition-all hover:bg-slate-700"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-2 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Secure Transfer Verified
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
