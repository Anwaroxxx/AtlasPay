import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownLeft, ArrowUpRight, Gauge, PiggyBank } from 'lucide-react';
import { AutoCutPreview } from '@/components/dashboard/AutoCutPreview';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { StatCard } from '@/components/dashboard/StatCard';

export const Route = createFileRoute('/')({
    component: Index,
    head: () => ({
        meta: [
            { title: 'Dashboard — AtlasPay' },
            {
                name: 'description',
                content:
                    'Your AtlasPay dashboard: balance, spending, AutoCut goals and AI insights.',
            },
        ],
    }),
});

function Index() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        Tuesday · May 5
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        Salam, Youssef{' '}
                        <span className="text-muted-foreground">👋</span>
                    </h1>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground md:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    All systems normal · Anwar AI online
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BalanceCard />
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                    <StatCard
                        label="Total in"
                        value="14,820"
                        delta="+12.4%"
                        icon={ArrowDownLeft}
                        positive
                    />
                    <StatCard
                        label="Total out"
                        value="5,790"
                        delta="-3.1%"
                        icon={ArrowUpRight}
                        positive={false}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Savings"
                    value="27,710"
                    delta="+8.2%"
                    icon={PiggyBank}
                    positive
                />
                <StatCard
                    label="Credit score"
                    value="742"
                    delta="+14 pts"
                    icon={Gauge}
                    positive
                />
                <StatCard
                    label="Daret pool"
                    value="3,200"
                    delta="Round 4/8"
                    icon={ArrowDownLeft}
                    positive
                />
                <StatCard
                    label="AI risk score"
                    value="Low"
                    delta="-6%"
                    icon={Gauge}
                    positive
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BalanceChart />
                </div>
                <SpendingChart />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <RecentTransactions />
                <AutoCutPreview />
            </div>
        </div>
    );
}
