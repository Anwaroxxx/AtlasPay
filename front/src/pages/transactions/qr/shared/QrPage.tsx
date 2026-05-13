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
    X,
    TrendingUp,
    Lock,
    RefreshCcw,
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
                    color: '#76b182', // AtlasPay Primary
                    type: 'rounded',
                },
                backgroundOptions: {
                    color: 'transparent',
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 10,
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: '#1a1a1a',
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
        toast.success('Payment link copied to clipboard.');
    };

    const handleCancel = () => {
        axios
            .post(`/qr/cancel/${id}`)
            .then(() => {
                toast.success('Transaction cancelled successfully.');
                setToken((prev) => ({ ...prev, status: 'cancelled' }));
            })
            .catch(() => {
                toast.error('Failed to cancel transaction.');
            });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
            <Head title="Secure Transaction" />
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />

            <Link
                href="/transfer"
                className="group absolute top-8 left-8 z-10 flex items-center gap-2 text-xs font-black tracking-widest text-muted-foreground uppercase transition-all hover:text-primary"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary/30 group-hover:bg-primary/5">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                Return
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                {/* Main Card */}
                <div className="shadow-elevated overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-3xl">
                    <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.02]" />

                    {/* Header */}
                    <div className="relative border-b border-border/50 p-8 text-center">
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        >
                            <ShieldCheck className="h-8 w-8" />
                        </motion.div>
                        
                        <h1 className="font-display text-2xl font-black tracking-tighter text-foreground uppercase">
                            {goal === 'sender' && 'Send Payment'}
                            {goal === 'sender_pay' && 'Quick Pay'}
                            {goal === 'receiver' && 'Receive Payment'}
                            {goal === 'store' && 'Merchant Link'}
                        </h1>
                        
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    {countdown}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${
                                token.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                token.status === 'completed' ? 'bg-primary/10 text-primary' :
                                'bg-muted/50 text-muted-foreground'
                            }`}>
                                <RefreshCcw className={`h-3 w-3 ${token.status === 'pending' ? 'animate-spin' : ''}`} />
                                <span className="text-[10px] font-black tracking-widest uppercase">
                                    {token.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {token.amount && (
                            <div className="mb-10 text-center">
                                <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60">
                                    Transaction Amount
                                </p>
                                <div className="font-display text-5xl font-black tracking-tighter text-foreground">
                                    {new Intl.NumberFormat('fr-MA', {
                                        minimumFractionDigits: 2,
                                    }).format(parseFloat(token.amount))}
                                    <span className="ml-2 text-xl opacity-40">MAD</span>
                                </div>
                            </div>
                        )}

                        {/* QR Code */}
                        <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center rounded-[2rem] bg-white p-5 shadow-inner">
                            <div ref={qrRef} className="relative z-10" />
                            
                            <AnimatePresence>
                                {(token.status === 'expired' || token.status === 'cancelled') && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-2 z-20 flex flex-col items-center justify-center rounded-[1.8rem] bg-white/90 backdrop-blur-sm"
                                    >
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                            <AlertCircle className="h-8 w-8" />
                                        </div>
                                        <p className="font-display text-lg font-black tracking-tight text-foreground uppercase">
                                            {token.status === 'expired' ? 'Link Expired' : 'Cancelled'}
                                        </p>
                                        <Link
                                            href="/transfer"
                                            className="mt-6 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-colors"
                                        >
                                            Try Again
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-10 space-y-4">
                            {/* Action Buttons */}
                            {goal === 'sender' && token.status === 'scanned' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 rounded-2xl border border-border bg-card py-4 text-xs font-black tracking-widest text-foreground uppercase transition-all hover:bg-muted active:scale-95"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => {
                                            axios.post(`/qr/confirm/${id}`)
                                                .then(() => {
                                                    toast.success('Transfer authorized successfully.');
                                                    setToken(prev => ({ ...prev, status: 'completed' }));
                                                })
                                                .catch(err => toast.error(err.response?.data?.message || 'Transfer failed.'));
                                        }}
                                        className="flex-[2] rounded-2xl bg-primary py-4 text-xs font-black tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            )}

                            {goal === 'sender_pay' && token.status === 'ready' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 rounded-2xl border border-border bg-card py-4 text-xs font-black tracking-widest text-foreground uppercase transition-all hover:bg-muted active:scale-95"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => {
                                            axios.post(`/qr/approve/${id}`)
                                                .then(() => {
                                                    toast.success('Payment approved successfully.');
                                                    setToken(prev => ({ ...prev, status: 'completed' }));
                                                })
                                                .catch(err => toast.error(err.response?.data?.message || 'Approval failed.'));
                                        }}
                                        className="flex-[2] rounded-2xl bg-primary py-4 text-xs font-black tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                                    >
                                        Authorize
                                    </button>
                                </div>
                            )}

                            {/* Secondary Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border py-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase transition-all hover:border-primary/30 hover:text-primary active:scale-95"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy Link
                                </button>
                                <button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border py-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase transition-all hover:border-primary/30 hover:text-primary active:scale-95"
                                >
                                    <Share2 className="h-3.5 w-3.5" />
                                    Share
                                </button>
                            </div>

                            {token.status === 'pending' && (
                                <button
                                    onClick={handleCancel}
                                    className="w-full text-center text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase hover:text-destructive transition-colors"
                                >
                                    Cancel Transaction
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase opacity-40">
                    <Lock className="h-3 w-3" />
                    End-to-End Encrypted
                </div>
            </motion.div>

            {/* Success Overlay */}
            <AnimatePresence>
                {token.status === 'completed' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md text-center"
                        >
                            <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/30">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h2 className="font-display mb-4 text-4xl font-black tracking-tighter text-foreground uppercase">
                                Transaction <br /> Success
                            </h2>
                            <p className="mb-12 text-sm font-medium leading-relaxed text-muted-foreground opacity-60">
                                Your digital currency transfer has been <br /> 
                                processed and settled on the network.
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-block w-full rounded-2xl bg-foreground py-5 text-xs font-black tracking-widest text-background transition-all hover:opacity-90 active:scale-95"
                            >
                                Return to Dashboard
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

