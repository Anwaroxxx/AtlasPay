import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, 
    ArrowRightLeft, 
    DollarSign, 
    TrendingUp, 
    BrainCircuit, 
    AlertTriangle, 
    Plus,
    Target,
    Filter,
    Download,
    Search,
    ChevronDown,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Transactions({ reportData }: any) {
    const { categorySpending, budgets, trends, aiInsights, transactions } = reportData;

    const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value }));
    
    const { data: budgetData, setData: setBudgetData, post: postBudget, processing: budgetProcessing, reset: resetBudget } = useForm({
        category: '',
        amount: '',
    });

    const handleBudgetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postBudget('/budgets', {
            onSuccess: () => resetBudget(),
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
            <Head title="Transactions" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-10 p-4 md:p-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <BrainCircuit className="h-5 w-5 fill-current" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Bank Assistant Insights</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-neutral-900 md:text-6xl dark:text-neutral-50">
                            Your <span className="text-emerald-500">Transactions.</span>
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Track and analyze your spending behavior.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button className="rounded-2xl bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 font-bold">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </motion.div>

                {/* Top Row: AI Insights & Charts */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* AI Insights Card */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <Card className="h-full border-none bg-neutral-900 text-white shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] dark:bg-neutral-950 relative overflow-hidden rounded-[2.5rem]">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <BrainCircuit className="h-48 w-48 text-emerald-500 animate-pulse" />
                            </div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="flex items-center gap-2 text-white text-xl font-black">
                                    Spending Analysis
                                </CardTitle>
                                <CardDescription className="text-neutral-400">Personalized feedback from your assistant.</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="rounded-[2rem] bg-white/5 p-6 backdrop-blur-xl border border-white/5">
                                    <div className="prose prose-invert max-w-none text-sm leading-loose whitespace-pre-wrap font-medium">
                                        {aiInsights}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Category Distribution Chart */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-xl bg-white dark:bg-neutral-900/50 rounded-[2.5rem]">
                            <CardHeader>
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    By Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            {pieData.length === 0 && <Cell fill="#f0f0f0" />}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    {pieData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[10px] font-bold uppercase text-neutral-500">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Middle Row: Monthly Trends & Budgets */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Monthly Trends */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-xl bg-white dark:bg-neutral-900/50 rounded-[2.5rem]">
                            <CardHeader>
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    Spending Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trends}>
                                        <defs>
                                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Budgets */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-xl rounded-[2.5rem]">
                            <CardHeader>
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-orange-500" />
                                    Monthly Budgets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2">
                                    {Object.entries(budgets).length > 0 ? (
                                        Object.entries(budgets).map(([cat, amount]: [string, any]) => {
                                            const actual = categorySpending[cat] || 0;
                                            const percentage = (actual / amount) * 100;
                                            const isNearLimit = percentage >= 90;
                                            
                                            return (
                                                <div key={cat} className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-1">
                                                            <span className="text-sm font-black uppercase tracking-tight">{cat}</span>
                                                            <p className="text-[10px] text-neutral-400 font-bold">{Number(actual).toLocaleString()} of {Number(amount).toLocaleString()} MAD</p>
                                                        </div>
                                                        {isNearLimit && (
                                                            <Badge className="bg-rose-500 text-white font-black animate-pulse text-[10px] py-0 h-5">
                                                                NEAR LIMIT
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                                                            className={`h-full rounded-full ${percentage > 100 ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-neutral-400 italic text-sm">
                                            <Target className="h-12 w-12 mb-4 opacity-10" />
                                            No active budgets defined.
                                        </div>
                                    )}
                                </div>

                                {/* Set Budget Form */}
                                <div className="pt-6 border-t border-neutral-50 dark:border-neutral-900">
                                    <form onSubmit={handleBudgetSubmit} className="flex gap-3">
                                        <Input 
                                            placeholder="Category (e.g. Food)" 
                                            className="h-12 rounded-2xl border-neutral-100 bg-neutral-50 text-sm font-bold"
                                            value={budgetData.category}
                                            onChange={e => setBudgetData('category', e.target.value)}
                                        />
                                        <Input 
                                            type="number" 
                                            placeholder="MAD" 
                                            className="h-12 rounded-2xl border-neutral-100 bg-neutral-50 text-sm font-bold w-32"
                                            value={budgetData.amount}
                                            onChange={e => setBudgetData('amount', e.target.value)}
                                        />
                                        <Button size="icon" className="h-12 w-12 rounded-2xl bg-neutral-900 text-white shrink-0" disabled={budgetProcessing || !budgetData.category || !budgetData.amount}>
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Bottom Section: Transaction History */}
                <motion.div variants={item}>
                    <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-neutral-900 text-white dark:bg-neutral-950 p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black">Transaction History</CardTitle>
                                    <CardDescription className="text-neutral-400">Record of all your movements.</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                        <Input placeholder="Search transactions..." className="h-10 pl-10 rounded-xl bg-white/5 border-white/10 text-xs text-white" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-500">
                                <thead className="bg-neutral-50 text-[10px] uppercase font-black tracking-widest text-neutral-400 dark:bg-neutral-900/50">
                                    <tr>
                                        <th className="px-8 py-5">Method</th>
                                        <th className="px-8 py-5">Category</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 dark:border-neutral-900/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {tx.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight">{tx.method.replace('_', ' ')}</p>
                                                        <p className="text-[10px] font-mono opacity-50 uppercase">#{tx.id.toString().padStart(8, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700">
                                                    {tx.category || 'General'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] font-bold text-neutral-400">
                                                {new Date(tx.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className={`text-lg font-black ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString()} <span className="text-[10px] font-normal">MAD</span>
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                                    tx.status === 'completed' 
                                                        ? 'text-emerald-500 bg-emerald-500/10'
                                                        : tx.status === 'pending'
                                                        ? 'text-amber-500 bg-amber-500/10'
                                                        : 'text-rose-500 bg-rose-500/10'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
