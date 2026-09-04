import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Download,
    CircleDollarSign,
    PlusCircle,
    Info,
    ShieldCheck,
} from 'lucide-react';
import React from 'react';

export default function ReceiverCreate() {
    const { data, setData, post, processing, errors } = useForm({
        amount: '', // Optional for Flow 2
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/qr/create/receiver');
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 p-6 dark:bg-slate-950">
            <Head title="Request Payment via QR" />

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
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                            <PlusCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                                Request Payment
                            </h1>
                            <p className="text-sm text-slate-500">
                                Create a payment-request QR
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-3 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Fixed Amount (Optional)
                            </label>
                            <div className="group relative">
                                <div className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                                    <CircleDollarSign className="h-6 w-6" />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    placeholder="Leave empty for editable amount"
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pr-6 pl-14 text-lg font-bold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-0 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-2 ml-1 text-sm text-rose-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50 dark:shadow-none"
                        >
                            {processing ? (
                                <span className="animate-pulse">
                                    Generating...
                                </span>
                            ) : (
                                <>
                                    <span>Generate Request QR</span>
                                    <Download className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <div className="flex items-start space-x-3 text-slate-400">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />
                            <p className="text-xs leading-relaxed">
                                Use this to receive payments from others. If you
                                set an amount, the payer won't be able to change
                                it. If you leave it empty, they can enter any
                                amount.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
