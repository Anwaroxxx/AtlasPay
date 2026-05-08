import { Head, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Gauge,
    PiggyBank,
    Zap,
    Shield,
    Target,
    BrainCircuit,
    Activity,
} from 'lucide-react';
import { useEffect } from 'react';
import { AiInsight } from '@/components/dashboard/AiInsight';
import { AutoCutPreview } from '@/components/dashboard/AutoCutPreview';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { StatCard } from '@/components/dashboard/StatCard';

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
        daretCount: number;
        savingsGoalsCount: number;
        aiRisk: number;
        stressScore: number;
        aiNarrative: string;
    };
    accounts: Account[];
    recentTransactions: any[];
    chartData: any[];
}

export default function Dashboard({
    stats,
    accounts,
    recentTransactions,
    chartData,
}: Props) {
    const { props } = usePage();
    const auth = props.auth as any;
    const userName = auth?.user?.first_name || 'Guest';

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Echo) {
            const channel = `App.Models.User.${auth.user.id}`;
            (window as any).Echo.private(channel).listen(
                '.transaction.created',
                (e: any) => {
                    console.log('Live Transaction Detected:', e);
                    router.reload({
                        only: [
                            'stats',
                            'accounts',
                            'recentTransactions',
                            'chartData',
                        ],
                    });
                },
            );

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth.user.id]);

    const totalIn = recentTransactions
        .filter((t) => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalOut = recentTransactions
        .filter((t) => t.type === 'withdrawal' || t.type === 'transfer')
        .reduce((sum, t) => sum + t.amount, 0);
    const mainAccount = accounts[0];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <>
            <Head title="Dashboard" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 md:px-8 md:py-8"
            >
                {/* Compact Header */}
                <motion.div
                    variants={item}
                    className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
                >
                    <div>
                        <h1 className="font-display text-3xl leading-none font-black tracking-tighter uppercase md:text-5xl">
                            Welcome,{' '}
                            <span className="text-primary italic">
                                {userName}.
                            </span>
                        </h1>
                        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                            <Shield className="h-3 w-3 text-success" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                All Good
                            </span>
                        </div>
                    </div>
                    <div className="shadow-soft flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-xl">
                        <div className="text-right">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Status
                            </p>
                            <p className="text-xs font-bold text-success">
                                Active
                            </p>
                        </div>
                        <Activity className="h-4 w-4 text-success" />
                    </div>
                </motion.div>

                {/* AI Insights Bar */}
                <motion.div variants={item}>
                    <AiInsight narrative={stats.aiNarrative} />
                </motion.div>

                {/* Primary Wealth Grid (Balance + Flow) */}
                <motion.div
                    variants={item}
                    className="grid gap-6 lg:grid-cols-12"
                >
                    <div className="lg:col-span-8">
                        <BalanceCard
                            balance={stats.totalBalance}
                            currency={stats.currency}
                            accountNumber={
                                mainAccount
                                    ? mainAccount.account_number
                                    : 'MA53 ATLS 0009 8821 4477'
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1">
                        <StatCard
                            label="Monthly In"
                            value={totalIn.toLocaleString()}
                            delta="+12%"
                            icon={ArrowDownLeft}
                            positive
                            href="/reports/transactions"
                        />
                        <StatCard
                            label="Monthly Out"
                            value={totalOut.toLocaleString()}
                            delta="-4%"
                            icon={ArrowUpRight}
                            positive={false}
                            href="/reports/transactions"
                        />
                    </div>
                </motion.div>

                {/* Compact Metrics Row */}
                <motion.div
                    variants={item}
                    className="grid grid-cols-2 gap-4 md:grid-cols-4"
                >
                    <StatCard
                        label="Score"
                        value={stats.creditScore.toString()}
                        delta="Good"
                        icon={Gauge}
                        positive
                        href="/credits"
                    />
                    <StatCard
                        label="Loans"
                        value={stats.activeLoan.toLocaleString()}
                        delta="Manage"
                        icon={PiggyBank}
                        positive={false}
                        href="/credits"
                    />
                    <StatCard
                        label="Daret"
                        value={stats.daretCount.toString()}
                        delta="Active"
                        icon={Target}
                        positive={stats.daretCount > 0}
                        href="/daret"
                    />
                    <StatCard
                        label="AI Health"
                        value={`${100 - stats.aiRisk}%`}
                        delta="Healthy"
                        icon={BrainCircuit}
                        positive={stats.aiRisk < 50}
                        href="/ai"
                    />
                </motion.div>

                {/* Split Charts (Balanced Height) */}
                <motion.div
                    variants={item}
                    className="grid gap-6 lg:grid-cols-12"
                >
                    <div className="lg:col-span-7">
                        <BalanceChart chartData={chartData} />
                    </div>
                    <div className="lg:col-span-5">
                        <SpendingChart />
                    </div>
                </motion.div>

                {/* Compact List Row */}
                <motion.div
                    variants={item}
                    className="grid gap-6 lg:grid-cols-12"
                >
                    <div className="lg:col-span-7">
                        <RecentTransactions transactions={recentTransactions} />
                    </div>
                    <div className="lg:col-span-5">
                        <AutoCutPreview />
                    </div>
                </motion.div>
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
