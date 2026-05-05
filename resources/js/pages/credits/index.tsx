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
    History,
    ChevronDown,
    BrainCircuit,
    AlertCircle,
    ArrowUpCircle,
    ArrowDownCircle,
    CircleDashed,
    Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    RadialBarChart, 
    RadialBar, 
    ResponsiveContainer, 
    PolarAngleAxis,
    Tooltip
} from 'recharts';

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

const scoreTips = [
    { title: "Account Balance", desc: "Maintain a balance above 2,000 MAD for better credit eligibility.", impact: "+45 pts" },
    { title: "On-time Payments", desc: "Pay your credit installments before the due date to boost your score.", impact: "+30 pts" },
    { title: "Regular Activity", desc: "Use AtlasPay for your daily transactions to show consistent account usage.", impact: "+15 pts" }
];

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

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const radialData = [{ name: 'Score', value: creditScore, fill: creditScore >= 700 ? 'var(--color-success)' : creditScore >= 500 ? 'var(--color-warning)' : 'var(--color-destructive)' }];

    const totalBorrowed = credits.reduce((acc, c) => acc + c.amount, 0);
    const totalOwed = activeCredit ? (activeCredit.total_to_pay - activeCredit.repaid_amount) : 0;

    return (
        <>
            <Head title="Credits & Loans" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-8 p-6 md:p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Credit Management</span>
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl uppercase leading-none">
                        Credit <span className="text-primary italic">Access.</span>
                    </h1>
                    <p className="max-w-2xl text-muted-foreground text-sm md:text-base font-medium">
                        Apply for credit instantly based on your account activity. Transparent rates and flexible repayment options.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Credit Score Gauge & Tips */}
                    <motion.div variants={item} className="lg:col-span-4 space-y-8">
                        <Card className="relative overflow-hidden border-none bg-neutral-900 text-white shadow-elevated rounded-3xl dark:bg-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
                            <div className="absolute inset-0 moroccan-pattern opacity-[0.03]" />
                            
                            <CardHeader className="relative z-10 p-8 pb-0">
                                <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Credit Score
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="relative z-10 p-8 flex flex-col items-center">
                                <div className="h-64 w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius="70%" 
                                            outerRadius="100%" 
                                            barSize={12} 
                                            data={radialData} 
                                            startAngle={180} 
                                            endAngle={0}
                                        >
                                            <PolarAngleAxis
                                                type="number"
                                                domain={[0, 1000]}
                                                angleAxisId={0}
                                                tick={false}
                                            />
                                            <RadialBar
                                                background
                                                dataKey="value"
                                                cornerRadius={30}
                                                animationDuration={1500}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                                        <span className="text-7xl font-black tracking-tight">{creditScore}</span>
                                        <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Points</span>
                                    </div>
                                </div>
                                
                                <div className="w-full mt-4 space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Credit Limit</p>
                                            <p className="text-xl font-black text-primary">{maxCreditAmount.toLocaleString()} MAD</p>
                                        </div>
                                        <Badge className={`font-black text-[9px] border-none px-3 py-1 ${creditScore >= 700 ? 'bg-success text-white' : 'bg-warning text-black'}`}>
                                            {creditScore >= 700 ? 'EXCELLENT' : 'GOOD'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border shadow-soft rounded-3xl bg-card p-8 glass-card">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <BrainCircuit className="h-4 w-4 text-primary" />
                                    How to Improve
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-4">
                                {scoreTips.map((tip, i) => (
                                    <div key={i} className="group p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-black uppercase tracking-tight">{tip.title}</p>
                                            <span className="text-[10px] font-black text-success">{tip.impact}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{tip.desc}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Active Credit or Request Form */}
                    <motion.div variants={item} className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {activeCredit ? (
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full"
                                >
                                    <Card className="h-full border-none shadow-elevated bg-card relative overflow-hidden group rounded-3xl glass-card">
                                        <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                            <Zap className="h-80 w-80" />
                                        </div>
                                        <CardHeader className="p-6 pb-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-3xl font-black tracking-tight uppercase">Active <span className="text-primary italic">Credit.</span></CardTitle>
                                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">Current Repayment Status</CardDescription>
                                                </div>
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-10">
                                            <div className="grid gap-6 md:grid-cols-3">
                                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount Owed</p>
                                                    <p className="text-3xl font-black tracking-tight">{(activeCredit.total_to_pay - activeCredit.repaid_amount).toLocaleString()} <span className="text-xs font-normal">MAD</span></p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Due Date</p>
                                                    <p className="text-xl font-black flex items-center gap-3">
                                                        <Clock className="h-5 w-5 text-primary" />
                                                        {new Date(activeCredit.due_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interest Rate</p>
                                                    <p className="text-xl font-black text-primary uppercase tracking-tight">{activeCredit.interest_rate}% Fixed</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Repayment Progress</span>
                                                    <span className="text-3xl font-black tracking-tighter">{Math.round((activeCredit.repaid_amount / activeCredit.total_to_pay) * 100)}%</span>
                                                </div>
                                                <div className="h-6 w-full rounded-full bg-muted/50 border border-border/50 overflow-hidden p-1.5">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(activeCredit.repaid_amount / activeCredit.total_to_pay) * 100}%` }}
                                                        className="h-full rounded-full bg-primary"
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                onClick={() => repay(activeCredit.id)}
                                                className="w-full h-20 rounded-2xl bg-primary text-primary-foreground font-black text-xl uppercase tracking-widest shadow-elevated group"
                                                disabled={processing}
                                            >
                                                Pay Installment <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="apply"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full"
                                >
                                    <Card className="h-full border-none shadow-elevated rounded-3xl bg-card p-2">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-3xl font-black uppercase tracking-tight">Request <span className="text-primary italic">Credit.</span></CardTitle>
                                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Get instant funding for your needs</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-4">
                                            <form onSubmit={submit} className="space-y-8">
                                                <div className="grid gap-8 md:grid-cols-2">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Loan Amount (MAD)</Label>
                                                        <div className="relative group">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center justify-center font-black">DH</div>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="h-16 pl-14 pr-6 rounded-2xl bg-muted/20 border-border/50 text-2xl font-black focus:ring-primary/10 transition-all"
                                                                value={data.amount}
                                                                onChange={e => setData('amount', e.target.value)}
                                                            />
                                                        </div>
                                                        {errors.amount && <p className="text-xs text-destructive font-black px-1">{errors.amount}</p>}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Repayment Term</Label>
                                                        <Select 
                                                            value={data.duration_months} 
                                                            onValueChange={(v) => setData('duration_months', v)}
                                                        >
                                                            <SelectTrigger className="h-16 rounded-2xl bg-muted/20 border-border/50 text-sm font-black px-6 uppercase tracking-widest">
                                                                <SelectValue placeholder="Select Duration" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl">
                                                                <SelectItem value="1">1 Month</SelectItem>
                                                                <SelectItem value="3">3 Months</SelectItem>
                                                                <SelectItem value="6">6 Months</SelectItem>
                                                                <SelectItem value="12">12 Months</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl bg-primary/5 p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-primary/10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                                            <Info className="h-8 w-8" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Repayment Amount</p>
                                                            <p className="text-3xl font-black text-primary tracking-tight">
                                                                {data.amount ? (Number(data.amount) * 1.08).toLocaleString() : '0'} <span className="text-xs font-normal">MAD</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-soft">
                                                        8% Fixed Interest Rate
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    className="w-full h-20 rounded-3xl bg-primary text-primary-foreground font-black text-xl uppercase tracking-[0.2em] shadow-elevated group" 
                                                    disabled={processing || !data.amount}
                                                >
                                                    Apply Now <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-3" />
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Balance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border border-border shadow-soft rounded-3xl bg-card p-8 flex items-center justify-between group hover:border-primary/30 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Current Debt</p>
                                    <p className="text-3xl font-black tracking-tighter text-destructive">{totalOwed.toLocaleString()} <span className="text-xs font-normal">MAD</span></p>
                                    <p className="text-[8px] font-bold uppercase text-muted-foreground/40 italic">Active Liabilities</p>
                                </div>
                                <div className="h-16 w-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowUpCircle className="h-8 w-8" />
                                </div>
                            </Card>
                            <Card className="border border-border shadow-soft rounded-3xl bg-card p-8 flex items-center justify-between group hover:border-success/30 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Borrowed</p>
                                    <p className="text-3xl font-black tracking-tighter text-success">{totalBorrowed.toLocaleString()} <span className="text-xs font-normal">MAD</span></p>
                                    <p className="text-[8px] font-bold uppercase text-muted-foreground/40 italic">Credit History</p>
                                </div>
                                <div className="h-16 w-16 rounded-3xl bg-success/10 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowDownCircle className="h-8 w-8" />
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>

                {/* Credit History */}
                <motion.div variants={item}>
                    <Card className="border-none shadow-elevated overflow-hidden rounded-3xl bg-card">
                        <CardHeader className="p-6 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
                                    <History className="h-6 w-6 text-primary" />
                                    Credit <span className="text-primary italic">History.</span>
                                </CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">Previous and active credit records</CardDescription>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-black uppercase tracking-widest">
                                    <CircleDashed className="h-3.5 w-3.5 text-primary" /> Records Updated
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-10 py-6">Amount</th>
                                        <th className="px-10 py-6">Total to Pay</th>
                                        <th className="px-10 py-6 text-center">Status</th>
                                        <th className="px-10 py-6">Due Date</th>
                                        <th className="px-10 py-6 text-right">Request Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {credits.map((credit) => (
                                        <tr key={credit.id} className="group hover:bg-primary/5 transition-colors">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${credit.status === 'paid' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                        <Target className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-xl tracking-tight leading-none mb-1">{credit.amount.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">MAD</span></p>
                                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">ID: #{credit.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 font-bold text-muted-foreground">
                                                {credit.total_to_pay.toLocaleString()} MAD
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border ${
                                                    credit.status === 'paid' ? 'bg-success/10 text-success border-success/20' :
                                                    credit.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' :
                                                    'bg-destructive/10 text-destructive border-destructive/20'
                                                }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                                        credit.status === 'paid' ? 'bg-success' :
                                                        credit.status === 'active' ? 'bg-primary' :
                                                        'bg-destructive'
                                                    }`} />
                                                    {credit.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-xs font-bold text-muted-foreground">
                                                {new Date(credit.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-10 py-8 text-right text-xs text-muted-foreground/50 font-mono">
                                                {new Date(credit.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {credits.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center text-muted-foreground italic font-medium opacity-50">
                                                No previous credit records found.
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
            title: 'Credits & Loans',
            href: '/credits',
        },
    ],
};

