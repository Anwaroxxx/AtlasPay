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
    const [verifyingGoalId, setVerifyingGoalId] = useState<number | null>(null);
    const [verificationCode, setVerificationCode] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        target_amount: '',
        initial_deposit: '',
        target_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/savings', {
            onSuccess: () => {
                setIsCreating(false);
                reset();
                toast.success('Savings goal successfully created.');
            }
        });
    };

    const requestUnlock = (goalId: number) => {
        router.post(`/savings/${goalId}/request-unlock`, {}, {
            onSuccess: () => {
                setVerifyingGoalId(goalId);
                toast.info('Verification code dispatched to your Gmail.');
            }
        });
    };

    const confirmUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyingGoalId) return;

        router.post(`/savings/${verifyingGoalId}/unlock`, { code: verificationCode }, {
            onSuccess: () => {
                setVerifyingGoalId(null);
                setVerificationCode('');
            },
            onError: (err: any) => {
                if (err.code) toast.error(err.code);
            }
        });
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
                                    <form onSubmit={submit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Goal Name</Label>
                                            <Input 
                                                placeholder="e.g., Summer Vacation"
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)}
                                                className="h-14 rounded-2xl bg-muted/20 border-border/50 text-base font-black"
                                            />
                                            {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Amount (MAD)</Label>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0.00"
                                                    value={data.target_amount} 
                                                    onChange={e => setData('target_amount', e.target.value)}
                                                    className="h-14 rounded-2xl bg-muted/20 border-border/50 text-base font-black"
                                                />
                                                {errors.target_amount && <p className="text-xs text-destructive font-bold">{errors.target_amount}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Deposit (MAD)</Label>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Optional"
                                                    value={data.initial_deposit} 
                                                    onChange={e => setData('initial_deposit', e.target.value)}
                                                    className="h-14 rounded-2xl bg-primary/5 border-primary/20 text-base font-black focus:ring-primary/20"
                                                />
                                                {errors.initial_deposit && <p className="text-xs text-destructive font-bold">{errors.initial_deposit}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Date</Label>
                                            <div className="flex gap-4">
                                                <Input 
                                                    type="date"
                                                    value={data.target_date} 
                                                    onChange={e => setData('target_date', e.target.value)}
                                                    className="h-14 rounded-2xl bg-muted/20 border-border/50 text-base font-black"
                                                />
                                                <Button type="submit" disabled={processing} className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shrink-0">
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

                                        <div className="flex flex-col gap-4">
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
                                                <div className="h-10 w-10 flex items-center justify-center text-primary/40">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                            </div>

                                            {isLocked && (
                                                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-destructive">
                                                            <AlertTriangle className="h-3.5 w-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Emergency Access</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-destructive/60 tracking-widest">2.0% Protocol Fee</span>
                                                    </div>
                                                    <Button 
                                                        onClick={() => requestUnlock(goal.id)} 
                                                        variant="destructive" 
                                                        className="w-full h-10 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                                                    >
                                                        <Unlock className="mr-2 h-3.5 w-3.5" /> Emergency Unlock
                                                    </Button>
                                                </div>
                                            )}

                                            {!isLocked && (
                                                <div className="p-4 rounded-2xl bg-success/5 border border-success/10 flex items-center justify-center gap-2">
                                                    <Unlock className="h-4 w-4 text-success" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-success">Vault Unlocked</span>
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

                {/* Verification Modal */}
                <AnimatePresence>
                    {verifyingGoalId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md"
                            >
                                <Card className="border-2 border-destructive/20 shadow-elevated bg-card rounded-3xl overflow-hidden glass-card">
                                    <CardHeader className="p-8 text-center space-y-2">
                                        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                                            <ShieldCheck className="h-8 w-8" />
                                        </div>
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Security <span className="text-destructive italic">Check.</span></CardTitle>
                                        <CardDescription className="text-[10px] font-black uppercase tracking-widest">A 4-digit authorization code was sent to your Gmail.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <form onSubmit={confirmUnlock} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block text-center">Enter Authorization Code</Label>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0000"
                                                    value={verificationCode} 
                                                    onChange={e => setVerificationCode(e.target.value)}
                                                    className="h-16 text-center text-2xl font-black tracking-[0.5em] rounded-2xl bg-muted/20 border-destructive/20 focus:ring-destructive/20"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <Button type="button" variant="outline" onClick={() => setVerifyingGoalId(null)} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                                                <Button type="submit" variant="destructive" className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-destructive hover:bg-destructive shadow-lg">Confirm Liquidation</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
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

