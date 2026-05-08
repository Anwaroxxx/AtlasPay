import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
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
    HeartPulse,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QrScanner from '@/components/transactions/qr/QrScanner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

type SendMethod = 'specify' | 'cut';
type TransferMethod = 'bank' | 'qr' | 'card';
type QRFlow = 'send' | 'request' | 'merchant' | 'scanner';

const methodConfig = {
    qr: {
        label: 'QR Payment',
        icon: QrCode,
        description: 'Instant Scan & Pay',
        action: '/transfer/qr',
    },
    bank: {
        label: 'Bank Transfer',
        icon: Building2,
        description: 'Standard RIB Transfer',
        action: '/transfer/bank',
    },

    // card: {
    //     label: 'Card Transfer',
    //     icon: CreditCard,
    //     description: 'Direct Card Remittance',
    //     action: '/transfer/card',
    // },
};

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    data,
    processing,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: any;
    processing: boolean;
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
            >
                <div className="space-y-8 p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 transition-colors hover:bg-muted"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tight uppercase">
                            Confirm{' '}
                            <span className="text-primary italic">
                                Transfer.
                            </span>
                        </h3>
                        <p className="font-medium text-muted-foreground">
                            Please verify the transaction details before
                            deployment.
                        </p>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-border/50 bg-muted/30 p-6">
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Amount
                            </span>
                            <span className="text-2xl font-black">
                                {Number(data.amount).toLocaleString()} MAD
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                To RIB/Card
                            </span>
                            <span className="font-mono text-xs font-bold tracking-tighter">
                                {data.to_account_rib || 'Instant QR'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-16 flex-1 rounded-2xl border-2 font-black tracking-widest uppercase"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={processing}
                            className="group h-16 flex-1 rounded-2xl bg-primary font-black tracking-widest text-primary-foreground uppercase shadow-lg"
                        >
                            {processing ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    Confirm{' '}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Transfer({ accounts }: Props) {
    const [activeMethod, setActiveMethod] = useState<TransferMethod>('qr');
    const [activeSendMethod, setSendActiveMethod] = useState<SendMethod>('cut');
    const [activeMerchantMethod, setMerchantActiveMethod] =
        useState<SendMethod>('cut');
    const [qrFlow, setQrFlow] = useState<QRFlow>('send');
    const [isScanning, setIsScanning] = useState(false);
    const [qrStep, setQrStep] = useState<
        'input' | 'generated' | 'processing' | 'confirmed'
    >('input');
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
        if (
            typeof window !== 'undefined' &&
            (window as any).Echo &&
            auth?.user
        ) {
            const channel = `App.Models.User.${auth.user.id}`;
            (window as any).Echo.private(channel).listen(
                '.transaction.created',
                (e: any) => {
                    router.reload({ only: ['accounts'] });
                },
            );

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth?.user?.id]);

    useEffect(() => {
        let timer: any;

        if (qrStep === 'generated' && expiryTime > 0) {
            timer = setInterval(() => setExpiryTime((prev) => prev - 1), 1000);
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
    const selectedAccount = accounts.find(
        (a) => a.account_number === data.from_account_rib,
    );

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

        if (activeSendMethod !== 'cut') {
            if (!data.to_account_rib && activeMethod !== 'qr') {
                toast.error('Recipient details are required.');

                return;
            }

            if (!data.amount || Number(data.amount) <= 0) {
                toast.error('Please enter a valid amount.');

                return;
            }
        }

        if (activeMethod === 'qr') {
            const payload = {
                amount: data.amount,
                from_account_id: accounts.find(
                    (a) => a.account_number === data.from_account_rib,
                )?.id,
            };

            if (qrFlow === 'send') {
                if (activeSendMethod === 'cut') {
                    router.post('/qr/create/sender/quickpay', payload);
                } else {
                    router.post('/qr/create/sender', payload);
                }

                return;
            }

            if (qrFlow === 'request') {
                router.post('/qr/create/receiver', payload);

                return;
            }

            if (qrFlow === 'merchant') {
                if (activeMerchantMethod === 'cut') {
                    router.post('/qr/create/store', payload);
                } else {
                    router.post('/qr/create/store', payload);
                }

                return;
            }
        }

        setShowConfirm(true);
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <>
            <Head title="Send Money" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-6 md:p-12"
            >
                <ConfirmationModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                    data={data}
                    processing={processing}
                />
                {/* Header */}
                <motion.div
                    variants={item}
                    className="space-y-4 text-center md:text-left"
                >
                    <div className="flex items-center justify-center gap-2 text-primary md:justify-start">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <Send className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                            Secure Remittance
                        </span>
                    </div>
                    <h1 className="font-display text-4xl leading-none font-black tracking-tighter text-foreground uppercase md:text-6xl">
                        Send <span className="text-primary italic">Money.</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-sm font-medium text-muted-foreground md:mx-0 md:text-base">
                        Fast and secure money transfers. Choose your preferred
                        method and send funds across the AtlasPay network.
                    </p>
                </motion.div>

                {/* Method Selector */}
                <motion.div
                    variants={item}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                    {(Object.keys(methodConfig) as TransferMethod[]).map(
                        (method) => {
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
                                    className={`group relative flex items-center gap-3 overflow-hidden rounded-3xl border p-4 text-left transition-all duration-500 md:gap-5 md:p-8 ${
                                        isActive
                                            ? 'shadow-elevated border-primary bg-card'
                                            : 'border-border/50 bg-card/30 text-muted-foreground hover:border-primary/30'
                                    }`}
                                >
                                    <div
                                        className={`shadow-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 md:h-16 md:w-16 ${
                                            isActive
                                                ? 'scale-110 bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground group-hover:bg-accent'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 md:h-8 md:w-8" />
                                    </div>
                                    <div className="min-w-0">
                                        <p
                                            className={`text-lg font-black tracking-tight uppercase ${isActive ? 'text-foreground' : ''}`}
                                        >
                                            {cfg.label}
                                        </p>
                                        <p className="mt-1 text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                            {cfg.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        },
                    )}
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-1">
                    {/* Main UI Section */}
                    <motion.div
                        variants={item}
                        className="mx-auto w-full max-w-3xl"
                    >
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
                                    <div className="flex flex-wrap gap-4 rounded-2xl border border-border/50 bg-muted/20 p-2">
                                        {[
                                            {
                                                id: 'send',
                                                label: 'Send',
                                                icon: Send,
                                            },
                                            {
                                                id: 'request',
                                                label: 'Request',
                                                icon: ArrowDownLeft,
                                            },
                                            {
                                                id: 'merchant',
                                                label: 'Merchant',
                                                icon: Store,
                                            },
                                            {
                                                id: 'scanner',
                                                label: 'Scan',
                                                icon: Camera,
                                            },
                                        ].map((flow) => (
                                            <button
                                                key={flow.id}
                                                onClick={() => {
                                                    setQrFlow(
                                                        flow.id as QRFlow,
                                                    );
                                                    setQrStep('input');
                                                    setIsScanning(
                                                        flow.id === 'scanner',
                                                    );
                                                }}
                                                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest uppercase transition-all ${
                                                    qrFlow === flow.id
                                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                                        : 'text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                <flow.icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    {flow.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {/* QR Flow UI */}
                                    <Card className="shadow-elevated glass-card flex min-h-[500px] flex-col overflow-hidden rounded-3xl border-none bg-card">
                                        <CardHeader className="border-b border-border bg-muted/20 p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                        <QrCode className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                                            {qrFlow ===
                                                                'send' &&
                                                                'Send via QR'}
                                                            {qrFlow ===
                                                                'request' &&
                                                                'Request Payment'}
                                                            {qrFlow ===
                                                                'merchant' &&
                                                                'Merchant Storefront'}
                                                            {qrFlow ===
                                                                'scanner' &&
                                                                'Scan QR'}
                                                        </CardTitle>
                                                        <CardDescription className="mt-1 text-[10px] font-black tracking-widest uppercase">
                                                            {qrFlow ===
                                                                'send' &&
                                                                'Generate a one-time payment token'}
                                                            {qrFlow ===
                                                                'request' &&
                                                                'Create a payment link for others'}
                                                            {qrFlow ===
                                                                'merchant' &&
                                                                'Your business identifier (Permanent)'}
                                                            {qrFlow ===
                                                                'scanner' &&
                                                                'Point your camera at a code'}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {qrStep === 'generated' && (
                                                    <Badge className="border-none bg-primary/20 px-4 py-2 font-black text-primary">
                                                        <Timer className="mr-2 h-3 w-3" />{' '}
                                                        {formatTime(expiryTime)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col justify-center p-6">
                                            {qrFlow === 'scanner' ? (
                                                <div className="group relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border-4 border-primary/30">
                                                    <QrScanner
                                                        onResult={(result) => {
                                                            // result is the encrypted token URL or just the id
                                                            window.location.href =
                                                                result;
                                                        }}
                                                    />
                                                </div>
                                            ) : qrStep === 'generated' ? (
                                                <div className="flex flex-col items-center space-y-10 text-center">
                                                    <div className="shadow-elevated group relative rounded-3xl bg-white p-6">
                                                        <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />
                                                        <QrCode className="h-64 w-64 text-neutral-900" />
                                                        <div className="absolute inset-0 rounded-3xl border-4 border-primary/20 transition-colors group-hover:border-primary/50" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="font-display text-5xl font-black tracking-tighter">
                                                            {Number(
                                                                data.amount,
                                                            ).toLocaleString()}{' '}
                                                            <span className="text-xl font-normal">
                                                                MAD
                                                            </span>
                                                        </p>
                                                        <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                                                            One-time payment
                                                            token
                                                        </p>
                                                    </div>
                                                    <div className="flex w-full gap-4">
                                                        <Button
                                                            onClick={() =>
                                                                setQrStep(
                                                                    'input',
                                                                )
                                                            }
                                                            variant="outline"
                                                            className="h-16 flex-1 rounded-2xl font-black tracking-widest uppercase"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button className="h-16 flex-1 rounded-2xl bg-primary font-black tracking-widest text-primary-foreground uppercase">
                                                            <RefreshCw className="mr-3 h-5 w-5" />{' '}
                                                            Refresh
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : qrStep === 'confirmed' ? (
                                                <div className="space-y-8 py-10 text-center">
                                                    <div className="mx-auto flex h-32 w-32 scale-110 items-center justify-center rounded-full bg-success/10 text-success">
                                                        <CheckCircle2 className="h-16 w-16" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-3xl font-black tracking-tight uppercase">
                                                            Payment{' '}
                                                            <span className="text-success italic">
                                                                Complete.
                                                            </span>
                                                        </h4>
                                                        <p className="font-medium text-muted-foreground">
                                                            Transaction verified
                                                            and settled
                                                            instantly.
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            setQrStep('input')
                                                        }
                                                        className="h-16 rounded-2xl bg-success px-10 font-black tracking-widest text-white uppercase"
                                                    >
                                                        Done
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    {(qrFlow === 'send' ||
                                                        qrFlow ===
                                                            'merchant') && (
                                                        <div className="space-y-4">
                                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                {qrFlow ===
                                                                'send'
                                                                    ? 'Transfer Mode'
                                                                    : 'Merchant Mode'}
                                                            </Label>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            qrFlow ===
                                                                            'send'
                                                                        ) {
                                                                            setSendActiveMethod(
                                                                                'specify',
                                                                            );
                                                                        } else {
                                                                            setMerchantActiveMethod(
                                                                                'specify',
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`flex items-center justify-center gap-2 rounded-2xl py-4 text-[10px] font-black tracking-widest uppercase transition-all ${
                                                                        (qrFlow ===
                                                                        'send'
                                                                            ? activeSendMethod
                                                                            : activeMerchantMethod) ===
                                                                        'specify'
                                                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                                                            : 'border border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    Specify
                                                                    Amount
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            qrFlow ===
                                                                            'send'
                                                                        ) {
                                                                            setSendActiveMethod(
                                                                                'cut',
                                                                            );
                                                                        } else {
                                                                            setMerchantActiveMethod(
                                                                                'cut',
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`flex items-center justify-center gap-2 rounded-2xl py-4 text-[10px] font-black tracking-widest uppercase transition-all ${
                                                                        (qrFlow ===
                                                                        'send'
                                                                            ? activeSendMethod
                                                                            : activeMerchantMethod) ===
                                                                        'cut'
                                                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                                                            : 'border border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    {qrFlow ===
                                                                    'send'
                                                                        ? 'Quick Pay'
                                                                        : 'Show My QR'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {qrFlow === 'merchant' &&
                                                    activeMerchantMethod ===
                                                        'cut' ? (
                                                        <div className="relative space-y-8 overflow-hidden rounded-3xl bg-neutral-900 p-8 text-center">
                                                            <div className="moroccan-pattern absolute inset-0 opacity-[0.05]" />
                                                            <div className="relative z-10 space-y-6">
                                                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary/20">
                                                                    <Store className="h-12 w-12 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-2xl font-black tracking-tight text-white uppercase">
                                                                        Business
                                                                        Identifier
                                                                    </h5>
                                                                    <p className="text-sm font-medium text-muted-foreground">
                                                                        Display
                                                                        your
                                                                        permanent
                                                                        QR for
                                                                        customers
                                                                        to scan
                                                                        and pay
                                                                        any
                                                                        amount.
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        axios
                                                                            .get(
                                                                                '/qr/merchant/permanent',
                                                                            )
                                                                            .then(
                                                                                (
                                                                                    res,
                                                                                ) => {
                                                                                    router.get(
                                                                                        `/qr/view/${res.data.id}`,
                                                                                    );
                                                                                },
                                                                            );
                                                                    }}
                                                                    className="h-16 w-full rounded-2xl bg-primary font-black tracking-widest text-white uppercase shadow-lg"
                                                                >
                                                                    <QrCode className="mr-3 h-5 w-5" />{' '}
                                                                    View My QR
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <form
                                                            onSubmit={submit}
                                                            className="space-y-8"
                                                        >
                                                            <div className="space-y-4">
                                                                <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                    Source
                                                                    Account
                                                                </Label>
                                                                <div className="grid gap-4">
                                                                    {accounts.map(
                                                                        (
                                                                            acc,
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    acc.id
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setData(
                                                                                        'from_account_rib',
                                                                                        acc.account_number,
                                                                                    )
                                                                                }
                                                                                className={`flex items-center justify-between rounded-2xl border p-6 text-left transition-all ${
                                                                                    data.from_account_rib ===
                                                                                    acc.account_number
                                                                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                                                        : 'border-border/50 bg-muted/10 hover:border-primary/30'
                                                                                }`}
                                                                            >
                                                                                {}
                                                                                <div>
                                                                                    <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-60">
                                                                                        {
                                                                                            acc.type
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xl font-black tracking-tight">
                                                                                        {acc.balance.toLocaleString()}{' '}
                                                                                        MAD
                                                                                    </p>
                                                                                </div>
                                                                                <div
                                                                                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${data.from_account_rib === acc.account_number ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'}`}
                                                                                >
                                                                                    {data.from_account_rib ===
                                                                                        acc.account_number && (
                                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                                    )}
                                                                                </div>
                                                                            </button>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {(qrFlow ===
                                                                'send' &&
                                                                activeSendMethod ===
                                                                    'cut') ||
                                                            (qrFlow ===
                                                                'merchant' &&
                                                                activeMerchantMethod ===
                                                                    'cut') ? (
                                                                ''
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                        Amount
                                                                        to{' '}
                                                                        {qrFlow ===
                                                                        'send'
                                                                            ? 'Send'
                                                                            : 'Receive'}
                                                                    </Label>
                                                                    <div className="relative">
                                                                        <div className="absolute top-1/2 left-6 -translate-y-1/2 text-2xl font-black text-muted-foreground">
                                                                            DH
                                                                        </div>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0.00"
                                                                            className="h-24 rounded-3xl border-border/50 bg-muted/20 pl-20 font-display text-5xl font-black tracking-tighter transition-all focus:ring-primary/10"
                                                                            value={
                                                                                data.amount
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setData(
                                                                                    'amount',
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <Button
                                                                type="submit"
                                                                className="shadow-elevated group h-14 w-full rounded-3xl bg-primary text-base font-black tracking-widest text-primary-foreground uppercase md:h-24 md:text-2xl"
                                                                disabled={
                                                                    (qrFlow ===
                                                                        'send' &&
                                                                        activeSendMethod ===
                                                                            'specify' &&
                                                                        (!data.amount ||
                                                                            Number(
                                                                                data.amount,
                                                                            ) <=
                                                                                0)) ||
                                                                    (qrFlow ===
                                                                        'merchant' &&
                                                                        activeMerchantMethod ===
                                                                            'specify' &&
                                                                        (!data.amount ||
                                                                            Number(
                                                                                data.amount,
                                                                            ) <=
                                                                                0)) ||
                                                                    (qrFlow ===
                                                                        'request' &&
                                                                        (!data.amount ||
                                                                            Number(
                                                                                data.amount,
                                                                            ) <=
                                                                                0))
                                                                }
                                                            >
                                                                {qrFlow ===
                                                                'send'
                                                                    ? 'Generate Qr Code'
                                                                    : qrFlow ===
                                                                        'merchant'
                                                                      ? 'Generate Store QR'
                                                                      : 'Request'}{' '}
                                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-4 md:ml-4 md:h-8 md:w-8" />
                                                            </Button>
                                                        </form>
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>{' '}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form-ui"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="shadow-elevated glass-card overflow-hidden rounded-3xl border-none bg-card">
                                        <CardHeader className="border-b border-border bg-muted/20 p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                                                    <config.icon className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <CardTitle className="font-display text-2xl font-black tracking-tight uppercase">
                                                        Transfer{' '}
                                                        <span className="text-primary italic">
                                                            Details.
                                                        </span>
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 text-[10px] font-black tracking-widest uppercase">
                                                        Fill in the transfer
                                                        information below
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <form
                                                onSubmit={submit}
                                                className="space-y-10"
                                            >
                                                <div className="space-y-4">
                                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Select Source Account
                                                    </Label>
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {accounts.map(
                                                            (account) => {
                                                                const isSelected =
                                                                    data.from_account_rib ===
                                                                    account.account_number;

                                                                return (
                                                                    <button
                                                                        key={
                                                                            account.id
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setData(
                                                                                'from_account_rib',
                                                                                account.account_number,
                                                                            )
                                                                        }
                                                                        className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ${
                                                                            isSelected
                                                                                ? 'shadow-elevated scale-[1.02] border-primary bg-primary text-primary-foreground'
                                                                                : 'border-border/50 bg-muted/30 hover:border-primary/30'
                                                                        }`}
                                                                    >
                                                                        <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />
                                                                        <div className="relative z-10">
                                                                            <div className="mb-4 flex items-center justify-between">
                                                                                <Badge
                                                                                    className={`border-none px-2 py-0.5 text-[8px] font-black tracking-widest uppercase ${
                                                                                        isSelected
                                                                                            ? 'bg-white/20 text-white'
                                                                                            : 'bg-muted text-muted-foreground'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        account.type
                                                                                    }
                                                                                </Badge>
                                                                                {isSelected && (
                                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                                )}
                                                                            </div>
                                                                            <p
                                                                                className={`mb-2 font-mono text-[10px] tracking-tighter ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}
                                                                            >
                                                                                {
                                                                                    account.account_number
                                                                                }
                                                                            </p>
                                                                            <p className="font-display text-2xl font-black tracking-tight">
                                                                                {account.balance.toLocaleString()}{' '}
                                                                                <span className="text-xs font-normal opacity-60">
                                                                                    {
                                                                                        account.currency
                                                                                    }
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        {activeMethod === 'bank'
                                                            ? 'Recipient RIB'
                                                            : 'Recipient Card Number'}
                                                    </Label>
                                                    <div className="group relative">
                                                        <div className="absolute top-1/2 left-6 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
                                                            {activeMethod ===
                                                            'bank' ? (
                                                                <Hash className="h-6 w-6" />
                                                            ) : (
                                                                <CreditCard className="h-6 w-6" />
                                                            )}
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            placeholder={
                                                                activeMethod ===
                                                                'bank'
                                                                    ? 'Enter 24-digit RIB'
                                                                    : 'Enter 16-digit Card Number'
                                                            }
                                                            className="h-16 rounded-[1.5rem] border-border/50 bg-muted/20 pl-16 text-base font-black tracking-tight transition-all focus:ring-primary/10"
                                                            value={
                                                                data.to_account_rib
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'to_account_rib',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Spending Category
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                        {[
                                                            {
                                                                id: 'Remittance',
                                                                icon: Wallet,
                                                            },
                                                            {
                                                                id: 'Food',
                                                                icon: Utensils,
                                                            },
                                                            {
                                                                id: 'Transport',
                                                                icon: Car,
                                                            },
                                                            {
                                                                id: 'Housing',
                                                                icon: Home,
                                                            },
                                                            {
                                                                id: 'Shopping',
                                                                icon: ShoppingBag,
                                                            },
                                                            {
                                                                id: 'Fun',
                                                                icon: Ticket,
                                                            },
                                                            {
                                                                id: 'Health',
                                                                icon: HeartPulse,
                                                            },
                                                            {
                                                                id: 'Other',
                                                                icon: Hash,
                                                            },
                                                        ].map((cat) => (
                                                            <button
                                                                key={cat.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        'category',
                                                                        cat.id,
                                                                    )
                                                                }
                                                                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                                                                    data.category ===
                                                                    cat.id
                                                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                                        : 'border-border/50 bg-muted/10 text-muted-foreground hover:border-primary/20'
                                                                }`}
                                                            >
                                                                <cat.icon className="h-5 w-5" />
                                                                <span className="text-[9px] font-black tracking-tighter uppercase">
                                                                    {cat.id}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Amount (MAD)
                                                    </Label>
                                                    <div className="group relative">
                                                        <div className="absolute top-1/2 left-6 -translate-y-1/2 text-2xl font-black text-muted-foreground">
                                                            DH
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="h-24 rounded-3xl border-border/50 bg-muted/20 pl-20 font-display text-5xl font-black tracking-tighter transition-all focus:ring-primary/10"
                                                            value={data.amount}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'amount',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="shadow-elevated group h-14 w-full rounded-3xl bg-primary text-base font-black tracking-widest text-primary-foreground uppercase md:h-24 md:text-2xl"
                                                    disabled={
                                                        processing ||
                                                        !data.amount
                                                    }
                                                >
                                                    {processing ? (
                                                        <Loader2 className="h-6 w-6 animate-spin md:h-10 md:w-10" />
                                                    ) : (
                                                        'Confirm Transfer'
                                                    )}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Security & Features Side Section
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
                    </motion.div> */}
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
