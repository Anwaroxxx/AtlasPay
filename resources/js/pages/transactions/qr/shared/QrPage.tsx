import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode as QrIcon,
    CheckCircle2,
    Clock,
    ArrowRightLeft,
    ShieldCheck,
    AlertCircle,
    Loader2,
    ChevronLeft,
    Copy,
    Share2,
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

interface QrToken {
    id: number;
    token: string;
    amount: string | null;
    status:
        | 'pending'
        | 'scanned'
        | 'ready'
        | 'completed'
        | 'expired'
        | 'cancelled';
    goal: 'sender' | 'receiver' | 'store' | 'sender_pay';
    from_account?: { user: { name: string } };
    to_account?: { user: { name: string } };
    expires_at: string;
    created_by_account_id: number;
}

interface Props {
    id: string; // Encrypted token for URL
    token: QrToken;
    goal: 'sender' | 'receiver' | 'store' | 'sender_pay';
    appUrl: string;
}

export default function QrPage({
    id,
    token: initialToken,
    goal,
    appUrl,
}: Props) {
    const { auth } = usePage<any>().props;
    const [token, setToken] = useState<QrToken>(initialToken);
    const [countdown, setCountdown] = useState('');
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrCode] = useState(
        () =>
            new QRCodeStyling({
                width: 280,
                height: 280,
                dotsOptions: {
                    color: '#10b981', // Emerald 500
                    type: 'rounded',
                },
                backgroundOptions: {
                    color: '#ffffff',
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 10,
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: '#065f46',
                },
            }),
    );

    // Generate scan URL
    const scanUrl = `${appUrl}/qr/redirect/${id}`;

    useEffect(() => {
        if (qrRef.current) {
            qrRef.current.innerHTML = ''; // Clear before appending
            qrCode.append(qrRef.current);
        }

        qrCode.update({ data: scanUrl });
    }, [scanUrl, qrCode]);

    // Real-time status updates + Polling Fallback
    useEffect(() => {
        const channel = (window as any).Echo.channel(
            `qr-token.${token.token}`,
        ).listen('QrTokenStatusUpdated', (e: any) => {
            setToken((prev) => ({
                ...prev,
                status: e.status,
                amount: e.amount || prev.amount,
                to_account: e.to_account || prev.to_account,
            }));
        });

        // Polling fallback every 2 seconds
        const pollInterval = setInterval(() => {
            if (
                token.status === 'completed' ||
                token.status === 'expired' ||
                token.status === 'cancelled'
            ) {
                return;
            }

            axios
                .get(`/qr/status/${token.token}`)
                .then((res) => {
                    if (
                        res.data.status !== token.status ||
                        res.data.token.amount !== token.amount
                    ) {
                        setToken((prev) => ({ ...prev, ...res.data.token }));
                    }
                })
                .catch(() => {});
        }, 2000);

        return () => {
            (window as any).Echo.leave(`qr-token.${token.token}`);
            clearInterval(pollInterval);
        };
    }, [token.token, token.status, token.amount]);

    // Countdown timer
    useEffect(() => {
        if (token.status === 'cancelled' || token.status === 'completed') {
            setCountdown('--:--');
            return;
        }

        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(
                token.expires_at.replace(' ', 'T') + 'Z',
            ).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                setCountdown('EXPIRED');
                setToken((prev) => ({ ...prev, status: 'expired' }));
                clearInterval(countdownTimer);

                return;
            } else {
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60),
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, [token.expires_at, token.status]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(scanUrl);
        toast.success('Link copied to clipboard!');
    };

    const handleCancel = () => {
        if (!confirm('Are you sure you want to cancel this transaction?'))
            return;

        axios
            .post(`/qr/cancel/${id}`)
            .then(() => {
                toast.error('Transaction cancelled');
                setToken((prev) => ({ ...prev, status: 'cancelled' }));
            })
            .catch(() => {
                toast.error('Failed to cancel transaction');
            });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Head title="Secure QR Payment" />

            <Link
                href="/transfer"
                className="absolute top-6 left-6 flex items-center text-slate-500 transition-colors hover:text-emerald-600"
            >
                <ChevronLeft className="mr-1 h-5 w-5" />
                Back to Transfers
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                {/* Header Section */}
                <div className="relative overflow-hidden bg-emerald-600 p-6 text-center text-white">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-emerald-900/20 blur-2xl" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md"
                    >
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </motion.div>

                    <h1 className="mb-1 text-xl font-bold">
                        {goal === 'sender' && 'Sending Money'}
                        {goal === 'sender_pay' && 'Quick Pay Request'}
                        {goal === 'receiver' && 'Requesting Payment'}
                        {goal === 'store' && 'Merchant Payment'}
                    </h1>
                    <p className="flex items-center justify-center text-sm text-emerald-100">
                        <Clock className="mr-1 h-3 w-3" />
                        Expires in:{' '}
                        <span className="ml-1 font-mono font-bold">
                            {countdown}
                        </span>
                    </p>
                </div>

                {/* Main Body */}
                <div className="flex flex-col items-center p-8">
                    {/* Amount Display */}
                    {token.amount && (
                        <div className="mb-8 text-center">
                            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                {goal === 'sender_pay'
                                    ? 'Requested Amount'
                                    : `Amount to ${goal === 'sender' ? 'Send' : 'Receive'}`}
                            </span>
                            <div className="mt-1 text-4xl font-black text-slate-800 dark:text-white">
                                {new Intl.NumberFormat('fr-MA', {
                                    style: 'currency',
                                    currency: 'MAD',
                                }).format(parseFloat(token.amount))}
                            </div>
                        </div>
                    )}

                    {/* QR Code Container */}
                    <div className="group relative">
                        <motion.div
                            animate={
                                token.status === 'expired' ||
                                token.status === 'cancelled'
                                    ? { opacity: 0.5, filter: 'grayscale(1)' }
                                    : {}
                            }
                            className="rounded-3xl border-4 border-emerald-50 bg-white p-4 shadow-inner dark:border-emerald-950"
                        >
                            <div ref={qrRef} />
                        </motion.div>

                        <AnimatePresence>
                            {(token.status === 'expired' ||
                                token.status === 'cancelled') && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white/80 dark:bg-slate-900/80"
                                >
                                    {token.status === 'expired' ? (
                                        <AlertCircle className="mb-2 h-16 w-16 text-rose-500" />
                                    ) : (
                                        <X className="mb-2 h-16 w-16 text-slate-500" />
                                    )}
                                    <span
                                        className={`font-bold ${token.status === 'expired' ? 'text-rose-600' : 'text-slate-600'}`}
                                    >
                                        {token.status === 'expired'
                                            ? 'QR Code Expired'
                                            : 'Transaction Cancelled'}
                                    </span>
                                    <Link
                                        href="/transfer"
                                        className="mt-4 rounded-full bg-slate-800 px-4 py-2 text-xs text-white"
                                    >
                                        Go Back
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Full Page Success Overlay */}
                    <AnimatePresence>
                        {token.status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-6 backdrop-blur-md"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="w-full max-w-md rounded-[2.5rem] border border-emerald-500/20 bg-white p-8 text-center shadow-2xl dark:bg-slate-900"
                                >
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    </div>
                                    <h2 className="mb-2 text-3xl font-black tracking-tighter text-slate-800 uppercase dark:text-white">
                                        Transfer Complete!
                                    </h2>
                                    <p className="mb-10 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        The funds have been successfully moved
                                        to the recipient's account.
                                    </p>
                                    <Link
                                        href="/dashboard"
                                        className="inline-block w-full rounded-2xl bg-emerald-600 py-5 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-500 active:scale-95"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Text */}
                    <div className="mt-8 w-full">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Transaction Status
                            </span>
                            <span
                                className={`rounded-full px-2 py-1 text-xs font-bold tracking-tight uppercase ${
                                    token.status === 'pending'
                                        ? 'bg-amber-100 text-amber-700'
                                        : token.status === 'scanned'
                                          ? 'bg-blue-100 text-blue-700'
                                          : token.status === 'ready'
                                            ? 'bg-emerald-100 font-black text-emerald-700'
                                            : token.status === 'completed'
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                                {token.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <Loader2
                                        className={`h-5 w-5 text-emerald-600 ${token.status === 'pending' || token.status === 'scanned' ? 'animate-spin' : ''}`}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                                        Instructions
                                    </p>
                                    <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                                        {token.status === 'pending' &&
                                            'Waiting for receiver to scan...'}
                                        {token.status === 'scanned' &&
                                            (goal === 'sender_pay'
                                                ? 'Receiver is entering amount...'
                                                : `Scanned by ${token.to_account?.user?.name || 'Receiver'}`)}
                                        {token.status === 'ready' &&
                                            `Review amount from ${token.to_account?.user?.name || 'Receiver'}`}
                                        {token.status === 'completed' &&
                                            'Transaction finished.'}
                                    </p>
                                </div>
                            </div>

                            {/* Confirm/Decline Button for Sender (Standard) */}
                            {goal === 'sender' &&
                                token.status === 'scanned' && (
                                    <div className="flex w-full gap-3">
                                        <motion.button
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={handleCancel}
                                            className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Decline
                                        </motion.button>
                                        <motion.button
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={() => {
                                                axios
                                                    .post(`/qr/confirm/${id}`)
                                                    .then(() => {
                                                        toast.success(
                                                            'Transfer confirmed!',
                                                        );
                                                        setToken((prev) => ({
                                                            ...prev,
                                                            status: 'completed',
                                                        }));
                                                    })
                                                    .catch((err) => {
                                                        toast.error(
                                                            err.response?.data
                                                                ?.message ||
                                                                'Transfer failed',
                                                        );
                                                    });
                                            }}
                                            className="flex-1 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-500 active:scale-95"
                                        >
                                            Confirm Transfer
                                        </motion.button>
                                    </div>
                                )}

                            {/* Approve/Decline Button for Sender (Quick Pay) */}
                            {goal === 'sender_pay' &&
                                token.status === 'ready' && (
                                    <div className="flex w-full gap-3">
                                        <motion.button
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={handleCancel}
                                            className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Decline
                                        </motion.button>
                                        <motion.button
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={() => {
                                                axios
                                                    .post(`/qr/approve/${id}`)
                                                    .then(() => {
                                                        toast.success(
                                                            'Transaction approved!',
                                                        );
                                                        setToken((prev) => ({
                                                            ...prev,
                                                            status: 'completed',
                                                        }));
                                                    })
                                                    .catch((err) => {
                                                        toast.error(
                                                            err.response?.data
                                                                ?.message ||
                                                                'Approval failed',
                                                        );
                                                    });
                                            }}
                                            className="flex-1 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-500 active:scale-95"
                                        >
                                            Approve Transfer
                                        </motion.button>
                                    </div>
                                )}

                            {/* Cancel button while pending/scanned (but not yet ready/completed) */}
                            {(token.status === 'pending' ||
                                (token.status === 'scanned' &&
                                    goal === 'sender_pay')) && (
                                <button
                                    onClick={handleCancel}
                                    className="w-full rounded-2xl border border-slate-200 py-3 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                >
                                    Cancel Transaction
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <button
                        onClick={copyToClipboard}
                        className="flex flex-1 items-center justify-center py-3 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400"
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                    </button>
                    <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <button className="flex flex-1 items-center justify-center py-3 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </button>
                </div>
            </motion.div>

            {/* Anti-Fraud Banner */}
            <div className="mt-8 flex items-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                <ShieldCheck className="mr-2 h-3 w-3 text-emerald-500" />
                Secured by AtlasPay Anti-Fraud Protocol
            </div>
        </div>
    );
}
