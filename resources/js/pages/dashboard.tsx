import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    CreditCard, 
    Plus, 
    ArrowUpRight, 
    ArrowDownLeft,
    Wallet,
    Shield,
    History,
    ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface Props {
    stats: {
        totalBalance: number;
        creditScore: number;
        activeLoan: number;
        currency: string;
    };
    recentTransactions: any[];
    chartData: any[];
}

export default function Dashboard({ stats, recentTransactions, chartData }: Props) {
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
            <Head title="Dashboard" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-8 p-4 md:p-8"
            >
                {/* Hero Balance Section */}
                <motion.div variants={item} className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 p-8 text-white shadow-2xl dark:bg-neutral-950">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
                    
                    <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Shield className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Secure Bank Account</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-neutral-400">Total Liquid Assets</p>
                                <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
                                    {stats.totalBalance.toLocaleString()} <span className="text-2xl font-normal text-neutral-500">{stats.currency}</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button className="rounded-full bg-emerald-500 px-6 font-bold text-neutral-900 hover:bg-emerald-400">
                                    <Plus className="mr-2 h-4 w-4" /> Deposit
                                </Button>
                                <Button variant="outline" className="rounded-full border-neutral-700 bg-transparent px-6 font-bold text-white hover:bg-white/5">
                                    <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:w-80">
                            <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Credit Score</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.creditScore}</p>
                                <div className="mt-2 h-1 w-full rounded-full bg-neutral-800">
                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(stats.creditScore / 1000) * 100}%` }} />
                                </div>
                            </div>
                            <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Active Debt</p>
                                <p className="text-2xl font-bold text-rose-400">{stats.activeLoan.toLocaleString()}</p>
                                <p className="text-[10px] text-neutral-500 italic">Settlement pending</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Insights Chart */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <Card className="h-full border-none shadow-xl bg-white dark:bg-neutral-900/50">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        Financial Growth
                                    </CardTitle>
                                </div>
                                <select className="text-xs bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg px-2 py-1">
                                    <option>Last 7 Days</option>
                                    <option>Last Month</option>
                                </select>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#10b981" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorAmount)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Transactions */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <History className="h-4 w-4 text-blue-500" />
                                    Live Activity
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {recentTransactions.map((tx: any) => (
                                        <div key={tx.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold capitalize">{tx.method.replace('_', ' ')}</p>
                                                    <p className="text-[10px] text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-black ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] opacity-50 capitalize">{tx.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <div className="py-12 text-center text-neutral-400 italic text-sm">
                                            No recent movements.
                                        </div>
                                    )}
                                </div>
                                <Button className="mt-8 w-full rounded-2xl bg-neutral-50 text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50">
                                    View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
