import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const data = [
    { c: 'Food', v: 1240 },
    { c: 'Transport', v: 680 },
    { c: 'Bills', v: 2100 },
    { c: 'Shopping', v: 940 },
    { c: 'Café', v: 510 },
    { c: 'Other', v: 320 },
];

export function SpendingChart() {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-display text-base font-semibold">
                        Spending by category
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        This month · MAD
                    </p>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
                    5,790 total
                </span>
            </div>

            <div className="mt-4 h-56 w-full">
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="c"
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
                        <Bar
                            dataKey="v"
                            fill="var(--color-primary)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={36}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
