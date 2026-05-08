import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import React from 'react';

interface Props {
    message: string;
}

export default function ErrorPage({ message }: Props) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Head title="Transaction Error" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-900/30">
                    <AlertCircle className="h-10 w-10" />
                </div>

                <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
                    Oops! Something went wrong
                </h1>
                <p className="mb-8 text-slate-500">{message}</p>

                <div className="space-y-3">
                    <Link
                        href="/transfer"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 py-4 font-bold text-white transition-all hover:bg-slate-700"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Transfers
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full items-center justify-center py-4 font-bold text-slate-500 transition-all hover:text-slate-700"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
