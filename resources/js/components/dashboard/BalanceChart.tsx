import { Link } from '@inertiajs/react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ChartDataItem {
    name: string;
    amount: number;
}

interface BalanceChartProps {
    chartData: ChartDataItem[];
}

export function BalanceChart({ chartData }: BalanceChartProps) {
    const data = chartData.map((item) => ({
        d: item.name,
        v: item.amount,
    }));

    return (
        <div className="shadow-soft hover:shadow-elevated group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all">
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />

            <div className="relative z-10 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-black tracking-tight uppercase">
                            Capital{' '}
                            <span className="text-primary italic">
                                Evolution.
                            </span>
                        </h3>
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                            Sovereign Deployment Trajectory
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 rounded-xl border border-border/50 bg-muted/20 p-1">
                    {['7D', '1M', '3M'].map((p, i) => (
                        <button
                            key={p}
                            className={
                                i === 0
                                    ? 'rounded-lg bg-primary px-4 py-1.5 text-[9px] font-black text-primary-foreground shadow-md'
                                    : 'rounded-lg px-4 py-1.5 text-[9px] font-black text-muted-foreground transition-colors hover:text-foreground'
                            }
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10 min-h-[180px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="bal"
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
                            stroke="var(--color-border)"
                            vertical={false}
                            strokeOpacity={0.3}
                        />
                        <XAxis
                            dataKey="d"
                            stroke="var(--color-muted-foreground)"
                            fontSize={9}
                            fontWeight="900"
                            tickLine={false}
                            axisLine={false}
                            className="tracking-widest uppercase"
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--color-muted-foreground)"
                            fontSize={9}
                            fontWeight="900"
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--color-popover)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 24,
                                fontSize: 12,
                                fontWeight: '900',
                                boxShadow: 'var(--shadow-elevated)',
                                padding: '16px',
                            }}
                            labelStyle={{
                                color: 'var(--color-muted-foreground)',
                                marginBottom: '4px',
                            }}
                            itemStyle={{ color: 'var(--color-primary)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="v"
                            stroke="var(--color-primary)"
                            strokeWidth={4}
                            fill="url(#bal)"
                            animationDuration={2500}
                            activeDot={{
                                r: 6,
                                strokeWidth: 0,
                                fill: 'var(--color-primary)',
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between border-t border-border/50 pt-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 text-primary">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-black tracking-widest text-muted-foreground/60 uppercase">
                        Neural forecast node:{' '}
                        <span className="text-foreground">STABLE</span>
                    </p>
                </div>
                <Link
                    href="/reports/transactions"
                    className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase hover:underline"
                >
                    Full Audit <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}
