import { Head, router, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import {
    Activity,
    TrendingUp,
    BrainCircuit,
    Plus,
    Target,
    Filter,
    Download,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Zap,
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
    PiggyBank,
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
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
import { cn } from '@/lib/utils';
import { reports } from '@/custom-routes';

const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-destructive)',
    '#8b5cf6',
    '#ec4899',
];

interface AIInsights {
    summary: string;
    critical_insight: string;
    recommendations: string[];
}

export default function Transactions({ reportData }: any) {
    const { props } = usePage();
    const auth = (props as any).auth;
    const {
        categorySpending,
        budgets,
        trends,
        aiInsights,
        transactions,
        filters,
    } = reportData;

    // Handle case where aiInsights might still be a string (from old cache or fallback)
    const insights: AIInsights =
        typeof aiInsights === 'string'
            ? {
                  summary: aiInsights,
                  critical_insight: 'Analysis in progress',
                  recommendations: [],
              }
            : aiInsights;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

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
                    router.reload({ only: ['reportData'] });
                },
            );

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth?.user?.id]);

    const pieData = Object.entries(categorySpending).map(([name, value]) => ({
        name,
        value,
    }));

    const handleSearch = useCallback(
        debounce((val: string) => {
            router.get(
                reports.transactions.url({ ...filters, search: val }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['reportData', 'transactions', 'filters'],
                },
            );
        }, 500),
        [filters],
    );

    const updateFilter = (newFilters: any) => {
        router.get(
            reports.transactions.url({ ...filters, ...newFilters }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['reportData', 'transactions', 'filters'],
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        router.get(reports.transactions.url({}), {});
    };

    const exportPdf = () => {
        window.location.href = reports.transactions.pdf.url(filters);
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
            <Head title="Transactions" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-8"
            >
                {/* Header */}
                <motion.div
                    variants={item}
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                                Account Analytics
                            </span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter uppercase md:text-5xl">
                            Your{' '}
                            <span className="text-primary italic">
                                Transactions.
                            </span>
                        </h1>
                        <p className="max-w-xl text-xs font-medium text-muted-foreground md:text-sm">
                            Analyze your spending patterns and manage your
                            transaction history.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={exportPdf}
                            variant="outline"
                            className="h-10 gap-2 rounded-xl border-border/50 bg-card/50 px-4 backdrop-blur-md"
                        >
                            <Download className="h-3.5 w-3.5" />{' '}
                            <span className="text-[9px] font-bold tracking-widest uppercase">
                                Export History
                            </span>
                        </Button>
                        <Button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`shadow-soft h-10 gap-2 rounded-xl px-4 font-bold transition-all ${isFilterOpen ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-foreground'}`}
                        >
                            <Filter className="h-3.5 w-3.5" />{' '}
                            <span className="text-[9px] font-bold tracking-widest uppercase">
                                Filter Results
                            </span>
                        </Button>
                    </div>
                </motion.div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="shadow-elevated mb-8 rounded-3xl border border-none border-primary/10 bg-card/50 p-8 backdrop-blur-md">
                                <div className="grid gap-6 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            Type
                                        </Label>
                                        <select
                                            value={filters.type || 'all'}
                                            onChange={(e) =>
                                                updateFilter({
                                                    type: e.target.value,
                                                })
                                            }
                                            className="h-12 w-full rounded-xl border-border/50 bg-muted/20 px-4 text-xs font-black tracking-widest uppercase outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="all">
                                                All Movements
                                            </option>
                                            <option value="transfer">
                                                Transfers
                                            </option>
                                            <option value="deposit">
                                                Deposits
                                            </option>
                                            <option value="cash">
                                                Cash Out
                                            </option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            From Date
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={filters.date_from || ''}
                                                onChange={(e) =>
                                                    updateFilter({
                                                        date_from:
                                                            e.target.value,
                                                    })
                                                }
                                                className="h-12 rounded-xl border-border/50 bg-muted/20 pl-10 text-xs font-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            To Date
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={filters.date_to || ''}
                                                onChange={(e) =>
                                                    updateFilter({
                                                        date_to: e.target.value,
                                                    })
                                                }
                                                className="h-12 rounded-xl border-border/50 bg-muted/20 pl-10 text-xs font-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <Button
                                            onClick={clearFilters}
                                            variant="ghost"
                                            className="h-12 flex-1 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reset
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Row: AI Insights & Charts */}
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* AI Insights Card */}
                    <motion.div variants={item} className="lg:col-span-8">
                        <Card className="shadow-elevated group relative h-full overflow-hidden rounded-3xl border-none bg-neutral-900 text-white dark:bg-black">
                            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] transition-opacity group-hover:opacity-[0.1] md:p-8">
                                <BrainCircuit className="h-64 w-64 animate-pulse text-primary" />
                            </div>
                            <CardHeader className="relative z-10 p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/20 text-primary">
                                            <Zap className="h-5 w-5 fill-current" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black tracking-tight text-white uppercase">
                                                Neural{' '}
                                                <span className="text-primary italic">
                                                    Insight.
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                                                Real-time spending analysis
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="rounded-full border-none bg-primary px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg shadow-primary/20">
                                        Active Engine
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 p-8 pt-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">
                                                Executive Summary
                                            </p>
                                            <p className="text-lg leading-relaxed font-medium italic opacity-90">
                                                "{insights.summary}"
                                            </p>
                                        </div>
                                        <div className="space-y-2 rounded-2xl border border-primary/20 bg-primary/10 p-5">
                                            <p className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                                                <Target className="h-3 w-3" />{' '}
                                                Critical Marker
                                            </p>
                                            <p className="text-xs font-bold text-white/80">
                                                {insights.critical_insight}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">
                                            Actionable Directives
                                        </p>
                                        <div className="space-y-3">
                                            {insights.recommendations.map(
                                                (tip, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors group-hover:bg-white/10"
                                                    >
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-[10px] font-black text-primary">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-xs leading-normal font-medium text-white/70">
                                                            {tip}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                            {insights.recommendations.length ===
                                                0 && (
                                                <div className="rounded-2xl border-2 border-dashed border-white/10 p-8 text-center">
                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Waiting for more
                                                        signal...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Category Distribution Chart */}
                    <motion.div variants={item} className="lg:col-span-4">
                        <Card className="shadow-soft glass-card flex h-full flex-col rounded-3xl border border-border bg-card">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                    Spending Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex min-h-[400px] flex-1 flex-col p-8">
                                <div className="min-h-[300px] w-full flex-1">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    pieData.length > 0
                                                        ? pieData
                                                        : [
                                                              {
                                                                  name: 'Empty Signal',
                                                                  value: 1,
                                                              },
                                                          ]
                                                }
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                                {pieData.length === 0 && (
                                                    <Cell fill="var(--color-muted)" />
                                                )}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background:
                                                        'var(--color-popover)',
                                                    borderRadius: '16px',
                                                    border: '1px solid var(--color-border)',
                                                    boxShadow:
                                                        'var(--shadow-elevated)',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    {pieData.slice(0, 6).map((entry, index) => (
                                        <div
                                            key={entry.name}
                                            className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-3"
                                        >
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ],
                                                }}
                                            />
                                            <span className="truncate text-[9px] font-black text-muted-foreground uppercase">
                                                {entry.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Middle Row: Monthly Trends */}
                <motion.div variants={item} className="mt-8 mb-8">
                    <Card className="shadow-elevated overflow-hidden rounded-3xl border border-border bg-card">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight uppercase">
                                        Financial{' '}
                                        <span className="text-primary italic">
                                            Momentum.
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                        Monthly spending velocity (Last 6
                                        Months)
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-[9px] font-black tracking-widest uppercase opacity-60">
                                            Total Expenditure
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[300px] p-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={reportData.trends}>
                                    <defs>
                                        <linearGradient
                                            id="colorTotal"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="var(--color-border)"
                                        opacity={0.5}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fontWeight: 900,
                                            fill: 'var(--color-muted-foreground)',
                                        }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fontWeight: 900,
                                            fill: 'var(--color-muted-foreground)',
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--color-popover)',
                                            borderRadius: '16px',
                                            border: '1px solid var(--color-border)',
                                            boxShadow: 'var(--shadow-elevated)',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-primary)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bottom Section: Transaction History */}
                <motion.div variants={item}>
                    <Card className="shadow-elevated overflow-hidden rounded-3xl border border-border bg-card">
                        <CardHeader className="relative overflow-hidden bg-neutral-900 p-6 text-white dark:bg-black">
                            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                                <div className="space-y-1 text-center md:text-left">
                                    <CardTitle className="text-3xl font-black tracking-tight text-white uppercase">
                                        Transaction{' '}
                                        <span className="text-primary italic">
                                            History.
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                        Complete record of your activities
                                    </CardDescription>
                                </div>
                                <div className="group relative w-full md:w-auto">
                                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        placeholder="Search by category or method..."
                                        className="h-12 w-full rounded-2xl border-white/10 bg-white/5 pr-6 pl-12 text-xs text-white focus:ring-primary/20 md:w-80"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="scrollbar-none overflow-x-auto p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/30 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Method</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4 text-right">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <AnimatePresence mode="wait">
                                        {transactions.data.map((tx: any, index: number) => (
                                            <motion.tr
                                                key={tx.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group transition-colors hover:bg-primary/5"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`shadow-soft flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${tx.is_income ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
                                                        >
                                                            {tx.is_income ? (
                                                                <ArrowDownLeft className="h-5 w-5" />
                                                            ) : (
                                                                <ArrowUpRight className="h-5 w-5" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-sm leading-none font-black tracking-tight text-foreground uppercase">
                                                                {tx.method.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </p>
                                                            <p className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase opacity-60">
                                                                ID: #
                                                                {tx.id
                                                                    .toString()
                                                                    .padStart(
                                                                        8,
                                                                        '0',
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-border bg-muted/20 px-3 py-1 text-[8px] font-black tracking-[0.2em] uppercase"
                                                    >
                                                        {tx.category || 'GENERAL'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                                                    {new Date(
                                                        tx.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p
                                                        className={`text-base font-black tracking-tighter ${tx.is_income ? 'text-success' : 'text-foreground'}`}
                                                    >
                                                        {tx.is_income
                                                            ? '+'
                                                            : '-'}
                                                        {Number(
                                                            tx.amount,
                                                        ).toLocaleString()}{' '}
                                                        <span className="text-[9px] font-normal opacity-60">
                                                            MAD
                                                        </span>
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span
                                                        className={`shadow-soft inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[8px] font-black tracking-widest uppercase ${
                                                            tx.status ===
                                                            'completed'
                                                                ? 'border-success/20 bg-success/10 text-success'
                                                                : tx.status ===
                                                                    'pending'
                                                                  ? 'border-warning/20 bg-warning/10 text-warning'
                                                                  : tx.status ===
                                                                      'cancelled'
                                                                    ? 'border-slate-500/20 bg-slate-500/10 text-slate-500'
                                                                    : 'border-destructive/20 bg-destructive/10 text-destructive'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`h-1 w-1 rounded-full ${tx.status === 'completed' ? 'bg-success' : tx.status === 'pending' ? 'bg-warning' : tx.status === 'cancelled' ? 'bg-slate-500' : 'bg-destructive'}`}
                                                        />
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-20 text-center font-medium text-muted-foreground italic opacity-50"
                                            >
                                                No transactions found matching
                                                your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>

                        {/* Pagination Footer */}
                        {transactions.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-border bg-muted/10 p-6">
                                <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                    Showing {transactions.from} to {transactions.to} of {transactions.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    {transactions.links.map((link: any, i: number) => {
                                        // Filter out the prev/next labels from the main list
                                        if (link.label.includes('Previous') || link.label.includes('Next')) return null;
                                        
                                        return (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Link
                                                    href={link.url || '#'}
                                                    className={cn(
                                                        "flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-black transition-all",
                                                        link.active 
                                                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                                            : "border-border/50 bg-card hover:border-primary/50 text-foreground"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </motion.div>
                                        );
                                    })}

                                    <div className="ml-4 flex gap-2">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={transactions.prev_page_url || '#'}
                                                className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card transition-all",
                                                    !transactions.prev_page_url && "opacity-30 pointer-events-none"
                                                )}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={transactions.next_page_url || '#'}
                                                className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card transition-all",
                                                    !transactions.next_page_url && "opacity-30 pointer-events-none"
                                                )}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </motion.div>
        </>
    );
}

Transactions.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: '/reports/transactions',
        },
    ],
};
