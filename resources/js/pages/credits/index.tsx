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
    Target,
} from 'lucide-react';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis,
    Tooltip,
} from 'recharts';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    {
        title: 'Account Balance',
        desc: 'Maintain a balance above 2,000 MAD for better credit eligibility.',
        impact: '+45 pts',
    },
    {
        title: 'On-time Payments',
        desc: 'Pay your credit installments before the due date to boost your score.',
        impact: '+30 pts',
    },
    {
        title: 'Regular Activity',
        desc: 'Use AtlasPay for your daily transactions to show consistent account usage.',
        impact: '+15 pts',
    },
];

export default function Credits({
    credits,
    activeCredit,
    creditScore,
    maxCreditAmount,
}: Props) {
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

    const radialData = [
        {
            name: 'Score',
            value: creditScore,
            fill:
                creditScore >= 700
                    ? 'var(--color-success)'
                    : creditScore >= 500
                      ? 'var(--color-warning)'
                      : 'var(--color-destructive)',
        },
    ];

    const totalBorrowed = credits.reduce((acc, c) => acc + c.amount, 0);
    const totalOwed = activeCredit
        ? activeCredit.total_to_pay - activeCredit.repaid_amount
        : 0;

    return (
        <>
            <Head title="Credits & Loans" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-6 md:p-8"
            >
                {/* Header */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                            Credit Management
                        </span>
                    </div>
                    <h1 className="font-display text-4xl leading-none font-black tracking-tighter uppercase md:text-6xl">
                        Credit{' '}
                        <span className="text-primary italic">Access.</span>
                    </h1>
                    <p className="max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
                        Apply for credit instantly based on your account
                        activity. Transparent rates and flexible repayment
                        options.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Credit Score Gauge & Tips */}
                    <motion.div
                        variants={item}
                        className="space-y-8 lg:col-span-4"
                    >
                        <Card className="shadow-elevated relative overflow-hidden rounded-3xl border-none bg-neutral-900 text-white dark:bg-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
                            <div className="moroccan-pattern absolute inset-0 opacity-[0.03]" />

                            <CardHeader className="relative z-10 p-8 pb-0">
                                <CardTitle className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Credit Score
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="relative z-10 flex flex-col items-center p-8">
                                <div className="relative h-64 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
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
                                        <span className="text-7xl font-black tracking-tight">
                                            {creditScore}
                                        </span>
                                        <span className="text-[10px] font-black tracking-widest text-muted-foreground/50 uppercase">
                                            Points
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 w-full space-y-4">
                                    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                                Credit Limit
                                            </p>
                                            <p className="text-xl font-black text-primary">
                                                {maxCreditAmount.toLocaleString()}{' '}
                                                MAD
                                            </p>
                                        </div>
                                        <Badge
                                            className={`border-none px-3 py-1 text-[9px] font-black ${creditScore >= 700 ? 'bg-success text-white' : 'bg-warning text-black'}`}
                                        >
                                            {creditScore >= 700
                                                ? 'EXCELLENT'
                                                : 'GOOD'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft glass-card rounded-3xl border border-border bg-card p-8">
                            <CardHeader className="mb-6 p-0">
                                <CardTitle className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                    <BrainCircuit className="h-4 w-4 text-primary" />
                                    How to Improve
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0">
                                {scoreTips.map((tip, i) => (
                                    <div
                                        key={i}
                                        className="group rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:border-primary/30"
                                    >
                                        <div className="mb-1 flex items-start justify-between">
                                            <p className="text-xs font-black tracking-tight uppercase">
                                                {tip.title}
                                            </p>
                                            <span className="text-[10px] font-black text-success">
                                                {tip.impact}
                                            </span>
                                        </div>
                                        <p className="text-[10px] leading-relaxed font-medium text-muted-foreground">
                                            {tip.desc}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Active Credit or Request Form */}
                    <motion.div
                        variants={item}
                        className="space-y-8 lg:col-span-8"
                    >
                        <AnimatePresence mode="wait">
                            {activeCredit ? (
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full"
                                >
                                    <Card className="shadow-elevated group glass-card relative h-full overflow-hidden rounded-3xl border-none bg-card">
                                        <div className="pointer-events-none absolute top-0 right-0 p-6 opacity-[0.02] transition-opacity group-hover:opacity-[0.05] md:p-8">
                                            <Zap className="h-80 w-80" />
                                        </div>
                                        <CardHeader className="p-6 pb-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-3xl font-black tracking-tight uppercase">
                                                        Active{' '}
                                                        <span className="text-primary italic">
                                                            Credit.
                                                        </span>
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 text-[10px] font-black tracking-widest uppercase">
                                                        Current Repayment Status
                                                    </CardDescription>
                                                </div>
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-10 p-6">
                                            <div className="grid gap-6 md:grid-cols-3">
                                                <div className="space-y-2 rounded-2xl border border-border/50 bg-muted/30 p-6">
                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Amount Owed
                                                    </p>
                                                    <p className="text-3xl font-black tracking-tight">
                                                        {(
                                                            activeCredit.total_to_pay -
                                                            activeCredit.repaid_amount
                                                        ).toLocaleString()}{' '}
                                                        <span className="text-xs font-normal">
                                                            MAD
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="space-y-2 rounded-2xl border border-border/50 bg-muted/30 p-6">
                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Due Date
                                                    </p>
                                                    <p className="flex items-center gap-3 text-xl font-black">
                                                        <Clock className="h-5 w-5 text-primary" />
                                                        {new Date(
                                                            activeCredit.due_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 rounded-2xl border border-border/50 bg-muted/30 p-6">
                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Interest Rate
                                                    </p>
                                                    <p className="text-xl font-black tracking-tight text-primary uppercase">
                                                        {
                                                            activeCredit.interest_rate
                                                        }
                                                        % Fixed
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-end justify-between px-2">
                                                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Repayment Progress
                                                    </span>
                                                    <span className="text-3xl font-black tracking-tighter">
                                                        {Math.round(
                                                            (activeCredit.repaid_amount /
                                                                activeCredit.total_to_pay) *
                                                                100,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="h-6 w-full overflow-hidden rounded-full border border-border/50 bg-muted/50 p-1.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${(activeCredit.repaid_amount / activeCredit.total_to_pay) * 100}%`,
                                                        }}
                                                        className="h-full rounded-full bg-primary"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() =>
                                                    repay(activeCredit.id)
                                                }
                                                className="shadow-elevated group h-20 w-full rounded-2xl bg-primary text-xl font-black tracking-widest text-primary-foreground uppercase"
                                                disabled={processing}
                                            >
                                                Pay Installment{' '}
                                                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
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
                                    <Card className="shadow-elevated h-full rounded-3xl border-none bg-card p-2">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-3xl font-black tracking-tight uppercase">
                                                Request{' '}
                                                <span className="text-primary italic">
                                                    Credit.
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                Get instant funding for your
                                                needs
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-4">
                                            <form
                                                onSubmit={submit}
                                                className="space-y-8"
                                            >
                                                <div className="grid gap-8 md:grid-cols-2">
                                                    <div className="space-y-3">
                                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                            Loan Amount (MAD)
                                                        </Label>
                                                        <div className="group relative">
                                                            <div className="absolute top-1/2 left-5 flex h-6 w-6 -translate-y-1/2 items-center justify-center font-black text-muted-foreground transition-colors group-focus-within:text-primary">
                                                                DH
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="h-16 rounded-2xl border-border/50 bg-muted/20 pr-6 pl-14 text-2xl font-black transition-all focus:ring-primary/10"
                                                                value={
                                                                    data.amount
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'amount',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        {errors.amount && (
                                                            <p className="px-1 text-xs font-black text-destructive">
                                                                {errors.amount}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                            Repayment Term
                                                        </Label>
                                                        <Select
                                                            value={
                                                                data.duration_months
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                setData(
                                                                    'duration_months',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-16 rounded-2xl border-border/50 bg-muted/20 px-6 text-sm font-black tracking-widest uppercase">
                                                                <SelectValue placeholder="Select Duration" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl">
                                                                <SelectItem value="1">
                                                                    1 Month
                                                                </SelectItem>
                                                                <SelectItem value="3">
                                                                    3 Months
                                                                </SelectItem>
                                                                <SelectItem value="6">
                                                                    6 Months
                                                                </SelectItem>
                                                                <SelectItem value="12">
                                                                    12 Months
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-primary/10 bg-primary/5 p-8 transition-all hover:bg-primary/10 md:flex-row">
                                                    <div className="flex items-center gap-5">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                                                            <Info className="h-8 w-8" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                Total Repayment
                                                                Amount
                                                            </p>
                                                            <p className="text-3xl font-black tracking-tight text-primary">
                                                                {data.amount
                                                                    ? (
                                                                          Number(
                                                                              data.amount,
                                                                          ) *
                                                                          1.08
                                                                      ).toLocaleString()
                                                                    : '0'}{' '}
                                                                <span className="text-xs font-normal">
                                                                    MAD
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="shadow-soft rounded-xl bg-primary px-4 py-2 text-[10px] font-black tracking-widest text-primary-foreground uppercase">
                                                        8% Fixed Interest Rate
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="shadow-elevated group h-20 w-full rounded-3xl bg-primary text-xl font-black tracking-[0.2em] text-primary-foreground uppercase"
                                                    disabled={
                                                        processing ||
                                                        !data.amount
                                                    }
                                                >
                                                    Apply Now{' '}
                                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-3" />
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Balance Summary */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <Card className="shadow-soft group flex items-center justify-between rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/30">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                        Current Debt
                                    </p>
                                    <p className="text-3xl font-black tracking-tighter text-destructive">
                                        {totalOwed.toLocaleString()}{' '}
                                        <span className="text-xs font-normal">
                                            MAD
                                        </span>
                                    </p>
                                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase italic">
                                        Active Liabilities
                                    </p>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive transition-transform group-hover:scale-110">
                                    <ArrowUpCircle className="h-8 w-8" />
                                </div>
                            </Card>
                            <Card className="shadow-soft group flex items-center justify-between rounded-3xl border border-border bg-card p-8 transition-colors hover:border-success/30">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                        Total Borrowed
                                    </p>
                                    <p className="text-3xl font-black tracking-tighter text-success">
                                        {totalBorrowed.toLocaleString()}{' '}
                                        <span className="text-xs font-normal">
                                            MAD
                                        </span>
                                    </p>
                                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase italic">
                                        Credit History
                                    </p>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-success/10 text-success transition-transform group-hover:scale-110">
                                    <ArrowDownCircle className="h-8 w-8" />
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>

                {/* Credit History */}
                <motion.div variants={item}>
                    <Card className="shadow-elevated overflow-hidden rounded-3xl border-none bg-card">
                        <CardHeader className="flex flex-col justify-between gap-6 border-b border-border bg-muted/20 p-6 md:flex-row md:items-center">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
                                    <History className="h-6 w-6 text-primary" />
                                    Credit{' '}
                                    <span className="text-primary italic">
                                        History.
                                    </span>
                                </CardTitle>
                                <CardDescription className="mt-1 text-[10px] font-black tracking-widest uppercase">
                                    Previous and active credit records
                                </CardDescription>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-2 text-[10px] font-black tracking-widest uppercase">
                                    <CircleDashed className="h-3.5 w-3.5 text-primary" />{' '}
                                    Records Updated
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/30 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-10 py-6">Amount</th>
                                        <th className="px-10 py-6">
                                            Total to Pay
                                        </th>
                                        <th className="px-10 py-6 text-center">
                                            Status
                                        </th>
                                        <th className="px-10 py-6">Due Date</th>
                                        <th className="px-10 py-6 text-right">
                                            Request Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {credits.map((credit) => (
                                        <tr
                                            key={credit.id}
                                            className="group transition-colors hover:bg-primary/5"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${credit.status === 'paid' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}
                                                    >
                                                        <Target className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xl leading-none font-black tracking-tight">
                                                            {credit.amount.toLocaleString()}{' '}
                                                            <span className="text-[10px] font-normal text-muted-foreground">
                                                                MAD
                                                            </span>
                                                        </p>
                                                        <p className="text-[8px] font-black tracking-widest uppercase opacity-40">
                                                            ID: #{credit.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 font-bold text-muted-foreground">
                                                {credit.total_to_pay.toLocaleString()}{' '}
                                                MAD
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[9px] font-black tracking-widest uppercase ${
                                                        credit.status === 'paid'
                                                            ? 'border-success/20 bg-success/10 text-success'
                                                            : credit.status ===
                                                                'active'
                                                              ? 'border-primary/20 bg-primary/10 text-primary'
                                                              : 'border-destructive/20 bg-destructive/10 text-destructive'
                                                    }`}
                                                >
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            credit.status ===
                                                            'paid'
                                                                ? 'bg-success'
                                                                : credit.status ===
                                                                    'active'
                                                                  ? 'bg-primary'
                                                                  : 'bg-destructive'
                                                        }`}
                                                    />
                                                    {credit.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-xs font-bold text-muted-foreground">
                                                {new Date(
                                                    credit.due_date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-10 py-8 text-right font-mono text-xs text-muted-foreground/50">
                                                {new Date(
                                                    credit.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {credits.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-10 py-32 text-center font-medium text-muted-foreground italic opacity-50"
                                            >
                                                No previous credit records
                                                found.
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
