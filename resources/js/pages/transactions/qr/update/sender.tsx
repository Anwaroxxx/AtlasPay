import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    CheckCircle2, 
    ArrowDownLeft, 
    User, 
    ShieldCheck, 
    Loader2,
    ArrowLeft
} from "lucide-react";

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
        const channel = (window as any).Echo.channel(`qr-token.${initialToken.token}`)
            .listen('QrTokenStatusUpdated', (e: any) => {
                setStatus(e.status);
            });

        return () => {
            channel.stopListening('QrTokenStatusUpdated');
        };
    }, [initialToken.token]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Head title="Receive Payment" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                <div className="p-8 text-center">
                    <motion.div 
                        animate={status === 'completed' ? { scale: [1, 1.2, 1] } : {}}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-6"
                    >
                        {status === 'completed' ? (
                            <CheckCircle2 className="w-10 h-10" />
                        ) : (
                            <ArrowDownLeft className="w-10 h-10" />
                        )}
                    </motion.div>

                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        {status === 'completed' ? 'Payment Received!' : 'Incoming Payment'}
                    </h1>
                    
                    <p className="text-slate-500 mb-8">
                        {status === 'completed' 
                            ? `You have successfully received funds from ${initialToken.from_account.user.name}.`
                            : `${initialToken.from_account.user.name} is sending you money.`}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Amount</span>
                        <div className="text-4xl font-black text-emerald-600">
                            {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(parseFloat(initialToken.amount))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {status !== 'completed' ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex items-center space-x-3 text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-full">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Waiting for sender to confirm...</span>
                                </div>
                                <p className="text-xs text-slate-400">Keep this page open to see the confirmation instantly.</p>
                            </div>
                        ) : (
                            <Link 
                                href="/dashboard"
                                className="w-full inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Transfer Verified</span>
                </div>
            </motion.div>
        </div>
    );
}
