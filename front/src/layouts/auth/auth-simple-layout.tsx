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
        <div className="selection:bg-brand-medium/30 relative flex min-h-svh w-screen flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[#010301] p-4 py-8 text-white">
            {/* Background elements to match LandingPage */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#010301_100%)] opacity-80" />
            <div className="moroccan-pattern pointer-events-none fixed inset-0 z-0 opacity-[0.03]" />
            <div className="bg-brand-medium/5 fixed top-0 right-0 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
            <div className="bg-brand-medium/5 fixed bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full blur-[100px]" />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href={home()}
                            className="group flex items-center gap-3"
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
                            <h1 className="text-glow font-serif text-xl font-bold tracking-tight italic">
                                {title}
                            </h1>
                            <p className="mx-auto max-w-xs text-center text-[9px] font-light tracking-[0.3em] text-gray-400 uppercase">
                                {description}
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-card relative w-full rounded-xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-[40px] md:p-8"
                    >
                        {/* Inner subtle glow */}
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent" />
                        <div className="relative z-10">{children}</div>
                    </motion.div>
                </motion.div>
            </div>

            <footer className="absolute bottom-4 z-10 text-[9px] font-bold tracking-[0.4em] text-gray-700 uppercase italic opacity-50">
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
