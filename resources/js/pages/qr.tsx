import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { Camera, QrCode, Zap, Shield, ArrowLeft, Info, Copy, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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
            toast.error("Please specify an amount first.");
            return;
        }
        const t = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        setToken(JSON.stringify({ t, amount: amount || null, note: note || null }));
        toast.success("Encrypted token generated.");
    }

    const copyToClipboard = () => {
        if (!token) return;
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.info("Token copied to clipboard.");
    };

    async function startScanner() {
        if (typeof window === 'undefined') return;
        if (scanning) return;
        try {
            const mod = await import('html5-qrcode');
            const Html5Qrcode = (mod as any).Html5Qrcode;
            if (!Html5Qrcode) return;

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
                    toast.success("Scan successful!");
                },
                () => {}
            );

            setScanning(true);
        } catch (e) {
            console.error('QR scanner init error', e);
            toast.error("Could not access camera.");
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

            <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden pb-20">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] moroccan-pattern z-0" />
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full z-0" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full z-0" />

                <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 relative z-10">
                    {/* Breadcrumbs/Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Zap className="h-5 w-5 fill-current" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AtlasPay Protocol v4.2</span>
                            </div>
                            <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl uppercase">
                                QR <span className="text-primary italic">Vault.</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium">
                                Military-grade encryption for instant peer-to-peer and merchant settlements across the Atlas ecosystem.
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline" className="h-12 rounded-2xl gap-2 border-border/50 bg-card/50 backdrop-blur-md hover:bg-accent group px-6 shadow-soft">
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                <span className="font-bold">Return to Dashboard</span>
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Main Interface */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-3xl bg-card border border-border/50 shadow-elevated overflow-hidden glass-card"
                            >
                                {/* Tab Switcher */}
                                <div className="p-2 flex bg-muted/30 border-b border-border/50">
                                    {(['send', 'request', 'merchant'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTab(t)}
                                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${
                                                tab === t ? 'bg-background text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 md:p-6 md:p-8 space-y-10">
                                    <div className="grid gap-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction Volume (MAD)</label>
                                                <Info className="h-3 w-3 text-muted-foreground/50" />
                                            </div>
                                            <div className="relative group">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary font-black text-lg transition-colors">DH</span>
                                                <input 
                                                    type="number" 
                                                    inputMode="numeric" 
                                                    value={amount} 
                                                    onChange={(e) => setAmount(e.target.value)} 
                                                    className="w-full h-20 rounded-3xl bg-muted/20 border border-border/50 pl-16 pr-6 font-display text-3xl font-black focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-muted-foreground/30" 
                                                    placeholder="0.00" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Immutable Ledger Memo</label>
                                            <input 
                                                value={note} 
                                                onChange={(e) => setNote(e.target.value)} 
                                                className="w-full h-14 rounded-2xl bg-muted/20 border border-border/50 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-muted-foreground/30" 
                                                placeholder="e.g. Settlement for sovereign assets..." 
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                            <Button 
                                                className="h-16 w-full sm:flex-1 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-elevated group"
                                                onClick={generateOneTimeToken}
                                            >
                                                <QrCode className="mr-3 h-5 w-5 transition-transform group-hover:scale-110"/> Sign & Generate Token
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="h-16 w-full sm:w-auto px-8 rounded-2xl border-border/50 bg-background font-bold text-xs"
                                                onClick={() => { setAmount(''); setNote(''); setToken(''); }}
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
                                                className="pt-10 border-t border-border/50"
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Generated Encrypted Token</p>
                                                <div className="flex flex-col md:flex-row items-center gap-6">
                                                    <div className="relative group p-8 bg-white rounded-3xl shadow-elevated transition-transform hover:scale-105">
                                                        <div className="absolute inset-0 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all rounded-3xl" />
                                                        <div className="relative z-10">
                                                            <QRCodeCanvas 
                                                                value={token} 
                                                                size={240} 
                                                                bgColor="#FFFFFF" 
                                                                fgColor="#000000" 
                                                                level="H"
                                                                includeMargin={false}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6 max-w-sm text-center md:text-left flex-1">
                                                        <div className="space-y-2">
                                                            <p className="text-xl font-black tracking-tight text-foreground">Sovereign Sign-off</p>
                                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                                This token is cryptographically tied to your vault. It will expire in 10 minutes or upon first settlement.
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full">
                                                                <Shield className="h-3.5 w-3.5" /> RSA-4096 Active
                                                            </div>
                                                            <button 
                                                                onClick={copyToClipboard}
                                                                className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors"
                                                            >
                                                                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                                                                {copied ? 'Copied' : 'Copy Hash'}
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
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-3xl bg-card border border-border/50 shadow-soft p-8 relative overflow-hidden glass-card"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
                                    <Camera className="h-32 w-32" />
                                </div>
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Camera className="h-4 w-4" />
                                            </div>
                                            <h3 className="font-display text-xl font-black uppercase tracking-tight">Active Scan</h3>
                                        </div>
                                        <Button 
                                            variant={scanning ? "destructive" : "primary"} 
                                            size="sm" 
                                            className="rounded-xl text-[9px] font-black uppercase tracking-widest px-4"
                                            onClick={() => (scanning ? stopScanner() : startScanner())}
                                        >
                                            {scanning ? 'Shutdown' : 'Activate Camera'}
                                        </Button>
                                    </div>

                                    <div className="aspect-square w-full rounded-2xl bg-muted/30 border border-border/50 overflow-hidden relative group shadow-inner">
                                        <div id="qr-reader" className="w-full h-full object-cover" />
                                        {!scanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md transition-all group-hover:bg-background/30">
                                                <div className="p-6 rounded-full bg-background/50 mb-4 shadow-soft">
                                                    <Camera className="h-12 w-12 text-muted-foreground/30" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Optics Offline</p>
                                            </div>
                                        )}
                                        {scanning && (
                                            <>
                                                <div className="absolute inset-0 border-[10px] border-primary/20 rounded-2xl pointer-events-none z-20" />
                                                <motion.div 
                                                    animate={{ y: [0, 200, 0] }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                    className="absolute top-0 left-0 w-full h-1 bg-primary/40 blur-sm z-20"
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Decrypted Output</p>
                                        <div className="rounded-2xl bg-muted/20 p-6 border border-border/50 min-h-[80px] flex items-center justify-center transition-all hover:border-primary/30">
                                            {lastScan ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Check className="h-5 w-5 text-success" />
                                                    <p className="text-xs font-mono font-bold break-all text-center">{lastScan}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.2em]">Ready for signal...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-elevated relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 moroccan-pattern opacity-10" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-white/20">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sovereign Safety</span>
                                    </div>
                                    <h4 className="font-display text-2xl font-black leading-tight">Every transaction is immutable and verified by your biometric profile.</h4>
                                    <p className="text-xs font-bold opacity-80 leading-relaxed uppercase tracking-widest">
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

