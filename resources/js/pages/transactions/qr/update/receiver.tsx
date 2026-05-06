import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CheckCircle2, 
    ArrowUpRight, 
    ShieldCheck, 
    Loader2,
    ArrowLeft,
    CircleDollarSign,
    Store
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
        amount: initialToken.amount || "",
    });

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post(`/qr/confirm/${id}`, { amount: data.amount })
            .then(() => {
                setStatus('completed');
                toast.success("Payment successful!");
            })
            .catch(err => {
                toast.error(err.response?.data?.message || "Payment failed");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Head title="Pay via QR" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                {/* Header */}
                <div className="bg-slate-800 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                    
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md text-emerald-400 mb-4"
                    >
                        <Store className="w-10 h-10" />
                    </motion.div>

                    <h1 className="text-xl font-bold mb-1">Paying Merchant</h1>
                    <p className="text-slate-400 text-sm">
                        Transferring to <span className="text-white font-semibold">{initialToken.to_account.user.name}</span>
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
                                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Sent!</h2>
                                <p className="text-slate-500 mb-8">The funds have been transferred successfully.</p>
                                
                                <Link 
                                    href="/dashboard"
                                    className="w-full inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
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
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Amount to Pay</span>
                                    
                                    {initialToken.amount ? (
                                        <div className="text-5xl font-black text-slate-800 dark:text-white">
                                            {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(parseFloat(initialToken.amount))}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <CircleDollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500" />
                                            <input 
                                                type="number"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                className="w-full bg-transparent border-none text-4xl font-black text-slate-800 dark:text-white focus:ring-0 p-0 pl-12 text-center"
                                                placeholder="0.00"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing || !data.amount}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center space-x-3 active:scale-95"
                                >
                                    {processing ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ArrowUpRight className="w-6 h-6" />
                                            <span className="text-lg">Confirm & Pay Now</span>
                                        </>
                                    )}
                                </button>
                                
                                <p className="text-xs text-slate-400">
                                    By clicking confirm, you authorize the transfer of funds to this merchant.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured by AtlasPay Anti-Fraud</span>
                </div>
            </motion.div>
        </div>
    );
}
