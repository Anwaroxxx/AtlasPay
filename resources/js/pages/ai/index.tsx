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
    User
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useState, useRef, useEffect } from 'react';

interface Analysis {
    projections: Array<{ month: string, balance: number }>;
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
        { role: 'bot', content: "Hi! I'm your AI Assistant. I've analyzed your account. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = message.trim();
        setMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            if (data.answer) {
                setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I couldn't connect to my brain. Can you try again?" }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Oops! Something went wrong. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const item: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    const fallbackAnalysis: Analysis = {
        projections: [],
        metrics: { monthly_income: 0, monthly_expenses: 0, overdraft_risk: 0, stress_score: 0 },
        seasonal_nudges: ["Analysis pending."],
        narrative: {
            conclusion: "Awaiting more transaction data.",
            highlight: "No significant activity detected yet.",
            recommendation: "Start using your account to generate insights.",
            risk_analysis: "Risk assessment is currently baseline."
        }
    };

    const currentAnalysis = analysis || fallbackAnalysis;

    return (
        <>
            <Head title="AI Assistant" />
            
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Sparkles className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Neural Interface v2.0</span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl uppercase leading-none">
                            AI <span className="text-primary italic">INSIGHTS.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-4 rounded-3xl border border-border/50">
                        <div className="text-right">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
                            <p className="text-xs font-bold text-success">Optimized</p>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                            <Bot className="h-5 w-5" />
                        </div>
                    </div>
                </motion.div>

                {/* Structured Insights Grid */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Conclusion */}
                    <motion.div variants={item} className="lg:col-span-8">
                        <div className="grid gap-6 h-full">
                            <Card className="border-none shadow-elevated bg-neutral-900 text-white rounded-3xl overflow-hidden dark:bg-black p-8 relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <BrainCircuit className="h-48 w-48 text-primary" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3 text-primary">
                                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Executive Summary</span>
                                    </div>
                                    <h2 className="text-3xl font-bold leading-tight">
                                        "{currentAnalysis.narrative.conclusion}"
                                    </h2>
                                    <div className="grid grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Top Highlight</p>
                                            <p className="text-sm font-medium">{currentAnalysis.narrative.highlight}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Risk Reason</p>
                                            <p className="text-sm font-medium">{currentAnalysis.narrative.risk_analysis}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border border-primary/20 bg-primary/5 rounded-3xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Smart Recommendation</p>
                                        <p className="text-lg font-bold text-foreground leading-tight">
                                            {currentAnalysis.narrative.recommendation}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Metrics Panel */}
                    <motion.div variants={item} className="lg:col-span-4 space-y-6">
                        <Card className="border border-border shadow-soft rounded-3xl bg-card p-8 group hover:border-primary/30 transition-all">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Financial Health</p>
                            <div className="flex items-end justify-between mb-4">
                                <span className={`text-5xl font-black tracking-tighter ${currentAnalysis.metrics.stress_score > 60 ? 'text-destructive' : 'text-primary'}`}>
                                    {100 - currentAnalysis.metrics.stress_score}<span className="text-xl opacity-40">/100</span>
                                </span>
                                <Badge className={`font-bold text-[9px] px-3 py-1 ${currentAnalysis.metrics.stress_score > 60 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                    {currentAnalysis.metrics.stress_score > 60 ? 'CRITICAL' : 'OPTIMAL'}
                                </Badge>
                            </div>
                            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - currentAnalysis.metrics.stress_score}%` }}
                                    className={`h-full ${currentAnalysis.metrics.stress_score > 60 ? 'bg-destructive' : 'bg-primary'} shadow-lg`} 
                                />
                            </div>
                        </Card>
                        
                        <Card className="border border-border shadow-soft rounded-3xl bg-card p-8 group hover:border-destructive/30 transition-all">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Risk Level</p>
                            <div className="flex items-end justify-between">
                                <span className={`text-5xl font-black tracking-tighter ${currentAnalysis.metrics.overdraft_risk > 50 ? 'text-destructive' : 'text-success'}`}>
                                    {currentAnalysis.metrics.overdraft_risk}<span className="text-xl opacity-40">%</span>
                                </span>
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${currentAnalysis.metrics.overdraft_risk > 50 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
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
                        <Card className="h-full border border-border shadow-soft rounded-3xl bg-card p-6 overflow-hidden">
                            <CardHeader className="p-0 mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Balance <span className="text-primary italic">Projection.</span></CardTitle>
                                        <CardDescription className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Estimated 6-month forecast</CardDescription>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 h-[220px]">
                                {currentAnalysis.projections.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={currentAnalysis.projections}>
                                            <defs>
                                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                            <XAxis 
                                                dataKey="month" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--color-muted-foreground)' }} 
                                                dy={10}
                                            />
                                            <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    background: 'var(--color-popover)', 
                                                    borderRadius: '16px', 
                                                    border: '1px solid var(--color-border)', 
                                                    boxShadow: 'var(--shadow-soft)',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
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
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        Generating Forecast...
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Chat Panel */}
                    <motion.div variants={item} className="lg:col-span-5 flex flex-col h-[450px]">
                        <Card className="h-full border-none shadow-elevated bg-neutral-900 text-white rounded-3xl overflow-hidden dark:bg-black relative flex flex-col">
                            <CardHeader className="p-6 border-b border-white/5 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Instant <span className="text-primary italic">Support.</span></CardTitle>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="flex-1 p-6 overflow-y-auto space-y-4" ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground font-semibold' 
                                                : 'bg-white/10 text-white border border-white/5'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm border border-white/5">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Neural Link...</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <div className="p-4 bg-black/20">
                                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                    <Input
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="h-11 w-full rounded-xl border-white/10 bg-white/5 px-4 text-xs text-white"
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        type="submit" 
                                        size="icon" 
                                        className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 shrink-0" 
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

