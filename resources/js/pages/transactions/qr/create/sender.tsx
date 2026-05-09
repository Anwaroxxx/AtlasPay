import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Send,
    CircleDollarSign,
    Wallet,
    Info,
    ShieldCheck,
} from 'lucide-react';
import React from 'react';

export default function Sender() {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/qr/create/sender');
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 p-6 dark:bg-slate-950">
            <Head title="Send Money via QR" />

            <div className="mx-auto w-full max-w-md">
                <Link
                    href="/transfer"
                    className="mb-8 inline-flex items-center text-slate-500 transition-colors hover:text-emerald-600"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Transfers
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="mb-8 flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Send className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                                Send Money
                            </h1>
                            <p className="text-sm text-slate-500">
                                Generate a secure one-time QR code
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-3 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Amount (MAD)
                            </label>
                            <div className="group relative">
                                <div className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500">
                                    <CircleDollarSign className="h-6 w-6" />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pr-6 pl-14 text-xl font-bold text-slate-800 transition-all outline-none focus:border-emerald-500 focus:ring-0 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                    autoFocus
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-2 ml-1 text-sm text-rose-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Balance Preview */}
                        <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <div className="flex items-center text-slate-500">
                                <Wallet className="mr-2 h-4 w-4" />
                                <span className="text-sm">
                                    Available Balance
                                </span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">
                                ***.** MAD
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.amount}
                            className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:hover:bg-emerald-600 dark:shadow-none"
                        >
                            {processing ? (
                                <span className="animate-pulse">
                                    Generating...
                                </span>
                            ) : (
                                <>
                                    <span>Generate QR Code</span>
                                    <ArrowLeft className="h-5 w-5 rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <div className="flex items-start space-x-3 text-slate-400">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />
                            <p className="text-xs leading-relaxed">
                                This QR code will be valid for 5 minutes and can
                                only be used for a single transaction. Always
                                verify the receiver before they scan.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 flex items-center justify-center space-x-6 opacity-40 grayscale">
                    <ShieldCheck className="h-6 w-6" />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                        Verified Transaction Protocol
                    </span>
                </div>
            </div>
        </div>
    );
}
