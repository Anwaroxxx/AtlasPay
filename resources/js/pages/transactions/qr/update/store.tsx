import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CheckCircle2, 
    ShieldCheck, 
    Loader2,
    ArrowLeft,
    CircleDollarSign,
    Store,
    ShoppingBag
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
    id: string;
    token: {
        to_account: { user: { name: string, profile_photo?: string } };
        token: string;
    };
}

export default function StorePayment({ id, token: initialToken }: Props) {
    const [status, setStatus] = useState('pending');
    const { data, setData, processing } = useForm({
        amount: "",
    });

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.amount) return;

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
            <Head title="Pay Merchant" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                {/* Merchant Profile */}
                <div className="bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1 mb-4 shadow-xl rotate-3">
                            {initialToken.to_account.user.profile_photo ? (
                                <img 
                                    src={initialToken.to_account.user.profile_photo} 
                                    alt="Merchant" 
                                    className="w-full h-full object-cover rounded-[1.25rem]"
                                />
                            ) : (
                                <div className="w-full h-full bg-emerald-100 rounded-[1.25rem] flex items-center justify-center text-emerald-600">
                                    <Store className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold">{initialToken.to_account.user.name}</h1>
                        <p className="text-emerald-100 text-sm flex items-center mt-1">
                            <ShieldCheck className="w-4 h-4 mr-1" />
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
                                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h2>
                                <p className="text-slate-500 mb-8">Your payment to {initialToken.to_account.user.name} has been processed.</p>
                                
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
                                <div className="text-left space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Enter Amount to Pay</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                            MAD
                                        </div>
                                        <input 
                                            type="number"
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] py-8 pl-24 pr-8 text-4xl font-black text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[10, 50, 100].map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setData('amount', amt.toString())}
                                            className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all"
                                        >
                                            +{amt}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing || !data.amount}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-5 rounded-3xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center space-x-3 active:scale-95"
                                >
                                    {processing ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-6 h-6" />
                                            <span className="text-lg">Pay Merchant Now</span>
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
