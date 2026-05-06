import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowUpRight, 
    QrCode, 
    CreditCard, 
    Wallet,
    Send,
    AlertCircle,
    CheckCircle2,
    Zap,
    Shield,
    Building2,
    Hash,
    Loader2,
    ArrowRight,
    Camera,
    Smartphone,
    ScanLine,
    Lock,
    Timer,
    ArrowDownLeft,
    Store,
    Users,
    Receipt,
    Split,
    RefreshCw,
    ShieldCheck,
    X,
    Info,
    Utensils,
    Car,
    Home,
    ShoppingBag,
    Ticket,
    HeartPulse
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QrScanner from '@/components/transactions/qr/QrScanner';
import axios from 'axios';

interface Account {
    id: number;
    account_number: string;
    balance: number;
    type: string;
    currency: string;
    status: string;
}

interface Props {
    accounts: Account[];
}

type TransferMethod = 'bank' | 'qr' | 'card';
type QRFlow = 'send' | 'request' | 'merchant' | 'scanner';

const methodConfig = {
    bank: {
        label: 'Bank Transfer',
        icon: Building2,
        description: 'Standard RIB Transfer',
        action: '/transfer/bank',
    },
    qr: {
        label: 'QR Payment',
        icon: QrCode,
        description: 'Instant Scan & Pay',
        action: '/transfer/qr',
    },
    card: {
        label: 'Card Transfer',
        icon: CreditCard,
        description: 'Direct Card Remittance',
        action: '/transfer/card',
    },
};

