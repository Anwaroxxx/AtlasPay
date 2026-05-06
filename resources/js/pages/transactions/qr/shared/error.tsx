import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

interface Props {
    message: string;
}

export default function ErrorPage({ message }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Head title="Transaction Error" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-800"
            >
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Oops! Something went wrong</h1>
                <p className="text-slate-500 mb-8">{message}</p>
                
                <div className="space-y-3">
                    <Link 
                        href="/transfer" 
                        className="w-full inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Transfers
                    </Link>
                    <Link 
                        href="/dashboard" 
                        className="w-full inline-flex items-center justify-center text-slate-500 hover:text-slate-700 font-bold py-4 transition-all"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
