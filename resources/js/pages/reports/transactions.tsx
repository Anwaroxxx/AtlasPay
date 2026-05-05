import { Head, router, usePage } from '@inertiajs/react';
import { reports } from '@/routes';
import { motion, AnimatePresence } from 'framer-motion';
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
    X
} from 'lucide-react';
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
    Tooltip
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-destructive)', '#8b5cf6', '#ec4899'];

interface AIInsights {
    summary: string;
    critical_insight: string;
    recommendations: string[];
}

export default function Transactions({ reportData }: any) {
    const { props } = usePage();
    const auth = (props as any).auth;
    const { categorySpending, budgets, trends, aiInsights, transactions, filters } = reportData;
    
    // Handle case where aiInsights might still be a string (from old cache or fallback)
    const insights: AIInsights = typeof aiInsights === 'string' 
        ? { summary: aiInsights, critical_insight: 'Analysis in progress', recommendations: [] }
        : aiInsights;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Echo && auth?.user) {
            const channel = `App.Models.User.${auth.user.id}`;
            (window as any).Echo.private(channel)
                .listen('.transaction.created', (e: any) => {
                    router.reload({ only: ['reportData'] });
                });

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth?.user?.id]);

    const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value }));

    const handleSearch = useCallback(
        debounce((val: string) => {
            router.get(reports.transactions.url({ ...filters, search: val }), {}, { preserveState: true, preserveScroll: true });
        }, 500),
        [filters]
    );

    const updateFilter = (newFilters: any) => {
        router.get(reports.transactions.url({ ...filters, ...newFilters }), {}, { preserveState: true, preserveScroll: true });
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
            transition: { staggerChildren: 0.1 }
        }
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Transactions" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Account Analytics</span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter md:text-5xl uppercase">
                            Your <span className="text-primary italic">Transactions.</span>
                        </h1>
                        <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-xl">Analyze your spending patterns and manage your transaction history.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={exportPdf} variant="outline" className="h-10 rounded-xl px-4 gap-2 border-border/50 bg-card/50 backdrop-blur-md">
                            <Download className="h-3.5 w-3.5" /> <span className="font-bold uppercase tracking-widest text-[9px]">Export History</span>
                        </Button>
                        <Button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`h-10 rounded-xl px-4 gap-2 font-bold shadow-soft transition-all ${isFilterOpen ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}>
                            <Filter className="h-3.5 w-3.5" /> <span className="font-bold uppercase tracking-widest text-[9px]">Filter Results</span>
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
                            <Card className="border-none shadow-elevated bg-card/50 backdrop-blur-md rounded-3xl p-8 mb-8 border border-primary/10">
                                <div className="grid gap-6 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</Label>
                                        <select 
                                            value={filters.type || 'all'} 
                                            onChange={e => updateFilter({ type: e.target.value })}
                                            className="w-full h-12 rounded-xl bg-muted/20 border-border/50 text-xs font-black uppercase tracking-widest px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="all">All Movements</option>
                                            <option value="transfer">Transfers</option>
                                            <option value="deposit">Deposits</option>
                                            <option value="cash">Cash Out</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input 
                                                type="date" 
                                                value={filters.date_from || ''} 
                                                onChange={e => updateFilter({ date_from: e.target.value })}
                                                className="h-12 pl-10 rounded-xl bg-muted/20 border-border/50 text-xs font-black" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input 
                                                type="date" 
                                                value={filters.date_to || ''} 
                                                onChange={e => updateFilter({ date_to: e.target.value })}
                                                className="h-12 pl-10 rounded-xl bg-muted/20 border-border/50 text-xs font-black" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <Button onClick={clearFilters} variant="ghost" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive">
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
                        <Card className="h-full border-none bg-neutral-900 text-white shadow-elevated rounded-3xl dark:bg-black relative overflow-hidden group">
                            <div className="absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none" />
                            <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                                <BrainCircuit className="h-64 w-64 text-primary animate-pulse" />
                            </div>
                            <CardHeader className="relative z-10 p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                                            <Zap className="h-5 w-5 fill-current" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">Neural <span className="text-primary italic">Insight.</span></CardTitle>
                                            <CardDescription className="text-muted-foreground font-black uppercase tracking-widest text-[9px] mt-1">Real-time spending analysis</CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-primary text-white font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest border-none shadow-lg shadow-primary/20">Active Engine</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 p-8 pt-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Executive Summary</p>
                                            <p className="text-lg font-medium leading-relaxed italic opacity-90">"{insights.summary}"</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Target className="h-3 w-3" /> Critical Marker
                                            </p>
                                            <p className="text-xs font-bold text-white/80">{insights.critical_insight}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Actionable Directives</p>
                                        <div className="space-y-3">
                                            {insights.recommendations.map((tip, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black shrink-0">{i+1}</div>
                                                    <p className="text-xs font-medium text-white/70 leading-normal">{tip}</p>
                                                </div>
                                            ))}
                                            {insights.recommendations.length === 0 && (
                                                <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Waiting for more signal...</p>
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
                        <Card className="h-full border border-border shadow-soft bg-card rounded-3xl glass-card">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                    Spending Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 h-[250px] flex flex-col justify-between">
                                <div className="flex-1 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData.length > 0 ? pieData : [{ name: 'Empty Signal', value: 1 }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={95}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                                {pieData.length === 0 && <Cell fill="var(--color-muted)" />}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ 
                                                    background: 'var(--color-popover)', 
                                                    borderRadius: '16px', 
                                                    border: '1px solid var(--color-border)', 
                                                    boxShadow: 'var(--shadow-elevated)',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    {pieData.slice(0, 4).map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[9px] font-black uppercase text-muted-foreground truncate">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Bottom Section: Transaction History */}
                <motion.div variants={item}>
                    <Card className="border border-border shadow-elevated overflow-hidden rounded-3xl bg-card">
                        <CardHeader className="bg-neutral-900 text-white dark:bg-black p-6 relative overflow-hidden">
                            <div className="absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-1 text-center md:text-left">
                                    <CardTitle className="text-3xl font-black uppercase tracking-tight text-white">Transaction <span className="text-primary italic">History.</span></CardTitle>
                                    <CardDescription className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest mt-1">Complete record of your activities</CardDescription>
                                </div>
                                <div className="relative group w-full md:w-auto">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input 
                                        placeholder="Search by category or method..." 
                                        className="h-12 pl-12 pr-6 rounded-2xl bg-white/5 border-white/10 text-xs text-white w-full md:w-80 focus:ring-primary/20" 
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto scrollbar-none">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Method</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.data.map((tx: any) => (
                                        <tr key={tx.id} className="group hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-soft transition-transform group-hover:scale-110 ${tx.type === 'deposit' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                                        {tx.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-foreground uppercase tracking-tight text-sm leading-none mb-1">{tx.method.replace('_', ' ')}</p>
                                                        <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">ID: #{tx.id.toString().padStart(8, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-black text-[8px] uppercase tracking-[0.2em] px-3 py-1 border-border bg-muted/20">
                                                    {tx.category || 'GENERAL'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-base font-black tracking-tighter ${tx.type === 'deposit' ? 'text-success' : 'text-foreground'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString()} <span className="text-[9px] font-normal opacity-60">MAD</span>
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest border shadow-soft ${
                                                    tx.status === 'completed' 
                                                        ? 'text-success bg-success/10 border-success/20'
                                                        : tx.status === 'pending'
                                                        ? 'text-warning bg-warning/10 border-warning/20'
                                                        : 'text-destructive bg-destructive/10 border-destructive/20'
                                                }`}>
                                                    <div className={`h-1 w-1 rounded-full ${tx.status === 'completed' ? 'bg-success' : tx.status === 'pending' ? 'bg-warning' : 'bg-destructive'}`} />
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic font-medium opacity-50">
                                                No transactions found matching your filters.
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

Transactions.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: '/reports/transactions',
        },
    ],
};

