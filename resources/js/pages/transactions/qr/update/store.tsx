import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ShieldCheck,
    Loader2,
    ArrowLeft,
    CircleDollarSign,
    Store,
    ShoppingBag,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    id: string;
    token: {
        to_account: { user: { name: string; profile_photo?: string } };
        token: string;
    };
}

export default function StorePayment({ id, token: initialToken }: Props) {
    const [status, setStatus] = useState('pending');
    const { data, setData, processing } = useForm({
        amount: '',
    });

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.amount) {
            return;
        }

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
            <Head title="Pay Merchant" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                {/* Merchant Profile */}
                <div className="relative overflow-hidden bg-emerald-600 p-8 text-center text-white">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-4 h-24 w-24 rotate-3 rounded-3xl bg-white p-1 shadow-xl">
                            {initialToken.to_account.user.profile_photo ? (
                                <img
                                    src={
                                        initialToken.to_account.user
                                            .profile_photo
                                    }
                                    alt="Merchant"
                                    className="h-full w-full rounded-[1.25rem] object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-emerald-100 text-emerald-600">
                                    <Store className="h-10 w-10" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold">
                            {initialToken.to_account.user.name}
                        </h1>
                        <p className="mt-1 flex items-center text-sm text-emerald-100">
                            <ShieldCheck className="mr-1 h-4 w-4" />
                            Verified Merchant
                        </p>
                    </div>
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
                                    Payment Successful!
                                </h2>
                                <p className="mb-8 text-slate-500">
                                    Your payment to{' '}
                                    {initialToken.to_account.user.name} has been
                                    processed.
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
                                <div className="space-y-4 text-left">
                                    <label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                        Enter Amount to Pay
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute top-1/2 left-6 -translate-y-1/2 text-3xl font-black text-slate-300 transition-colors group-focus-within:text-emerald-500">
                                            MAD
                                        </div>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) =>
                                                setData(
                                                    'amount',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-[2rem] border-2 border-slate-100 bg-slate-50 py-8 pr-8 pl-24 text-4xl font-black text-slate-800 transition-all outline-none focus:border-emerald-500 focus:ring-0 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[10, 50, 100].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    'amount',
                                                    amt.toString(),
                                                )
                                            }
                                            className="rounded-xl bg-slate-100 py-3 font-bold text-slate-600 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                                        >
                                            +{amt}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.amount}
                                    className="flex w-full items-center justify-center space-x-3 rounded-3xl bg-emerald-600 py-5 font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50 dark:shadow-none"
                                >
                                    {processing ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-6 w-6" />
                                            <span className="text-lg">
                                                Pay Merchant Now
                                            </span>
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col items-center space-y-4 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            End-to-End Encrypted
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
