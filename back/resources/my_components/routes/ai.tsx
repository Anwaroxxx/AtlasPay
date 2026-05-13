import { createFileRoute } from '@tanstack/react-router';
import {
    Sparkles,
    Send,
    TrendingUp,
    AlertTriangle,
    Target,
    Brain,
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/ai')({
    component: AIPage,
    head: () => ({ meta: [{ title: 'AI Twin — AtlasPay' }] }),
});

const projection = [
    { m: 'May', actual: 47820, projected: null as number | null },
    { m: 'Jun', actual: null, projected: 51200 },
    { m: 'Jul', actual: null, projected: 49800 },
    { m: 'Aug', actual: null, projected: 46100 }, // travel dip
    { m: 'Sep', actual: null, projected: 44900 }, // rentrée
    { m: 'Oct', actual: null, projected: 48700 },
    { m: 'Nov', actual: null, projected: 53400 },
    { m: 'Dec', actual: null, projected: 56200 },
].map((d) => ({ ...d, total: d.actual ?? d.projected }));

const suggestions = [
    'What if I buy a car for 80,000 MAD?',
    'Can I afford marriage in 2 years?',
    'What if I save 500dh more per month?',
    'What if my salary drops by 20%?',
];

function AIPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<
        { role: 'user' | 'ai'; text: string }[]
    >([
        {
            role: 'ai',
            text: "Salam Youssef. I'm Anwar, your financial twin. Based on your last 6 months I project a balance of ~56,200 MAD by December. Ramadan and rentrée scolaire will be your tightest months — I'd suggest boosting AutoCut by 200 MAD now.",
        },
    ]);

    const send = (text: string) => {
        if (!text.trim()) {
            return;
        }

        setMessages((m) => [
            ...m,
            { role: 'user', text },
            {
                role: 'ai',
                text: "Simulating that scenario… your projected balance shifts by ~-9% over 12 months. You'd still hit your Istanbul goal but delay the down payment by ~4 months. Want me to rebalance AutoCut?",
            },
        ]);
        setInput('');
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                            Anwar · Financial twin
                        </p>
                        <h1 className="font-display text-2xl font-semibold md:text-3xl">
                            Your AI future
                        </h1>
                    </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />{' '}
                    Trained on 184 days of activity
                </span>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <div className="space-y-6 lg:col-span-3">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-display text-base font-semibold">
                                    Cash flow projection
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Next 8 months · MAD
                                </p>
                            </div>
                            <span className="rounded-full bg-success/15 px-2 py-1 text-[11px] font-medium text-success">
                                +18% trend
                            </span>
                        </div>
                        <div className="mt-4 h-64 w-full">
                            <ResponsiveContainer>
                                <AreaChart
                                    data={projection}
                                    margin={{
                                        top: 10,
                                        right: 8,
                                        left: -10,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="proj"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
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
                                        contentStyle={{
                                            background: 'var(--color-popover)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 12,
                                            fontSize: 12,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-primary)"
                                        strokeWidth={2.5}
                                        fill="url(#proj)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                        <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <h3 className="font-display text-base font-semibold">
                                What if simulator
                            </h3>
                        </div>
                        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={
                                        m.role === 'user'
                                            ? 'flex justify-end'
                                            : 'flex justify-start'
                                    }
                                >
                                    <div
                                        className={
                                            m.role === 'user'
                                                ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                                                : 'max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground'
                                        }
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => send(s)}
                                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:bg-accent"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                send(input);
                            }}
                            className="mt-3 flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything about your future…"
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                    <Insight
                        icon={TrendingUp}
                        tone="success"
                        title="Savings opportunity"
                        text="You spend 18% more on cafés than peers. Cutting 2 visits/week saves ~340 MAD/month."
                    />
                    <Insight
                        icon={AlertTriangle}
                        tone="warning"
                        title="Ramadan stress"
                        text="Predicted spending spike of +1,800 MAD in Ramadan. Consider boosting AutoCut now."
                    />
                    <Insight
                        icon={Target}
                        tone="primary"
                        title="Goal forecast"
                        text="Marriage goal completion: Aug 2028 (4 months ahead of plan)."
                    />
                    <Insight
                        icon={AlertTriangle}
                        tone="danger"
                        title="Overdraft risk"
                        text="Low — 4% probability in next 90 days. Bills pattern is stable."
                    />
                </div>
            </div>
        </div>
    );
}

function Insight({
    icon: Icon,
    tone,
    title,
    text,
}: {
    icon: any;
    tone: 'success' | 'warning' | 'danger' | 'primary';
    title: string;
    text: string;
}) {
    const map = {
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-destructive/15 text-destructive',
        primary: 'bg-primary/15 text-primary',
    } as const;

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-3">
                <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${map[tone]}`}
                >
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}
