import { Head, Link } from '@inertiajs/react';
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
import { Badge } from '@/components/ui/badge';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface Account {
    id: number;
    account_number: string;
    balance: number;
    type: string;
    currency: string;
    status: string;
}

interface Props {
    stats: {
        totalBalance: number;
        creditScore: number;
        activeLoan: number;
        currency: string;
    };
    accounts: Account[];
    recentTransactions: any[];
    chartData: any[];
}

export default function Dashboard({ stats, accounts, recentTransactions, chartData }: Props) {
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
                className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8"
            >
                {/* Hero Balance Section */}
                <motion.div variants={item} className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-neutral-900 p-6 md:p-8 text-white shadow-2xl dark:bg-neutral-950">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
                    
                    <div className="relative z-10 flex flex-col gap-6 md:gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Shield className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Secure Bank Account</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-neutral-400 text-sm">Total Liquid Assets</p>
                                <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-7xl">
                                    {stats.totalBalance.toLocaleString()} <span className="text-lg font-normal text-neutral-500 sm:text-2xl">{stats.currency}</span>
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button className="rounded-full bg-emerald-500 px-5 md:px-6 font-bold text-neutral-900 hover:bg-emerald-400 text-sm">
                                    <Plus className="mr-2 h-4 w-4" /> Deposit
                                </Button>
                                <Link href="/transfer">
                                    <Button variant="outline" className="rounded-full border-neutral-700 bg-transparent px-5 md:px-6 font-bold text-white hover:bg-white/5 text-sm">
                                        <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 md:w-80">
                            <div className="rounded-2xl md:rounded-3xl bg-white/5 p-3 md:p-4 backdrop-blur-md">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Credit Score</p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-400">{stats.creditScore}</p>
                                <div className="mt-2 h-1 w-full rounded-full bg-neutral-800">
                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(stats.creditScore / 1000) * 100}%` }} />
                                </div>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl bg-white/5 p-3 md:p-4 backdrop-blur-md">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Active Debt</p>
                                <p className="text-xl md:text-2xl font-bold text-rose-400">{stats.activeLoan.toLocaleString()}</p>
                                <p className="text-[10px] text-neutral-500 italic">Settlement pending</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Accounts Row */}
                {accounts && accounts.length > 0 && (
                    <motion.div variants={item}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-emerald-500" />
                                Your Accounts
                            </h2>
                            <Link href="/transfer">
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-500 hover:text-emerald-400">
                                    Transfer <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {accounts.map((account: Account) => (
                                <Card key={account.id} className="border-none shadow-lg rounded-2xl md:rounded-3xl bg-white dark:bg-neutral-900/50 hover:shadow-xl transition-shadow">
                                    <CardContent className="p-4 md:p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase">
                                                {account.type}
                                            </Badge>
                                            <Badge className={`border-none text-[8px] font-black uppercase ${
                                                account.status === 'active' 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800'
                                            }`}>
                                                {account.status}
                                            </Badge>
                                        </div>
                                        <p className="text-2xl font-black tracking-tight">
                                            {account.balance.toLocaleString()} <span className="text-xs font-normal text-neutral-400">{account.currency}</span>
                                        </p>
                                        <p className="text-[10px] font-mono text-neutral-400 mt-1 truncate">{account.account_number}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                    {/* Insights Chart */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <Card className="h-full border-none shadow-xl bg-white dark:bg-neutral-900/50 rounded-2xl md:rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
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
                            <CardContent className="h-[250px] md:h-[300px] px-2 md:px-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} hide />
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
                        <Card className="h-full border-none shadow-xl rounded-2xl md:rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <History className="h-4 w-4 text-blue-500" />
                                    Live Activity
                                </CardTitle>
                                <Link href="/reports/transactions">
                                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                                </Link>
                            </CardHeader>
                            <CardContent className="px-4 md:px-6">
                                <div className="space-y-5 md:space-y-6">
                                    {recentTransactions.map((tx: any) => (
                                        <div key={tx.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft className="h-4 w-4 md:h-5 md:w-5" /> : <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs md:text-sm font-bold capitalize">{tx.method.replace('_', ' ')}</p>
                                                    <p className="text-[10px] text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs md:text-sm font-black ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] opacity-50 capitalize">{tx.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <div className="py-10 md:py-12 text-center">
                                            <History className="h-10 w-10 mx-auto mb-3 text-neutral-200 dark:text-neutral-700" />
                                            <p className="text-neutral-400 italic text-sm">No recent movements.</p>
                                        </div>
                                    )}
                                </div>
                                <Link href="/reports/transactions">
                                    <Button className="mt-6 md:mt-8 w-full rounded-xl md:rounded-2xl bg-neutral-50 text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 text-sm">
                                        View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
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
