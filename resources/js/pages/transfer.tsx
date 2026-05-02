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
    ArrowRight,
    Zap,
    Shield,
    Building2,
    Hash
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

const methodConfig = {
    bank: {
        label: 'Bank Transfer',
        icon: Building2,
        description: 'Send money via RIB',
        action: '/transfer/bank',
        color: 'emerald',
    },
    qr: {
        label: 'QR Transfer',
        icon: QrCode,
        description: 'Scan & send instantly',
        action: '/transfer/qr',
        color: 'blue',
    },
    card: {
        label: 'Card Transfer',
        icon: CreditCard,
        description: 'Transfer via card',
        action: '/transfer/card',
        color: 'violet',
    },
};

export default function Transfer({ accounts }: Props) {
    const [activeMethod, setActiveMethod] = useState<TransferMethod>('bank');
    const { errors: pageErrors } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        from_account_rib: '',
        to_account_rib: '',
        amount: '',
    });

    // Show toast for page-level errors (from withErrors)
    useEffect(() => {
        if (pageErrors?.message) {
            toast.error(pageErrors.message);
        }
    }, [pageErrors]);

    const config = methodConfig[activeMethod];
    const selectedAccount = accounts.find(a => a.account_number === data.from_account_rib);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.from_account_rib) {
            toast.error('Please select a sender account.');
            return;
        }
        if (!data.to_account_rib) {
            toast.error('Please enter the receiver RIB.');
            return;
        }
        if (!data.amount || Number(data.amount) <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }
        if (selectedAccount && Number(data.amount) > selectedAccount.balance) {
            toast.error('Insufficient funds. Your balance is ' + selectedAccount.balance.toLocaleString() + ' MAD.');
            return;
        }

        post(config.action, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transfer of ' + Number(data.amount).toLocaleString() + ' MAD completed successfully!');
                reset();
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            },
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Transfer Money" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Zap className="h-5 w-5 fill-current" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Secure Transfer</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 md:text-5xl dark:text-neutral-50">
                        Send <span className="text-emerald-500">Money.</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                        Choose your transfer method and send funds securely.
                    </p>
                </motion.div>

                {/* Method Selector Tabs */}
                <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
                    {(Object.keys(methodConfig) as TransferMethod[]).map((method) => {
                        const cfg = methodConfig[method];
                        const isActive = activeMethod === method;
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={method}
                                onClick={() => setActiveMethod(method)}
                                className={`group relative flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300 flex-1 text-left ${
                                    isActive 
                                    ? 'bg-neutral-900 text-white shadow-2xl dark:bg-neutral-50 dark:text-neutral-900' 
                                    : 'bg-white text-neutral-600 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg dark:bg-neutral-900/50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                                }`}
                            >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                    isActive 
                                    ? 'bg-emerald-500 text-neutral-900' 
                                    : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700'
                                }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-bold truncate ${isActive ? '' : ''}`}>{cfg.label}</p>
                                    <p className={`text-[10px] truncate ${isActive ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-400'}`}>{cfg.description}</p>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="method-dot"
                                        className="absolute right-4 h-2 w-2 rounded-full bg-emerald-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Transfer Form */}
                    <motion.div variants={item} className="lg:col-span-3">
                        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900/50">
                            <CardHeader className="p-6 md:p-8 border-b border-neutral-50 dark:border-neutral-800">
                                <CardTitle className="text-xl font-black flex items-center gap-3">
                                    <config.icon className="h-5 w-5 text-emerald-500" />
                                    {config.label}
                                </CardTitle>
                                <CardDescription>{config.description} — fill in the details below.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* From Account Selector */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">From Account (RIB)</Label>
                                        {accounts.length > 0 ? (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {accounts.map((account) => {
                                                    const isSelected = data.from_account_rib === account.account_number;
                                                    return (
                                                        <button
                                                            key={account.id}
                                                            type="button"
                                                            onClick={() => setData('from_account_rib', account.account_number)}
                                                            className={`group relative rounded-2xl p-4 text-left transition-all duration-300 ${
                                                                isSelected
                                                                ? 'bg-emerald-500 text-neutral-900 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] scale-[1.02]'
                                                                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-100 dark:bg-neutral-800/50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Badge className={`text-[8px] font-black uppercase ${
                                                                    isSelected 
                                                                    ? 'bg-neutral-900/20 text-neutral-900 border-none' 
                                                                    : 'bg-neutral-200/50 text-neutral-500 border-none dark:bg-neutral-700 dark:text-neutral-400'
                                                                }`}>
                                                                    {account.type}
                                                                </Badge>
                                                                {isSelected && (
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <p className={`text-xs font-mono truncate ${isSelected ? 'text-neutral-900/70' : 'text-neutral-400 dark:text-neutral-500'}`}>
                                                                {account.account_number}
                                                            </p>
                                                            <p className="text-lg font-black mt-1">
                                                                {account.balance.toLocaleString()} <span className="text-xs font-normal">{account.currency}</span>
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-8 text-center">
                                                <Wallet className="h-10 w-10 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
                                                <p className="text-sm text-neutral-400 italic">No active accounts found.</p>
                                            </div>
                                        )}
                                        {errors.from_account_rib && <p className="text-xs text-rose-500 font-bold ml-1">{errors.from_account_rib}</p>}
                                    </div>

                                    {/* Receiver RIB */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Receiver RIB</Label>
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input
                                                name="to_account_rib"
                                                type="text"
                                                placeholder="Enter receiver account number (RIB)"
                                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/20 text-sm font-bold dark:bg-neutral-800/50 dark:border-neutral-700"
                                                value={data.to_account_rib}
                                                onChange={e => setData('to_account_rib', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.to_account_rib && <p className="text-xs text-rose-500 font-bold ml-1">{errors.to_account_rib}</p>}
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Amount (MAD)</Label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-500 transition-colors font-bold text-sm">MAD</span>
                                            <Input
                                                name="amount"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="0.00"
                                                className="h-14 pl-16 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/20 text-xl font-black dark:bg-neutral-800/50 dark:border-neutral-700"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.amount && <p className="text-xs text-rose-500 font-bold ml-1">{errors.amount}</p>}
                                    </div>

                                    {/* Summary */}
                                    {data.from_account_rib && data.amount && Number(data.amount) > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="rounded-[2rem] bg-emerald-500/5 p-5 border border-emerald-500/10 space-y-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-neutral-900 flex items-center justify-center">
                                                    <Shield className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-neutral-500">Transfer Summary</p>
                                                    <p className="text-lg font-black text-emerald-600">
                                                        {Number(data.amount).toLocaleString()} <span className="text-xs font-normal">MAD</span>
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedAccount && (
                                                <p className="text-xs text-neutral-400">
                                                    Remaining balance: <span className="font-bold text-neutral-600 dark:text-neutral-300">{(selectedAccount.balance - Number(data.amount)).toLocaleString()} MAD</span>
                                                </p>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Global error message */}
                                    {errors.message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-200 dark:border-rose-800"
                                        >
                                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                                            <p className="text-sm text-rose-600 dark:text-rose-400 font-bold">{errors.message}</p>
                                        </motion.div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        className="w-full h-14 rounded-2xl bg-emerald-500 text-neutral-900 hover:bg-emerald-400 font-black text-lg shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100" 
                                        disabled={processing || !data.from_account_rib || !data.to_account_rib || !data.amount}
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            <>Send Money <Send className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Side: Account Info + Tips */}
                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
                        {/* Selected Account Info */}
                        {selectedAccount ? (
                            <Card className="border-none shadow-xl rounded-[2.5rem] bg-neutral-900 text-white dark:bg-neutral-950 overflow-hidden relative">
                                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]" />
                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                                        <Wallet className="h-3 w-3 text-emerald-500" />
                                        Selected Account
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10 space-y-4">
                                    <div>
                                        <p className="text-neutral-500 text-[10px] font-bold uppercase">Balance</p>
                                        <p className="text-3xl font-black tracking-tighter">
                                            {selectedAccount.balance.toLocaleString()} <span className="text-sm font-normal text-neutral-500">{selectedAccount.currency}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                                            <span className="text-neutral-500">Account Type</span>
                                            <span className="font-bold capitalize">{selectedAccount.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                                            <span className="text-neutral-500">RIB</span>
                                            <span className="font-mono text-[10px]">{selectedAccount.account_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                                            <span className="text-neutral-500">Status</span>
                                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none uppercase text-[8px] font-black">
                                                {selectedAccount.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-xl rounded-[2.5rem] bg-neutral-50 dark:bg-neutral-900/30 overflow-hidden">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <Wallet className="h-12 w-12 text-neutral-200 dark:text-neutral-700 mb-4" />
                                    <p className="text-sm text-neutral-400 font-bold">Select a sender account</p>
                                    <p className="text-xs text-neutral-400 mt-1">Choose from your accounts above</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Info */}
                        <Card className="border-none shadow-lg rounded-[2.5rem] bg-emerald-500 text-neutral-900 overflow-hidden">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">Secured</span>
                                </div>
                                <p className="text-xs font-medium opacity-70 leading-relaxed">
                                    All transfers are protected with 256-bit encryption and processed instantly through our secure banking network.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Quick Tips */}
                        <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Quick Tips</p>
                                <div className="space-y-3 text-xs text-neutral-500">
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-emerald-500 text-[10px] font-black">1</span>
                                        </div>
                                        <p>Double-check the receiver's RIB before sending.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-emerald-500 text-[10px] font-black">2</span>
                                        </div>
                                        <p>Transfers are processed immediately and cannot be reversed.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-emerald-500 text-[10px] font-black">3</span>
                                        </div>
                                        <p>Contact support if you need to dispute a transaction.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}

Transfer.layout = {
    breadcrumbs: [
        {
            title: 'Transfer',
            href: '/transfer',
        },
    ],
};
