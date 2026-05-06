import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh w-screen flex-col items-center justify-center bg-[#010301] text-white p-4 py-8 selection:bg-brand-medium/30 relative overflow-x-hidden overflow-y-auto">
            {/* Background elements to match LandingPage */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#010301_100%)] opacity-80" />
            <div className="fixed inset-0 z-0 pointer-events-none moroccan-pattern opacity-[0.03]" />
            <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-brand-medium/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-brand-medium/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-4 w-full"
                >
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href={home()}
                            className="flex items-center gap-3 group"
                        >
                            <div className="flex items-center justify-center transition-all group-hover:scale-105 active:scale-95">
                                <img 
                                    src="/images/logos/darkmode-Photoroom.png" 
                                    alt="AtlasPay Logo" 
                                    className="h-24 w-auto object-contain"
                                />
                            </div>
                        </Link>

                        <div className="space-y-0.5 text-center">
                            <h1 className="text-xl font-serif font-bold tracking-tight italic text-glow">{title}</h1>
                            <p className="text-center text-[9px] text-gray-400 font-light max-w-xs mx-auto uppercase tracking-[0.3em]">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-card p-6 md:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-[40px] w-full rounded-xl shadow-2xl relative"
                    >
                        {/* Inner subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none" />
                        <div className="relative z-10">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <footer className="absolute bottom-4 z-10 text-[9px] text-gray-700 uppercase tracking-[0.4em] font-bold italic opacity-50">
                © 2026 ATLASPAY BANKING GROUP.
            </footer>

            <style>{`
                :root {
                    --brand-medium: #76b182;
                    --brand-light: #c9e6c3;
                    --brand-dark: #36694b;
                }
                .text-brand-medium { color: var(--brand-medium); }
                .bg-brand-medium { background-color: var(--brand-medium); }
                .border-brand-medium { border-color: var(--brand-medium); }
                .text-glow {
                    text-shadow: 0 0 20px rgba(118, 177, 130, 0.2);
                }
                .moroccan-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L61.226 34.549H97.553L68.163 55.902L79.389 90.451L50 69.098L20.611 90.451L31.837 55.902L2.447 34.549H38.774L50 0Z' fill='%2376b182' fill-opacity='0.05'/%3E%3C/svg%3E");
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(40px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                input:focus, textarea:focus {
                    border-color: var(--brand-medium) !important;
                    box-shadow: 0 0 0 1px var(--brand-medium), 0 0 20px rgba(118, 177, 130, 0.15) !important;
                }
                [data-slot="checkbox"][data-state="checked"] {
                    background-color: var(--brand-medium) !important;
                    border-color: var(--brand-medium) !important;
                    color: black !important;
                }
                [data-slot="select-trigger"]:focus {
                    border-color: var(--brand-medium) !important;
                    box-shadow: 0 0 0 2px rgba(118, 177, 130, 0.1) !important;
                }
                [data-slot="select-content"] {
                    background-color: #0a0a0a !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                }
                [data-slot="select-item"]:focus {
                    background-color: var(--brand-medium) !important;
                    color: black !important;
                }
                [data-slot="select-item"][data-state="checked"] {
                    color: var(--brand-medium) !important;
                }
                [data-slot="select-item"]:focus[data-state="checked"] {
                    color: black !important;
                }
                .btn-brand {
                    background-color: var(--brand-medium);
                    color: black;
                    transition: all 0.3s ease;
                }
                .btn-brand:hover {
                    background-color: var(--brand-light);
                    transform: scale(1.02);
                }
                label {
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.2em !important;
                    font-weight: 700 !important;
                    color: #9ca3af !important;
                }
            `}</style>
        </div>
    );
}
