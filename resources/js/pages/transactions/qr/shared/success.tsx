import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';
import React from 'react';

interface Props {
    message: string;
}

export default function SuccessPage({ message }: Props) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Head title="Success" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-10 w-10" />
                </div>

                <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
                    Success!
                </h1>
                <p className="mb-8 text-slate-500">{message}</p>

                <div className="space-y-3">
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-500 dark:shadow-none"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Go to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
