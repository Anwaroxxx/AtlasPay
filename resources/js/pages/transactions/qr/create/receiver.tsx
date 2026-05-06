import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Download, 
    CircleDollarSign, 
    PlusCircle,
    Info,
    ShieldCheck
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function ReceiverCreate() {
    const { data, setData, post, processing, errors } = useForm({
        amount: "", // Optional for Flow 2
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/qr/create/receiver");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-6">
            <Head title="Request Payment via QR" />

            <div className="max-w-md mx-auto w-full">
                <Link href="/transfer" className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Transfers
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 p-8"
                >
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <PlusCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Request Payment</h1>
                            <p className="text-sm text-slate-500">Create a payment-request QR</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                Fixed Amount (Optional)
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <CircleDollarSign className="w-6 h-6" />
                                </div>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    placeholder="Leave empty for editable amount"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-lg font-bold text-slate-800 dark:text-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-2 text-sm text-rose-500 ml-1">{errors.amount}</p>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center space-x-2 active:scale-95"
                        >
                            {processing ? (
                                <span className="animate-pulse">Generating...</span>
                            ) : (
                                <>
                                    <span>Generate Request QR</span>
                                    <Download className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-start space-x-3 text-slate-400">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <p className="text-xs leading-relaxed">
                                Use this to receive payments from others. If you set an amount, the payer won't be able to change it. If you leave it empty, they can enter any amount.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
