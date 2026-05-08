import { Link } from '@inertiajs/react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from 'recharts';

const data = [
    { c: 'Food', v: 1240 },
    { c: 'Transport', v: 680 },
    { c: 'Bills', v: 2100 },
    { c: 'Shopping', v: 940 },
    { c: 'Café', v: 510 },
    { c: 'Other', v: 320 },
];

const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-destructive)',
    '#8b5cf6',
    '#ec4899',
];

export function SpendingChart() {
    return (
        <div className="shadow-soft hover:shadow-elevated group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all">
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />

            <div className="relative z-10 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-black tracking-tight uppercase">
                            Spending{' '}
                            <span className="text-primary italic">
                                Analysis.
                            </span>
                        </h3>
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                            Monthly Volume · MAD
                        </p>
                    </div>
                </div>
                <Link
                    href="/reports/transactions"
                    className="flex h-10 items-center gap-2 rounded-xl bg-primary/10 px-4 text-[10px] font-black tracking-widest text-primary uppercase transition-all hover:bg-primary hover:text-white"
                >
                    Details <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="relative z-10 min-h-[180px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                            strokeOpacity={0.3}
                        />
                        <XAxis
                            dataKey="c"
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
                            cursor={{
                                fill: 'var(--color-primary)',
                                opacity: 0.05,
                            }}
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
                                color: 'var(--color-foreground)',
                                marginBottom: '4px',
                            }}
                            itemStyle={{ color: 'var(--color-primary)' }}
                        />
                        <Bar
                            dataKey="v"
                            radius={[12, 12, 4, 4]}
                            maxBarSize={32}
                            animationDuration={2000}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="relative z-10 mt-8 border-t border-border/50 pt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="mb-1 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                            Total Spending
                        </p>
                        <p className="text-3xl font-black tracking-tighter">
                            5,790{' '}
                            <span className="text-[10px] font-normal opacity-40">
                                MAD
                            </span>
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-xs font-black text-success">
                        +14%
                    </div>
                </div>
            </div>
        </div>
    );
}
