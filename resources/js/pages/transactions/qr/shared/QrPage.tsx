import React, { useEffect, useState, useRef } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  Share2
} from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { toast } from "sonner";

interface QrToken {
    id: number;
    token: string;
    amount: string | null;
    status: 'pending' | 'scanned' | 'ready' | 'completed' | 'expired' | 'cancelled';
    goal: 'sender' | 'receiver' | 'store';
    from_account?: { user: { name: string } };
    to_account?: { user: { name: string } };
    expires_at: string;
}

interface Props {
    id: string; // Encrypted token for URL
    token: QrToken;
    goal: string;
    appUrl: string;
}

export default function QrPage({ id, token: initialToken, goal, appUrl }: Props) {
    const { auth } = usePage<any>().props;
    const [token, setToken] = useState<QrToken>(initialToken);
    const [countdown, setCountdown] = useState("");
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrCode] = useState(() => new QRCodeStyling({
        width: 280,
        height: 280,
        dotsOptions: {
            color: "#10b981", // Emerald 500
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: "#065f46"
        }
    }));

    const isCreator = auth.wallet && token.created_by_account_id === auth.wallet.id;

    // Generate scan URL
    const scanUrl = `${appUrl}/qr/redirect/${id}`;

    useEffect(() => {
        if (qrRef.current) {
            qrCode.append(qrRef.current);
        }
        qrCode.update({ data: scanUrl });
    }, [scanUrl, qrCode]);

    // Real-time status updates + Polling Fallback
    useEffect(() => {
        const channel = (window as any).Echo.channel(`qr-token.${token.token}`)
            .listen('QrTokenStatusUpdated', (e: any) => {
                setToken(prev => ({ ...prev, status: e.status }));
            });

        // Polling fallback every 2 seconds
        const pollInterval = setInterval(() => {
            if (token.status === 'completed' || token.status === 'expired') return;
            
            axios.get(`/qr/status/${token.token}`)
                .then(res => {
                    if (res.data.status !== token.status) {
                        setToken(prev => ({ ...prev, ...res.data.token, status: res.data.status }));
                    }
                })
                .catch(() => {});
        }, 2000);

        return () => {
            (window as any).Echo.leave(`qr-token.${token.token}`);
            clearInterval(pollInterval);
        };
    }, [token.token, token.status]);

    // Countdown timer
    useEffect(() => {
        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            // Replace space with T and add Z to force UTC parsing
            const expiry = new Date(token.expires_at.replace(' ', 'T') + 'Z').getTime();
            const distance = expiry - now;

            if (distance < 0) {
                setCountdown("EXPIRED");
                setToken(prev => ({ ...prev, status: 'expired' }));
                clearInterval(countdownTimer);
                return;
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, [token.expires_at]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(scanUrl);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Head title="Secure QR Payment" />
            
            <Link 
                href="/dashboard" 
                className="absolute top-6 left-6 flex items-center text-slate-500 hover:text-emerald-600 transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                {/* Header Section */}
                <div className="bg-emerald-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-900/20 rounded-full blur-2xl" />
                    
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4"
                    >
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h1 className="text-xl font-bold mb-1">
                        {goal === 'sender' ? 'Sending Money' : 'Requesting Payment'}
                    </h1>
                    <p className="text-emerald-100 text-sm flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Expires in: <span className="font-mono ml-1 font-bold">{countdown}</span>
                    </p>
                </div>

                {/* Main Body */}
                <div className="p-8 flex flex-col items-center">
                    {/* Amount Display */}
                    {token.amount && (
                        <div className="mb-8 text-center">
                            <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Amount to {goal === 'sender' ? 'Send' : 'Receive'}</span>
                            <div className="text-4xl font-black text-slate-800 dark:text-white mt-1">
                                {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(parseFloat(token.amount))}
                            </div>
                        </div>
                    )}

                    {/* QR Code Container */}
                    <div className="relative group">
                        <motion.div 
                            animate={token.status === 'expired' ? { opacity: 0.5, filter: 'grayscale(1)' } : {}}
                            className="p-4 bg-white rounded-3xl shadow-inner border-4 border-emerald-50 dark:border-emerald-950"
                        >
                            <div ref={qrRef} />
                        </motion.div>

                        <AnimatePresence>
                            {token.status === 'expired' && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center rounded-3xl"
                                >
                                    <AlertCircle className="w-16 h-16 text-rose-500 mb-2" />
                                    <span className="font-bold text-rose-600">QR Code Expired</span>
                                    <Link href={window.location.pathname} className="mt-4 text-xs bg-slate-800 text-white px-4 py-2 rounded-full">Try Again</Link>
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
                                className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                            >
                                <motion.div 
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-2xl border border-emerald-500/20"
                                >
                                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Transfer Complete!</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed">
                                        The funds have been successfully moved to the recipient's account.
                                    </p>
                                    <Link 
                                        href="/dashboard"
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 inline-block"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Text */}
                    <div className="mt-8 w-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Transaction Status</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-tight ${
                                token.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                token.status === 'scanned' ? 'bg-blue-100 text-blue-700' :
                                token.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {token.status}
                            </span>
                        </div>
                        
                                <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center space-x-4 border border-slate-100 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                    <Loader2 className={`w-5 h-5 text-emerald-600 ${token.status === 'pending' ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Instructions</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                        {token.status === 'pending' && "Waiting for receiver to scan..."}
                                        {token.status === 'scanned' && `Scanned by ${token.to_account?.user?.name || 'Receiver'}`}
                                        {token.status === 'completed' && "Transaction finished."}
                                    </p>
                                </div>
                            </div>

                            {/* Confirm Button for Sender */}
                            {goal === 'sender' && token.status === 'scanned' && (
                                <motion.button
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={() => {
                                        axios.post(`/qr/confirm/${id}`).then(() => {
                                            toast.success("Transfer confirmed!");
                                            setToken(prev => ({ ...prev, status: 'completed' }));
                                        }).catch(err => {
                                            toast.error(err.response?.data?.message || "Transfer failed");
                                        });
                                    }}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                                >
                                    Confirm Transfer to {token.to_account?.user?.name}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button 
                        onClick={copyToClipboard}
                        className="flex-1 flex items-center justify-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                    <button 
                        className="flex-1 flex items-center justify-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </button>
                </div>
            </motion.div>

            {/* Anti-Fraud Banner */}
            <div className="mt-8 flex items-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <ShieldCheck className="w-3 h-3 mr-2 text-emerald-500" />
                Secured by AtlasPay Anti-Fraud Protocol
            </div>
        </div>
    );
}
