import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    TrendingUp,
    Activity,
    AlertCircle,
    Zap,
    MessageSquare,
    Sparkles,
    Loader2,
    Bot,
    Send,
    User,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Analysis {
    projections: Array<{ month: string; balance: number }>;
    metrics: {
        monthly_income: number;
        monthly_expenses: number;
        overdraft_risk: number;
        stress_score: number;
    };
    seasonal_nudges: string[];
    narrative: {
        conclusion: string;
        highlight: string;
        recommendation: string;
        risk_analysis: string;
    };
}

interface Message {
    role: 'user' | 'bot';
    content: string;
}

interface Props {
    analysis?: Analysis;
}

export default function SmartBankingAI({ analysis }: Props) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'bot',
            content:
                "Hi! I'm your AI Assistant. I've analyzed your account. How can I help you today?",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const sendDirectly = async (msg: string) => {
        if (!msg.trim() || isLoading) {
            return;
        }

        setMessages((prev) => [...prev, { role: 'user', content: msg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({ message: msg }),
            });

            const data = await response.json();

            if (data.answer) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'bot', content: data.answer },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'bot',
                        content:
                            "Sorry, I couldn't connect to my brain. Can you try again?",
                    },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    content:
                        'Oops! Something went wrong. Please try again later.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const msg = message;
        setMessage('');
        await sendDirectly(msg);
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    const fallbackAnalysis: Analysis = {
        projections: [],
        metrics: {
            monthly_income: 0,
            monthly_expenses: 0,
            overdraft_risk: 0,
            stress_score: 0,
        },
        seasonal_nudges: ['Analysis pending.'],
        narrative: {
            conclusion: 'Awaiting more transaction data.',
            highlight: 'No significant activity detected yet.',
            recommendation: 'Start using your account to generate insights.',
            risk_analysis: 'Risk assessment is currently baseline.',
        },
    };

    const currentAnalysis = analysis || fallbackAnalysis;

    return (
        <>
            <Head title="AI Assistant" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 md:p-8"
            >
                {/* Header */}
                <motion.div
                    variants={item}
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Sparkles className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                                Your Financial Sidekick
                            </span>
                        </div>
                        <h1 className="font-display text-4xl leading-none font-black tracking-tighter uppercase md:text-6xl">
                            AI{' '}
                            <span className="text-primary italic">MENTOR.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-border/50 bg-card/50 p-4 backdrop-blur-md">
                        <div className="text-right">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Status
                            </p>
                            <p className="text-xs font-bold text-success">
                                Optimized
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/10 text-success">
                            <Bot className="h-5 w-5" />
                        </div>
                    </div>
                </motion.div>

                {/* Structured Insights Grid */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Conclusion */}
                    <motion.div variants={item} className="lg:col-span-8">
                        <div className="grid h-full gap-6">
                            <Card className="shadow-elevated relative overflow-hidden rounded-3xl border-none bg-neutral-900 p-8 text-white dark:bg-black">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <BrainCircuit className="h-48 w-48 text-primary" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3 text-primary">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                            Executive Summary
                                        </span>
                                    </div>
                                    <h2 className="text-3xl leading-tight font-bold">
                                        "{currentAnalysis.narrative.conclusion}"
                                    </h2>
                                    <div className="grid grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                                                Top Highlight
                                            </p>
                                            <p className="text-sm font-medium">
                                                {
                                                    currentAnalysis.narrative
                                                        .highlight
                                                }
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                                                Risk Reason
                                            </p>
                                            <p className="text-sm font-medium">
                                                {
                                                    currentAnalysis.narrative
                                                        .risk_analysis
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">
                                            Smart Recommendation
                                        </p>
                                        <p className="text-lg leading-tight font-bold text-foreground">
                                            {
                                                currentAnalysis.narrative
                                                    .recommendation
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Metrics Panel */}
                    <motion.div
                        variants={item}
                        className="space-y-6 lg:col-span-4"
                    >
                        <Card className="shadow-soft group rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30">
                            <p className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                                Financial Health
                            </p>
                            <div className="mb-4 flex items-end justify-between">
                                <span
                                    className={`text-5xl font-black tracking-tighter ${currentAnalysis.metrics.stress_score > 60 ? 'text-destructive' : 'text-primary'}`}
                                >
                                    {100 - currentAnalysis.metrics.stress_score}
                                    <span className="text-xl opacity-40">
                                        /100
                                    </span>
                                </span>
                                <Badge
                                    className={`px-3 py-1 text-[9px] font-bold ${currentAnalysis.metrics.stress_score > 60 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                                >
                                    {currentAnalysis.metrics.stress_score > 60
                                        ? 'CRITICAL'
                                        : 'OPTIMAL'}
                                </Badge>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${100 - currentAnalysis.metrics.stress_score}%`,
                                    }}
                                    className={`h-full ${currentAnalysis.metrics.stress_score > 60 ? 'bg-destructive' : 'bg-primary'} shadow-lg`}
                                />
                            </div>
                        </Card>

                        <Card className="shadow-soft group rounded-3xl border border-border bg-card p-8 transition-all hover:border-destructive/30">
                            <p className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                                Risk Level
                            </p>
                            <div className="flex items-end justify-between">
                                <span
                                    className={`text-5xl font-black tracking-tighter ${currentAnalysis.metrics.overdraft_risk > 50 ? 'text-destructive' : 'text-success'}`}
                                >
                                    {currentAnalysis.metrics.overdraft_risk}
                                    <span className="text-xl opacity-40">
                                        %
                                    </span>
                                </span>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${currentAnalysis.metrics.overdraft_risk > 50 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}
                                >
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Bottom Row: Projections & Chat */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Projections Chart */}
                    <motion.div variants={item} className="lg:col-span-7">
                        <Card className="shadow-soft h-full overflow-hidden rounded-3xl border border-border bg-card p-6">
                            <CardHeader className="mb-8 p-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                            Balance{' '}
                                            <span className="text-primary italic">
                                                Projection.
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                            Estimated 6-month forecast
                                        </CardDescription>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[220px] p-0">
                                {currentAnalysis.projections.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={currentAnalysis.projections}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="colorBalance"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-primary)"
                                                        stopOpacity={0.2}
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
                                                vertical={false}
                                                stroke="var(--color-border)"
                                                opacity={0.5}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 10,
                                                    fontWeight: 900,
                                                    fill: 'var(--color-muted-foreground)',
                                                }}
                                                dy={10}
                                            />
                                            <YAxis
                                                hide
                                                domain={[
                                                    'dataMin - 1000',
                                                    'dataMax + 1000',
                                                ]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background:
                                                        'var(--color-popover)',
                                                    borderRadius: '16px',
                                                    border: '1px solid var(--color-border)',
                                                    boxShadow:
                                                        'var(--shadow-soft)',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="balance"
                                                stroke="var(--color-primary)"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorBalance)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        Generating Forecast...
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Chat Panel */}
                    <motion.div
                        variants={item}
                        className="flex h-[450px] flex-col lg:col-span-5"
                    >
                        <Card className="shadow-elevated relative flex h-full flex-col overflow-hidden rounded-3xl border-none bg-neutral-900 text-white dark:bg-black">
                            <CardHeader className="shrink-0 border-b border-white/5 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl font-black tracking-tight uppercase">
                                        Instant{' '}
                                        <span className="text-primary italic">
                                            Support.
                                        </span>
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent
                                className="flex-1 space-y-4 overflow-y-auto p-6"
                                ref={scrollRef}
                            >
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                                msg.role === 'user'
                                                    ? 'bg-primary font-semibold text-primary-foreground'
                                                    : 'border border-white/5 bg-white/10 text-white'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/10 px-4 py-2.5 text-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                                                Thinking...
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <div className="flex flex-wrap gap-2 border-t border-white/5 bg-black/20 px-6 py-4">
                                {[
                                    'What if I buy a car?',
                                    'Save 2000 MAD more?',
                                    'Lose my income?',
                                    'Reach goals faster?',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => sendDirectly(suggestion)}
                                        className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold tracking-widest text-white/70 uppercase transition-all hover:bg-primary/20 hover:text-primary"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-black/20 p-4">
                                <form
                                    onSubmit={handleSend}
                                    className="relative flex items-center gap-2"
                                >
                                    <Input
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        placeholder="Type a scenario..."
                                        className="h-11 w-full rounded-xl border-white/10 bg-white/5 px-4 text-xs text-white"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 rounded-xl bg-primary hover:bg-primary/90"
                                        disabled={isLoading || !message.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}

SmartBankingAI.layout = {
    breadcrumbs: [
        {
            title: 'AI Assistant',
            href: '/ai',
        },
    ],
};
