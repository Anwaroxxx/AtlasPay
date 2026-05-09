import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ArrowUpRight,
    ShieldCheck,
    Loader2,
    ArrowLeft,
    CircleDollarSign,
    Store,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    id: string;
    token: {
        amount: string | null;
        to_account: { user: { name: string } };
        status: string;
        token: string;
    };
}

export default function PayerView({ id, token: initialToken }: Props) {
    const [status, setStatus] = useState(initialToken.status);
    const { data, setData, post, processing } = useForm({
        amount: initialToken.amount || '',
    });

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(`/qr/confirm/${id}`, { amount: data.amount })
            .then(() => {
                setStatus('completed');
                toast.success('Payment successful!');
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Payment failed');
            });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Head title="Pay via QR" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                {/* Header */}
                <div className="relative overflow-hidden bg-slate-800 p-8 text-center text-white">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-emerald-400 backdrop-blur-md"
                    >
                        <Store className="h-10 w-10" />
                    </motion.div>

                    <h1 className="mb-1 text-xl font-bold">Paying Merchant</h1>
                    <p className="text-sm text-slate-400">
                        Transferring to{' '}
                        <span className="font-semibold text-white">
                            {initialToken.to_account.user.name}
                        </span>
                    </p>
                </div>

                <div className="p-8 text-center">
                    <AnimatePresence mode="wait">
                        {status === 'completed' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
                                    Payment Sent!
                                </h2>
                                <p className="mb-8 text-slate-500">
                                    The funds have been transferred
                                    successfully.
                                </p>

                                <Link
                                    href="/dashboard"
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 py-4 font-bold text-white transition-all hover:bg-slate-700"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handlePay}
                                className="space-y-8"
                            >
                                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800/50">
                                    <span className="mb-4 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                                        Amount to Pay
                                    </span>

                                    {initialToken.amount ? (
                                        <div className="text-5xl font-black text-slate-800 dark:text-white">
                                            {new Intl.NumberFormat('fr-MA', {
                                                style: 'currency',
                                                currency: 'MAD',
                                            }).format(
                                                parseFloat(initialToken.amount),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <CircleDollarSign className="absolute top-1/2 left-0 h-8 w-8 -translate-y-1/2 text-emerald-500" />
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border-none bg-transparent p-0 pl-12 text-center text-4xl font-black text-slate-800 focus:ring-0 dark:text-white"
                                                placeholder="0.00"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.amount}
                                    className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-emerald-600 py-5 font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50 dark:shadow-none"
                                >
                                    {processing ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ArrowUpRight className="h-6 w-6" />
                                            <span className="text-lg">
                                                Confirm & Pay Now
                                            </span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-slate-400">
                                    By clicking confirm, you authorize the
                                    transfer of funds to this merchant.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center space-x-2 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Secured by AtlasPay Anti-Fraud
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
