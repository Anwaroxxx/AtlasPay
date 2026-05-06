import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

interface Props {
    message: string;
}

export default function SuccessPage({ message }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Head title="Success" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-800"
            >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Success!</h1>
                <p className="text-slate-500 mb-8">{message}</p>
                
                <div className="space-y-3">
                    <Link 
                        href="/dashboard" 
                        className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
