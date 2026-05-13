import { createFileRoute } from '@tanstack/react-router';
import { Download } from 'lucide-react';
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/reports')({
    component: ReportsPage,
    head: () => ({ meta: [{ title: 'Reports — AtlasPay' }] }),
});

const pie = [
    { name: 'Bills', value: 2100 },
    { name: 'Shopping', value: 940 },
    { name: 'Food', value: 820 },
    { name: 'Transport', value: 680 },
    { name: 'Café', value: 510 },
    { name: 'Other', value: 740 },
];
const colors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
    'var(--color-muted-foreground)',
];

const compare = [
    { m: 'Dec', in: 12500, out: 6800 },
    { m: 'Jan', in: 12500, out: 7200 },
    { m: 'Feb', in: 12500, out: 6100 },
    { m: 'Mar', in: 13800, out: 7900 },
    { m: 'Apr', in: 12500, out: 6300 },
    { m: 'May', in: 14820, out: 5790 },
];

function ReportsPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        Insights
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                        Monthly reports
                    </h1>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Export PDF
                </Button>
            </header>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                    {
                        l: 'Income',
                        v: '14,820',
                        t: '+18% vs Apr',
                        tone: 'success',
                    },
                    {
                        l: 'Expenses',
                        v: '5,790',
                        t: '-8% vs Apr',
                        tone: 'success',
                    },
                    {
                        l: 'Net saved',
                        v: '9,030',
                        t: '+62% vs Apr',
                        tone: 'success',
                    },
                ].map((s) => (
                    <div
                        key={s.l}
                        className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
                    >
                        <p className="text-xs tracking-wider text-muted-foreground uppercase">
                            {s.l}
                        </p>
                        <p className="mt-2 font-display text-3xl font-semibold">
                            {s.v}{' '}
                            <span className="text-base text-muted-foreground">
                                MAD
                            </span>
                        </p>
                        <p className="mt-1 text-xs text-success">{s.t}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] lg:col-span-2">
                    <h3 className="font-display text-base font-semibold">
                        Spending breakdown
                    </h3>
                    <p className="text-xs text-muted-foreground">May · MAD</p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pie}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={2}
                                >
                                    {pie.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={colors[i]}
                                            stroke="var(--color-card)"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-popover)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 12,
                                        fontSize: 12,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs">
                        {pie.map((p, i) => (
                            <li
                                key={p.name}
                                className="flex items-center justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-sm"
                                        style={{ background: colors[i] }}
                                    />
                                    {p.name}
                                </span>
                                <span className="text-muted-foreground tabular-nums">
                                    {p.value.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] lg:col-span-3">
                    <h3 className="font-display text-base font-semibold">
                        In vs Out — last 6 months
                    </h3>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer>
                            <BarChart
                                data={compare}
                                margin={{
                                    top: 10,
                                    right: 8,
                                    left: -10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--color-border)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="m"
                                    stroke="var(--color-muted-foreground)"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--color-muted-foreground)"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--color-muted)' }}
                                    contentStyle={{
                                        background: 'var(--color-popover)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 12,
                                        fontSize: 12,
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar
                                    dataKey="in"
                                    name="Income"
                                    fill="var(--color-primary)"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={28}
                                />
                                <Bar
                                    dataKey="out"
                                    name="Spending"
                                    fill="var(--color-mint)"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={28}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
