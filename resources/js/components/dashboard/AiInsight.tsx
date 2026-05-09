import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    X,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Lightbulb,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const INSIGHTS = [
    {
        type: 'success',
        icon: TrendingUp,
        title: 'Spending Pattern Optimization',
        text: "Your weekend spending is 12% lower than last month. You're on track to save 500 MAD more!",
    },
    {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Subscription Alert',
        text: 'We noticed a recurring payment of 149 MAD. Is this a service you still use?',
    },
    {
        type: 'info',
        icon: Lightbulb,
        title: 'Daret Strategy',
        text: 'Joining a 5-person Daret today would yield your payout exactly when your annual insurance is due.',
    },
    {
        type: 'premium',
        icon: Sparkles,
        title: 'Investment Opportunity',
        text: 'Your current wallet balance is eligible for our "Auto-Grow" 4.5% interest vault.',
    },
];

export function AiInsight({ narrative }: { narrative?: string }) {
    const [insight, setInsight] = useState(INSIGHTS[0]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (narrative) {
            setInsight({
                type: 'premium',
                icon: Sparkles,
                title: 'Real-time Financial Architect',
                text: narrative,
            });
        } else {
            const randomInsight =
                INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
            setInsight(randomInsight);
        }
    }, [narrative]);

    if (!isVisible) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="shadow-elevated group relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-xl"
        >
            <div className="absolute top-0 right-0 p-2">
                <button
                    onClick={() => setIsVisible(false)}
                    className="rounded-full p-1 transition-colors hover:bg-white/10"
                >
                    <X className="h-3 w-3 text-muted-foreground" />
                </button>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary transition-transform group-hover:scale-110">
                    <insight.icon className="h-5 w-5" />
                </div>
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-primary uppercase">
                            <BrainCircuit className="h-3 w-3" />
                            Anwar AI Insight
                        </span>
                    </div>
                    <h4 className="mb-1 text-sm font-bold tracking-tight">
                        {insight.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        {insight.text}
                    </p>
                </div>
            </div>

            {/* Progress bar effect */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-primary/20">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    onAnimationComplete={() => setIsVisible(false)}
                    className="h-full bg-primary"
                />
            </div>
        </motion.div>
    );
}