export function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    data, 
    processing 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void; 
    data: any;
    processing: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden"
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tight">Confirm <span className="text-primary italic">Transfer.</span></h3>
                        <p className="text-muted-foreground font-medium">Please verify the transaction details before deployment.</p>
                    </div>

                    <div className="space-y-4 rounded-3xl bg-muted/30 p-6 border border-border/50">
                        <div className="flex justify-between items-center border-b border-border/50 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</span>
                            <span className="text-2xl font-black">{Number(data.amount).toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-border/50 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">To RIB/Card</span>
                            <span className="text-xs font-mono font-bold tracking-tighter">{data.to_account_rib || 'Instant QR'}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" onClick={onClose} className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest border-2">Cancel</Button>
                        <Button 
                            onClick={onConfirm} 
                            disabled={processing}
                            className="flex-1 h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg group"
                        >
                            {processing ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Confirm <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Transfer({ accounts }: Props) {
    const [activeMethod, setActiveMethod] = useState<TransferMethod>('bank');
    const [qrFlow, setQrFlow] = useState<QRFlow>('send');
    const [isScanning, setIsScanning] = useState(false);
    const [qrStep, setQrStep] = useState<'input' | 'generated' | 'processing' | 'confirmed'>('input');
    const [expiryTime, setExpiryTime] = useState(300); // 5 minutes in seconds
    const [showConfirm, setShowConfirm] = useState(false);
    
    const { props } = usePage();
    const auth = (props as any).auth;
    const pageErrors = (props as any).errors;

    const { data, setData, post, processing, errors, reset } = useForm({
        from_account_rib: accounts[0]?.account_number || '',
        to_account_rib: '',
        amount: '',
        category: 'Remittance',
        request_note: '',
        split_count: '1',
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Echo && auth?.user) {
            const channel = `App.Models.User.${auth.user.id}`;
            (window as any).Echo.private(channel)
                .listen('.transaction.created', (e: any) => {
                    router.reload({ only: ['accounts'] });
                });

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth?.user?.id]);

    useEffect(() => {
        let timer: any;
        if (qrStep === 'generated' && expiryTime > 0) {
            timer = setInterval(() => setExpiryTime(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [qrStep, expiryTime]);

    useEffect(() => {
        if (pageErrors?.message) {
            toast.error(pageErrors.message);
        }
    }, [pageErrors]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const config = methodConfig[activeMethod];
    const selectedAccount = accounts.find(a => a.account_number === data.from_account_rib);

    const handleConfirm = () => {
        setShowConfirm(false);
        post(config.action, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transaction successful.');
                reset();
                setQrStep('confirmed');
            },
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.from_account_rib) {
            toast.error('Please select a source account.');
            return;
        }
        if (!data.to_account_rib && activeMethod !== 'qr') {
            toast.error('Recipient details are required.');
            return;
        }
        if (!data.amount || Number(data.amount) <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        if (activeMethod === 'qr') {
            if (qrFlow === 'send') {
                router.post('/qr/create/sender', { amount: data.amount });
                return;
            }
            if (qrFlow === 'request') {
                router.post('/qr/create/receiver', { amount: data.amount });
                return;
            }
            if (qrFlow === 'merchant') {
                router.post('/qr/create/store', { amount: data.amount });
                return;
            }
        }

        setShowConfirm(true);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Send Money" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-6 p-6 md:p-6 md:p-8 max-w-7xl mx-auto w-full relative"
            >
                <ConfirmationModal 
                    isOpen={showConfirm} 
                    onClose={() => setShowConfirm(false)} 
                    onConfirm={handleConfirm}
                    data={data}
                    processing={processing}
                />
                {/* Header */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Send className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Remittance</span>
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter text-foreground md:text-6xl uppercase leading-none">
                        Send <span className="text-primary italic">Money.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium">
                        Fast and secure money transfers. Choose your preferred method and send funds across the AtlasPay network.
                    </p>
                </motion.div>

                {/* Method Selector */}
                <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {(Object.keys(methodConfig) as TransferMethod[]).map((method) => {
                        const cfg = methodConfig[method];
                        const isActive = activeMethod === method;
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={method}
                                onClick={() => {
                                    setActiveMethod(method);
                                    setQrStep('input');
                                    setIsScanning(false);
                                }}
                                className={`group relative flex items-center gap-5 rounded-3xl p-8 transition-all duration-500 text-left border overflow-hidden ${
                                    isActive 
                                    ? 'bg-card border-primary shadow-elevated' 
                                    : 'bg-card/30 border-border/50 hover:border-primary/30 text-muted-foreground'
                                }`}
                            >
                                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 shadow-soft ${
                                    isActive 
                                    ? 'bg-primary text-primary-foreground scale-110' 
                                    : 'bg-muted text-muted-foreground group-hover:bg-accent'
                                }`}>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-lg font-black tracking-tight uppercase ${isActive ? 'text-foreground' : ''}`}>{cfg.label}</p>
                                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">{cfg.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main UI Section */}
                    <motion.div variants={item} className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {activeMethod === 'qr' ? (
                                <motion.div
                                    key="qr-flows"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-10"
                                >
                                    {/* QR Flow Selector */}
                                    <div className="flex flex-wrap gap-4 p-2 rounded-2xl bg-muted/20 border border-border/50">
                                        {[
                                            { id: 'send', label: 'Send', icon: Send },
                                            { id: 'request', label: 'Request', icon: ArrowDownLeft },
                                            { id: 'merchant', label: 'Merchant', icon: Store },
                                            { id: 'scanner', label: 'Scan', icon: Camera }
                                        ].map((flow) => (
                                            <button
                                                key={flow.id}
                                                onClick={() => {
                                                    setQrFlow(flow.id as QRFlow);
                                                    setQrStep('input');
                                                    setIsScanning(flow.id === 'scanner');
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    qrFlow === flow.id 
                                                    ? 'bg-primary text-primary-foreground shadow-lg' 
                                                    : 'hover:bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <flow.icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">{flow.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* QR Flow UI */}
                                    <Card className="border-none shadow-elevated rounded-3xl overflow-hidden bg-card glass-card min-h-[500px] flex flex-col">
                                        <CardHeader className="p-6 border-b border-border bg-muted/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <QrCode className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-2xl font-black uppercase tracking-tight">
                                                            {qrFlow === 'send' && 'Send via QR'}
                                                            {qrFlow === 'request' && 'Request Payment'}
                                                            {qrFlow === 'merchant' && 'Merchant QR'}
                                                            {qrFlow === 'scanner' && 'Scan QR'}
                                                        </CardTitle>
                                                        <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">
                                                            {qrFlow === 'send' && 'Generate a one-time payment token'}
                                                            {qrFlow === 'request' && 'Create a payment link for others'}
                                                            {qrFlow === 'merchant' && 'Your permanent business identifier'}
                                                            {qrFlow === 'scanner' && 'Point your camera at a code'}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {qrStep === 'generated' && (
                                                    <Badge className="bg-primary/20 text-primary border-none px-4 py-2 font-black">
                                                        <Timer className="h-3 w-3 mr-2" /> {formatTime(expiryTime)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                                            {qrFlow === 'scanner' ? (
                                                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-3xl overflow-hidden border-4 border-primary/30 group">
                                                    <QrScanner 
                                                        onResult={(result) => {
                                                            // result is the encrypted token URL or just the id
                                                            window.location.href = result;
                                                        }}
                                                    />
                                                </div>
                                            ) : qrStep === 'generated' ? (
                                                <div className="space-y-10 text-center flex flex-col items-center">
                                                    <div className="relative p-6 bg-white rounded-3xl shadow-elevated group">
                                                        <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
                                                        <QrCode className="h-64 w-64 text-neutral-900" />
                                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-3xl group-hover:border-primary/50 transition-colors" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="text-5xl font-black font-display tracking-tighter">{Number(data.amount).toLocaleString()} <span className="text-xl font-normal">MAD</span></p>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">One-time payment token</p>
                                                    </div>
                                                    <div className="flex gap-4 w-full">
                                                        <Button onClick={() => setQrStep('input')} variant="outline" className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest">Cancel</Button>
                                                        <Button className="flex-1 h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest"><RefreshCw className="h-5 w-5 mr-3" /> Refresh</Button>
                                                    </div>
                                                </div>
                                            ) : qrStep === 'confirmed' ? (
                                                <div className="text-center space-y-8 py-10">
                                                    <div className="h-32 w-32 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto scale-110">
                                                        <CheckCircle2 className="h-16 w-16" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-3xl font-black uppercase tracking-tight">Payment <span className="text-success italic">Complete.</span></h4>
                                                        <p className="text-muted-foreground font-medium">Transaction verified and settled instantly.</p>
                                                    </div>
                                                    <Button onClick={() => setQrStep('input')} className="h-16 px-10 rounded-2xl bg-success text-white font-black uppercase tracking-widest">Done</Button>
                                                </div>
                                            ) : (
                                                <form onSubmit={submit} className="space-y-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Source Account</Label>
                                                        <div className="grid gap-4">
                                                            {accounts.map(acc => (
                                                                <button
                                                                    key={acc.id}
                                                                    type="button"
                                                                    onClick={() => setData('from_account_rib', acc.account_number)}
                                                                    className={`p-6 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                                                        data.from_account_rib === acc.account_number ? 'bg-primary/5 border-primary ring-2 ring-primary/20' : 'bg-muted/10 border-border/50 hover:border-primary/30'
                                                                    }`}
                                                                >
                                                                    <div>
                                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{acc.type}</p>
                                                                        <p className="text-xl font-black tracking-tight">{acc.balance.toLocaleString()} MAD</p>
                                                                    </div>
                                                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${data.from_account_rib === acc.account_number ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'}`}>
                                                                        {data.from_account_rib === acc.account_number && <CheckCircle2 className="h-4 w-4" />}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount to {qrFlow === 'send' ? 'Send' : 'Request'}</Label>
                                                        <div className="relative">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">DH</div>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="h-24 pl-20 rounded-3xl bg-muted/20 border-border/50 text-5xl font-black font-display tracking-tighter focus:ring-primary/10 transition-all"
                                                                value={data.amount}
                                                                onChange={e => setData('amount', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {qrFlow === 'request' && (
                                                        <div className="grid gap-6 sm:grid-cols-2">
                                                            <div className="space-y-3">
                                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Note (Optional)</Label>
                                                                <Input 
                                                                    placeholder="Dinner, Taxi, etc." 
                                                                    className="h-16 rounded-2xl bg-muted/20 border-border/50 font-bold"
                                                                    value={data.request_note}
                                                                    onChange={e => setData('request_note', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Split with others</Label>
                                                                <div className="flex items-center gap-4 h-16 px-6 rounded-2xl bg-muted/20 border border-border/50">
                                                                    <Users className="h-5 w-5 text-muted-foreground" />
                                                                    <Input 
                                                                        type="number" 
                                                                        className="border-none bg-transparent font-black text-lg p-0 focus-visible:ring-0" 
                                                                        value={data.split_count}
                                                                        onChange={e => setData('split_count', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {qrFlow === 'merchant' ? (
                                                        <div className="p-6 bg-neutral-900 rounded-3xl text-center space-y-8 relative overflow-hidden">
                                                            <div className="absolute inset-0 moroccan-pattern opacity-[0.05]" />
                                                            <div className="relative z-10 space-y-6">
                                                                <div className="h-24 w-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto border-2 border-primary/30">
                                                                    <Store className="h-12 w-12 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-2xl font-black uppercase tracking-tight text-white">Your Business QR</h5>
                                                                    <p className="text-muted-foreground text-sm font-medium">Permanent link to your account</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-3xl inline-block shadow-lg">
                                                                    <QrCode className="h-40 w-40 text-neutral-900" />
                                                                </div>
                                                                <div className="flex gap-4">
                                                                    <Button className="flex-1 bg-primary text-white font-black uppercase tracking-widest h-14 rounded-xl">Download PDF</Button>
                                                                    <Button variant="outline" className="flex-1 border-white/20 text-white font-black uppercase tracking-widest h-14 rounded-xl">Share link</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button 
                                                            type="submit" 
                                                            className="w-full h-24 rounded-3xl bg-primary text-primary-foreground font-black text-2xl uppercase tracking-widest shadow-elevated group"
                                                            disabled={!data.amount || Number(data.amount) <= 0}
                                                        >
                                                            {qrFlow === 'send' ? 'Generate Token' : 'Generate Request'} <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-4" />
                                                        </Button>
                                                    )}
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form-ui"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="border-none shadow-elevated rounded-3xl overflow-hidden bg-card glass-card">
                                        <CardHeader className="p-6 border-b border-border bg-muted/20">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                                    <config.icon className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <CardTitle className="font-display text-2xl font-black uppercase tracking-tight">Transfer <span className="text-primary italic">Details.</span></CardTitle>
                                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">Fill in the transfer information below</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <form onSubmit={submit} className="space-y-10">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Source Account</Label>
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {accounts.map((account) => {
                                                            const isSelected = data.from_account_rib === account.account_number;
                                                            return (
                                                                <button
                                                                    key={account.id}
                                                                    type="button"
                                                                    onClick={() => setData('from_account_rib', account.account_number)}
                                                                    className={`group relative rounded-2xl p-6 text-left transition-all duration-500 border overflow-hidden ${
                                                                        isSelected
                                                                        ? 'bg-primary text-primary-foreground border-primary shadow-elevated scale-[1.02]'
                                                                        : 'bg-muted/30 border-border/50 hover:border-primary/30'
                                                                    }`}
                                                                >
                                                                    <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
                                                                    <div className="relative z-10">
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <Badge className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none ${
                                                                                isSelected 
                                                                                ? 'bg-white/20 text-white' 
                                                                                : 'bg-muted text-muted-foreground'
                                                                            }`}>
                                                                                {account.type}
                                                                            </Badge>
                                                                            {isSelected && <CheckCircle2 className="h-4 w-4" />}
                                                                        </div>
                                                                        <p className={`text-[10px] font-mono mb-2 tracking-tighter ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                                            {account.account_number}
                                                                        </p>
                                                                        <p className="text-2xl font-black font-display tracking-tight">
                                                                            {account.balance.toLocaleString()} <span className="text-xs font-normal opacity-60">{account.currency}</span>
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                        {activeMethod === 'bank' ? 'Recipient RIB' : 'Recipient Card Number'}
                                                    </Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center justify-center">
                                                            {activeMethod === 'bank' ? <Hash className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            placeholder={activeMethod === 'bank' ? "Enter 24-digit RIB" : "Enter 16-digit Card Number"}
                                                            className="h-16 pl-16 rounded-[1.5rem] bg-muted/20 border-border/50 text-base font-black tracking-tight focus:ring-primary/10 transition-all"
                                                            value={data.to_account_rib}
                                                            onChange={e => setData('to_account_rib', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Spending Category</Label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {[
                                                            { id: 'Remittance', icon: Wallet },
                                                            { id: 'Food', icon: Utensils },
                                                            { id: 'Transport', icon: Car },
                                                            { id: 'Housing', icon: Home },
                                                            { id: 'Shopping', icon: ShoppingBag },
                                                            { id: 'Fun', icon: Ticket },
                                                            { id: 'Health', icon: HeartPulse },
                                                            { id: 'Other', icon: Hash }
                                                        ].map((cat) => (
                                                            <button
                                                                key={cat.id}
                                                                type="button"
                                                                onClick={() => setData('category', cat.id)}
                                                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                                                                    data.category === cat.id 
                                                                    ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                                                                    : 'bg-muted/10 border-border/50 hover:border-primary/20 text-muted-foreground'
                                                                }`}
                                                            >
                                                                <cat.icon className="h-5 w-5" />
                                                                <span className="text-[9px] font-black uppercase tracking-tighter">{cat.id}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (MAD)</Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">DH</div>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="h-24 pl-20 rounded-3xl bg-muted/20 border-border/50 text-5xl font-black font-display tracking-tighter focus:ring-primary/10 transition-all"
                                                            value={data.amount}
                                                            onChange={e => setData('amount', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    className="w-full h-24 rounded-3xl bg-primary text-primary-foreground font-black text-2xl uppercase tracking-widest shadow-elevated group" 
                                                    disabled={processing || !data.amount}
                                                >
                                                    {processing ? <Loader2 className="h-10 w-10 animate-spin" /> : 'Confirm Transfer'}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Security & Features Side Section */}
                    <motion.div variants={item} className="lg:col-span-5 space-y-8">
                        <Card className="border-none shadow-elevated rounded-3xl bg-neutral-900 text-white overflow-hidden dark:bg-black group">
                            <CardContent className="p-6 md:p-8 relative">
                                <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                    <ShieldCheck className="h-64 w-64 text-primary" />
                                </div>
                                
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-3 text-primary">
                                        <div className="p-2 rounded-xl bg-primary/20">
                                            <Shield className="h-6 w-6 fill-current" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Protocol</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black uppercase tracking-tight leading-none">Secure <span className="text-primary italic">Transfer.</span></h3>
                                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                            {activeMethod === 'qr' ? 'One-time tokens, time-expiry validation, and instant state confirmation ensure your QR payments are ironclad.' : 'Standard bank-grade encryption and biometric verification protect every transaction across the network.'}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        {activeMethod === 'qr' ? (
                                            <>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <Timer className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Dynamic Tokens</p>
                                                        <p className="text-[10px] text-muted-foreground">Expires after 5 minutes for security</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <Receipt className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Instant State</p>
                                                        <p className="text-[10px] text-muted-foreground">Pending → Confirmed real-time tracking</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <Lock className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted RIB</p>
                                                        <p className="text-[10px] text-muted-foreground">End-to-end payment masking</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Identity Verification</p>
                                                        <p className="text-[10px] text-muted-foreground">Verification required for settlement</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 italic">System integrity verified</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {qrFlow === 'request' && (
                            <Card className="border border-border shadow-soft rounded-3xl bg-card overflow-hidden">
                                <CardContent className="p-6 md:p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Smart Features</p>
                                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black">SOCIAL FEATURES</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-5">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Split className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight">Bill Splitting</p>
                                                <p className="text-xs text-muted-foreground font-medium">Split the total amount between multiple payers instantly.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-5">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Smartphone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight">Push Notifications</p>
                                                <p className="text-xs text-muted-foreground font-medium">Receive instant alerts when someone pays your request.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}

Transfer.layout = {
    breadcrumbs: [
        {
            title: 'Send Money',
            href: '/transfer',
        },
    ],
};

