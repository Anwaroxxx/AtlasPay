import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    QrCode,
    Zap,
    Shield,
    ArrowLeft,
    Info,
    Copy,
    Check,
    RefreshCw,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function QRPage() {
    const [tab, setTab] = useState<'send' | 'request' | 'merchant'>('send');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [token, setToken] = useState('');
    const [scanning, setScanning] = useState(false);
    const [lastScan, setLastScan] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const html5Ref = useRef<any>(null);

    function generateOneTimeToken() {
        if (!amount) {
            toast.error('Please specify an amount first.');

            return;
        }

        const t = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        setToken(
            JSON.stringify({ t, amount: amount || null, note: note || null }),
        );
        toast.success('Encrypted token generated.');
    }

    const copyToClipboard = () => {
        if (!token) {
            return;
        }

        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.info('Token copied to clipboard.');
    };

    async function startScanner() {
        if (typeof window === 'undefined') {
            return;
        }

        if (scanning) {
            return;
        }

        try {
            const mod = await import('html5-qrcode');
            const Html5Qrcode = (mod as any).Html5Qrcode;

            if (!Html5Qrcode) {
                return;
            }

            const containerId = 'qr-reader';
            const qr = new Html5Qrcode(containerId);
            html5Ref.current = qr;

            await qr.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 280, height: 280 } },
                (decoded: string) => {
                    setLastScan(decoded);
                    qr.stop().catch(() => {});
                    setScanning(false);
                    toast.success('Scan successful!');
                },
                () => {},
            );

            setScanning(true);
        } catch (e) {
            console.error('QR scanner init error', e);
            toast.error('Could not access camera.');
        }
    }

    async function stopScanner() {
        if (html5Ref.current && html5Ref.current.stop) {
            try {
                await html5Ref.current.stop();
            } catch (e) {}

            html5Ref.current = null;
        }

        setScanning(false);
    }

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <>
            <Head title="Sovereign QR Gateway" />

            <div className="relative min-h-screen w-full overflow-hidden bg-background pb-20 text-foreground">
                {/* Decorative Background Elements */}
                <div className="moroccan-pattern pointer-events-none absolute top-0 left-0 z-0 h-full w-full opacity-[0.03]" />
                <div className="absolute top-[-10%] right-[-10%] z-0 h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-primary/5 blur-[100px]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-8">
                    {/* Breadcrumbs/Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-center"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <div className="rounded-lg bg-primary/10 p-1.5">
                                    <Zap className="h-5 w-5 fill-current" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                                    AtlasPay Protocol v4.2
                                </span>
                            </div>
                            <h1 className="font-display text-4xl font-black tracking-tight uppercase md:text-6xl">
                                QR{' '}
                                <span className="text-primary italic">
                                    Vault.
                                </span>
                            </h1>
                            <p className="max-w-xl text-sm font-medium text-muted-foreground md:text-base">
                                Military-grade encryption for instant
                                peer-to-peer and merchant settlements across the
                                Atlas ecosystem.
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                className="group shadow-soft h-12 gap-2 rounded-2xl border-border/50 bg-card/50 px-6 backdrop-blur-md hover:bg-accent"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                <span className="font-bold">
                                    Return to Dashboard
                                </span>
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Main Interface */}
                        <div className="space-y-8 lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="shadow-elevated glass-card overflow-hidden rounded-3xl border border-border/50 bg-card"
                            >
                                {/* Tab Switcher */}
                                <div className="flex border-b border-border/50 bg-muted/30 p-2">
                                    {(
                                        ['send', 'request', 'merchant'] as const
                                    ).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTab(t)}
                                            className={`flex-1 rounded-2xl py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                                                tab === t
                                                    ? 'shadow-soft bg-background text-primary'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-10 p-4 md:p-8">
                                    <div className="grid gap-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                                    Transaction Volume (MAD)
                                                </label>
                                                <Info className="h-3 w-3 text-muted-foreground/50" />
                                            </div>
                                            <div className="group relative">
                                                <span className="absolute top-1/2 left-6 -translate-y-1/2 text-lg font-black text-muted-foreground transition-colors group-focus-within:text-primary">
                                                    DH
                                                </span>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    value={amount}
                                                    onChange={(e) =>
                                                        setAmount(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-20 w-full rounded-3xl border border-border/50 bg-muted/20 pr-6 pl-16 font-display text-3xl font-black transition-all placeholder:text-muted-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/5"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                                Immutable Ledger Memo
                                            </label>
                                            <input
                                                value={note}
                                                onChange={(e) =>
                                                    setNote(e.target.value)
                                                }
                                                className="h-14 w-full rounded-2xl border border-border/50 bg-muted/20 px-6 text-sm font-bold transition-all placeholder:text-muted-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/5"
                                                placeholder="e.g. Settlement for sovereign assets..."
                                            />
                                        </div>

                                        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
                                            <Button
                                                className="shadow-elevated group h-16 w-full rounded-2xl bg-primary text-[10px] font-black tracking-[0.2em] text-primary-foreground uppercase sm:flex-1"
                                                onClick={generateOneTimeToken}
                                            >
                                                <QrCode className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />{' '}
                                                Sign & Generate Token
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 w-full rounded-2xl border-border/50 bg-background px-8 text-xs font-bold sm:w-auto"
                                                onClick={() => {
                                                    setAmount('');
                                                    setNote('');
                                                    setToken('');
                                                }}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Clear
                                            </Button>
                                        </div>
                                    </div>

                                    {/* QR Display Area */}
                                    <AnimatePresence>
                                        {token && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="border-t border-border/50 pt-10"
                                            >
                                                <p className="mb-6 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                                    Generated Encrypted Token
                                                </p>
                                                <div className="flex flex-col items-center gap-6 md:flex-row">
                                                    <div className="group shadow-elevated relative rounded-3xl bg-white p-8 transition-transform hover:scale-105">
                                                        <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
                                                        <div className="relative z-10">
                                                            <QRCodeCanvas
                                                                value={token}
                                                                size={240}
                                                                bgColor="#FFFFFF"
                                                                fgColor="#000000"
                                                                level="H"
                                                                includeMargin={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-w-sm flex-1 space-y-6 text-center md:text-left">
                                                        <div className="space-y-2">
                                                            <p className="text-xl font-black tracking-tight text-foreground">
                                                                Sovereign
                                                                Sign-off
                                                            </p>
                                                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                                This token is
                                                                cryptographically
                                                                tied to your
                                                                vault. It will
                                                                expire in 10
                                                                minutes or upon
                                                                first
                                                                settlement.
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                                            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                                                                <Shield className="h-3.5 w-3.5" />{' '}
                                                                RSA-4096 Active
                                                            </div>
                                                            <button
                                                                onClick={
                                                                    copyToClipboard
                                                                }
                                                                className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                                                            >
                                                                {copied ? (
                                                                    <Check className="h-3.5 w-3.5 text-success" />
                                                                ) : (
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                )}
                                                                {copied
                                                                    ? 'Copied'
                                                                    : 'Copy Hash'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        {/* Scanner & Side Info */}
                        <div className="space-y-8 lg:col-span-5">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="shadow-soft glass-card relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8"
                            >
                                <div className="absolute top-0 right-0 p-8 text-primary opacity-5">
                                    <Camera className="h-32 w-32" />
                                </div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Camera className="h-4 w-4" />
                                            </div>
                                            <h3 className="font-display text-xl font-black tracking-tight uppercase">
                                                Active Scan
                                            </h3>
                                        </div>
                                        <Button
                                            variant={
                                                scanning
                                                    ? 'destructive'
                                                    : 'primary'
                                            }
                                            size="sm"
                                            className="rounded-xl px-4 text-[9px] font-black tracking-widest uppercase"
                                            onClick={() =>
                                                scanning
                                                    ? stopScanner()
                                                    : startScanner()
                                            }
                                        >
                                            {scanning
                                                ? 'Shutdown'
                                                : 'Activate Camera'}
                                        </Button>
                                    </div>

                                    <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-inner">
                                        <div
                                            id="qr-reader"
                                            className="h-full w-full object-cover"
                                        />
                                        {!scanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md transition-all group-hover:bg-background/30">
                                                <div className="shadow-soft mb-4 rounded-full bg-background/50 p-6">
                                                    <Camera className="h-12 w-12 text-muted-foreground/30" />
                                                </div>
                                                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                                                    Optics Offline
                                                </p>
                                            </div>
                                        )}
                                        {scanning && (
                                            <>
                                                <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-[10px] border-primary/20" />
                                                <motion.div
                                                    animate={{ y: [0, 200, 0] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 3,
                                                        ease: 'linear',
                                                    }}
                                                    className="absolute top-0 left-0 z-20 h-1 w-full bg-primary/40 blur-sm"
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                            Decrypted Output
                                        </p>
                                        <div className="flex min-h-[80px] items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-primary/30">
                                            {lastScan ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Check className="h-5 w-5 text-success" />
                                                    <p className="text-center font-mono text-xs font-bold break-all">
                                                        {lastScan}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">
                                                    Ready for signal...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="shadow-elevated group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground"
                            >
                                <div className="moroccan-pattern absolute inset-0 opacity-10" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white/20 p-1.5">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                                            Sovereign Safety
                                        </span>
                                    </div>
                                    <h4 className="font-display text-2xl leading-tight font-black">
                                        Every transaction is immutable and
                                        verified by your biometric profile.
                                    </h4>
                                    <p className="text-xs leading-relaxed font-bold tracking-widest uppercase opacity-80">
                                        AtlasPay Protocol v4.2
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
