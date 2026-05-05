import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Target, 
    TrendingUp, 
    ShieldCheck, 
    Lock, 
    Unlock, 
    AlertTriangle,
    Plus,
    Calendar,
    Zap,
    ArrowRight,
    Loader2,
    Building2,
    Timer,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { toast } from 'sonner';

interface Goal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    monthly_deduction: number;
    target_date: string;
    locked_until: string;
    status: 'active' | 'completed' | 'unlocked';
}

interface Props {
    goals: Goal[];
}

export default function Savings({ goals }: Props) {
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        target_amount: '',
        target_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('savings.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
                toast.success('Savings goal successfully created.');
            }
        });
    };

    const unlock = (goalId: number) => {
        if (confirm('Are you sure you want to unlock this goal? Unlocking before the target date may impact your financial health score. Proceed?')) {
            router.post(route('savings.unlock', goalId), {}, {
                onSuccess: () => toast.warning('Savings goal unlocked.')
            });
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Savings Goals" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-6 p-6 md:p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Target className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Savings Management</span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl uppercase">
                            AutoCut <span className="text-primary italic">Vault.</span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base font-medium max-w-xl">
                            Automated savings made simple. Set your financial goals and track your progress as you build your future.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="h-16 rounded-2xl px-8 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-elevated group transition-all hover:scale-105">
                        <Plus className="mr-3 h-6 w-6 transition-transform group-hover:rotate-90" /> Create Goal
                    </Button>
                </motion.div>

                {/* Create Goal Modal/Section */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="border-none shadow-elevated bg-card rounded-3xl overflow-hidden glass-card">
                                <CardHeader className="p-6 border-b border-border bg-muted/20">
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Set a New <span className="text-primary italic">Goal.</span></CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">Specify your target amount and date.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={submit} className="grid gap-6 md:grid-cols-3">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Goal Name</Label>
                                            <Input 
                                                placeholder="e.g., Vacation Fund" 
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)}
                                                className="h-16 rounded-2xl bg-muted/20 border-border/50 text-base font-black tracking-tight"
                                            />
                                            {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Amount (MAD)</Label>
                                            <Input 
                                                type="number"
                                                placeholder="0.00" 
                                                value={data.target_amount} 
                                                onChange={e => setData('target_amount', e.target.value)}
                                                className="h-16 rounded-2xl bg-muted/20 border-border/50 text-base font-black tracking-tight"
                                            />
                                            {errors.target_amount && <p className="text-xs text-destructive font-bold">{errors.target_amount}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Date</Label>
                                            <div className="flex gap-4">
                                                <Input 
                                                    type="date"
                                                    value={data.target_date} 
                                                    onChange={e => setData('target_date', e.target.value)}
                                                    className="h-16 rounded-2xl bg-muted/20 border-border/50 text-base font-black"
                                                />
                                                <Button type="submit" disabled={processing} className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shrink-0">
                                                    {processing ? <Loader2 className="animate-spin" /> : <ChevronRight />}
                                                </Button>
                                            </div>
                                            {errors.target_date && <p className="text-xs text-destructive font-bold">{errors.target_date}</p>}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Goals Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => {
                        const progress = (goal.current_amount / goal.target_amount) * 100;
                        const isLocked = goal.status === 'active';
                        const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <motion.div key={goal.id} variants={item}>
                                <Card className="h-full border-none shadow-elevated rounded-3xl bg-card glass-card overflow-hidden group hover:border-primary/20 border transition-all">
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-soft group-hover:scale-110 transition-transform">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <Badge className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border-none ${
                                                goal.status === 'completed' ? 'bg-success text-success-foreground' : 
                                                goal.status === 'unlocked' ? 'bg-warning text-warning-foreground' : 'bg-primary/20 text-primary'
                                            }`}>
                                                {goal.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight truncate">{goal.name}</CardTitle>
                                        <CardDescription className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                                            <Timer className="h-3 w-3" /> {daysLeft > 0 ? `${daysLeft} Days Remaining` : 'Goal Reached'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Progress</span>
                                                <span className="text-lg font-black tracking-tight">{progress.toFixed(1)}%</span>
                                            </div>
                                            <Progress value={progress} className="h-2 bg-muted/30 border border-border/50" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Saved</p>
                                                <p className="text-xl font-black tracking-tight">{goal.current_amount.toLocaleString()}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Goal</p>
                                                <p className="text-xl font-black tracking-tight">{goal.target_amount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                    <Zap className="h-4 w-4 fill-current" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Monthly Saving</p>
                                                    <p className="text-sm font-black tracking-tight">{goal.monthly_deduction.toLocaleString()} MAD</p>
                                                </div>
                                            </div>
                                            {isLocked ? (
                                                <Button onClick={() => unlock(goal.id)} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive group/btn">
                                                    <Lock className="h-4 w-4 group-hover/btn:hidden" />
                                                    <Unlock className="h-4 w-4 hidden group-hover/btn:block" />
                                                </Button>
                                            ) : (
                                                <div className="h-10 w-10 flex items-center justify-center text-success">
                                                    <Unlock className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}

                    {goals.length === 0 && !isCreating && (
                        <div className="col-span-full py-32 text-center">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground mb-6">
                                <Building2 className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-muted-foreground/50">No active savings goals found.</h3>
                            <p className="text-sm text-muted-foreground/40 mt-2 font-medium">Create your first savings goal to start building your future.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}

Savings.layout = {
    breadcrumbs: [
        {
            title: 'Savings Goals',
            href: '/savings',
        },
    ],
};

