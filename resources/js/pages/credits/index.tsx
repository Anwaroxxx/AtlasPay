import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, 
    TrendingUp, 
    Calendar, 
    DollarSign,
    CheckCircle2,
    Clock,
    ArrowRight,
    ShieldCheck,
    Zap,
    Info,
    History
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Credit {
    id: number;
    amount: number;
    total_to_pay: number;
    repaid_amount: number;
    interest_rate: number;
    due_date: string;
    status: 'active' | 'paid' | 'defaulted';
    created_at: string;
}

interface Props {
    credits: Credit[];
    activeCredit: Credit | null;
    creditScore: number;
    maxCreditAmount: number;
}

export default function Credits({ credits, activeCredit, creditScore, maxCreditAmount }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        duration_months: '3',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/credits', {
            onSuccess: () => reset(),
        });
    };

    const repay = (creditId: number) => {
        post(`/credits/${creditId}/repay`);
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

    const scorePercentage = (creditScore / 1000) * 100;
    const scoreColor = creditScore >= 700 ? 'text-emerald-500' : creditScore >= 500 ? 'text-amber-500' : 'text-rose-500';

    return (
        <>
            <Head title="Credits" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-10 p-4 md:p-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Zap className="h-5 w-5 fill-current" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Bank Credits</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-neutral-900 md:text-6xl dark:text-neutral-50">
                        Quick <span className="text-emerald-500">Credits.</span>
                    </h1>
                    <p className="max-w-2xl text-neutral-500 dark:text-neutral-400">
                        Get instant access to funds based on your credit score. No hidden fees, just straightforward banking.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Credit Score Gauge */}
                    <motion.div variants={item} className="lg:col-span-1">
                        <Card className="relative h-full overflow-hidden border-none bg-neutral-900 text-white shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] dark:bg-neutral-950 rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
                            <CardHeader className="relative z-10 pb-2">
                                <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    Your Credit Rating
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 flex flex-col items-center justify-center py-10">
                                <div className="relative flex h-52 w-52 items-center justify-center">
                                    <svg className="h-full w-full transform -rotate-90">
                                        <circle
                                            cx="104"
                                            cy="104"
                                            r="90"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="16"
                                        />
                                        <motion.circle
                                            cx="104"
                                            cy="104"
                                            r="90"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="16"
                                            strokeDasharray={565}
                                            initial={{ strokeDashoffset: 565 }}
                                            animate={{ strokeDashoffset: 565 - (565 * scorePercentage) / 100 }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round"
                                            className={scoreColor}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center">
                                        <motion.span 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-6xl font-black tracking-tighter"
                                        >
                                            {creditScore}
                                        </motion.span>
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase">Score</span>
                                    </div>
                                </div>
                                
                                <div className="mt-10 w-full space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase text-neutral-500 font-bold">Max Limit</p>
                                            <p className="text-2xl font-black text-emerald-400">{maxCreditAmount.toLocaleString()} <span className="text-xs font-normal">MAD</span></p>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1">
                                            {creditScore >= 700 ? 'EXCELLENT' : creditScore >= 500 ? 'GOOD' : 'REBUILDING'}
                                        </Badge>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${scorePercentage}%` }}
                                            className={`h-full rounded-full ${scoreColor} bg-current`} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Active Credit or Request Form */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {activeCredit ? (
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <Card className="h-full border-none shadow-2xl bg-white dark:bg-neutral-900/50 relative overflow-hidden group rounded-[2.5rem]">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                            <Zap className="h-64 w-64" />
                                        </div>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-2xl font-black">Active Credit</CardTitle>
                                                    <CardDescription>Details of your current loan.</CardDescription>
                                                </div>
                                                <Badge className="bg-emerald-500 text-neutral-900 font-black animate-pulse">
                                                    ACTIVE
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="grid gap-6 md:grid-cols-3">
                                                <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Left to Pay</p>
                                                    <p className="text-2xl font-black">{(activeCredit.total_to_pay - activeCredit.repaid_amount).toLocaleString()} <span className="text-xs font-normal">MAD</span></p>
                                                </div>
                                                <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Due Date</p>
                                                    <p className="text-lg font-bold flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-emerald-500" />
                                                        {new Date(activeCredit.due_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Interest</p>
                                                    <p className="text-lg font-bold text-emerald-500">{activeCredit.interest_rate}% Fixed</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Repayment Progress</span>
                                                    <span className="text-2xl font-black">{Math.round((activeCredit.repaid_amount / activeCredit.total_to_pay) * 100)}%</span>
                                                </div>
                                                <div className="h-4 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden p-1">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(activeCredit.repaid_amount / activeCredit.total_to_pay) * 100}%` }}
                                                        className="h-full rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                onClick={() => repay(activeCredit.id)}
                                                className="w-full h-14 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 font-black text-lg"
                                                disabled={processing}
                                            >
                                                Pay Back Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="apply"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <Card className="h-full border-none shadow-2xl rounded-[2.5rem]">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-black">Get Credit</CardTitle>
                                            <CardDescription>Instant funds based on your rating.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={submit} className="space-y-6">
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Amount (MAD)</Label>
                                                        <div className="relative group">
                                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/20 text-xl font-black"
                                                                value={data.amount}
                                                                onChange={e => setData('amount', e.target.value)}
                                                            />
                                                        </div>
                                                        {errors.amount && <p className="text-xs text-rose-500 font-bold">{errors.amount}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Duration</Label>
                                                        <select
                                                            className="h-14 w-full rounded-2xl border-neutral-100 bg-neutral-50 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                            value={data.duration_months}
                                                            onChange={e => setData('duration_months', e.target.value)}
                                                        >
                                                            <option value="1">1 Month</option>
                                                            <option value="3">3 Months</option>
                                                            <option value="6">6 Months</option>
                                                            <option value="12">12 Months</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="rounded-[2rem] bg-emerald-500/5 p-6 border border-emerald-500/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-neutral-900 flex items-center justify-center">
                                                            <Info className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-neutral-500">Total to Repay</p>
                                                            <p className="text-2xl font-black text-emerald-600">
                                                                {data.amount ? (Number(data.amount) * 1.05).toLocaleString() : '0'} <span className="text-xs font-normal">MAD</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-emerald-500 text-neutral-900 font-black">5% FIXED RATE</Badge>
                                                </div>

                                                <Button type="submit" className="w-full h-14 rounded-2xl bg-emerald-500 text-neutral-900 hover:bg-emerald-400 font-black text-lg shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]" disabled={processing || !data.amount}>
                                                    Get Funds Now <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Credit History */}
                <motion.div variants={item}>
                    <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="border-b border-neutral-50 dark:border-neutral-800">
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5 text-neutral-400" />
                                Credit History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-500">
                                <thead className="bg-neutral-50 text-[10px] uppercase font-black tracking-widest text-neutral-400 dark:bg-neutral-950/50">
                                    <tr>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Total Due</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5">Due Date</th>
                                        <th className="px-8 py-5 text-right">Requested On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {credits.map((credit) => (
                                        <tr key={credit.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 dark:border-neutral-900 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-8 py-6 font-black text-neutral-900 dark:text-neutral-50 text-lg">
                                                {credit.amount.toLocaleString()} <span className="text-[10px] font-normal text-neutral-500">MAD</span>
                                            </td>
                                            <td className="px-8 py-6 font-bold">
                                                {credit.total_to_pay.toLocaleString()} MAD
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                                    credit.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600' :
                                                    credit.status === 'active' ? 'bg-blue-500/10 text-blue-600' :
                                                    'bg-rose-500/10 text-rose-600'
                                                }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                                        credit.status === 'paid' ? 'bg-emerald-500' :
                                                        credit.status === 'active' ? 'bg-blue-500 animate-pulse' :
                                                        'bg-rose-500'
                                                    }`} />
                                                    {credit.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-medium">
                                                {new Date(credit.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right text-xs text-neutral-400 font-mono">
                                                {new Date(credit.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {credits.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-neutral-400 italic text-sm">
                                                No previous credits found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </>
    );
}

Credits.layout = {
    breadcrumbs: [
        {
            title: 'Credits',
            href: '/credits',
        },
    ],
};
